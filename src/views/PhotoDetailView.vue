<template>
    <Skeleton v-if="isLoading" />
    <div v-else class="flex flex-col p-4 gap-6">
        <img :src="photo.largeUrl" class=" max-h-[450px] object-contain bg-gray-100 overflow-y-auto"
            @click="enlarged = !enlarged">
        <div class="flex justify-between items-center">
            <SectionHeader content="✍️ 제목과 설명" />
            <div v-if="photo.uploaderId === AuthHelper.getUser().id 
            || AuthHelper.getUser().roles.includes('Admin') 
            || AuthHelper.getUser().roles.includes('Mod')"
                class="flex gap-4 text-xs text-gray-500">
                <button @click="showEdit = !showEdit">수정</button>
                <button @click="onDelete" class="text-red-500">삭제</button>
            </div>
        </div>
        <div v-if="showEdit" class="flex flex-col items-end gap-2">
            <DefaultTextField v-model="titleEdit" :type="input" :placeholder="'제목'" />
            <DefaultTextField v-model="descEdit" :type="textarea" :placeholder="'설명'" />
            <button @click="onEdit" class="text-main">저장</button>
        </div>
        <div v-else class="flex flex-col gap-2">
            <h2 class=" text-xl">{{ photo.title }}</h2>
            <h3>{{ photo.desc }}</h3>
        </div>
        <SectionHeader content="👨‍💻 업로더" />
        <div class="flex gap-2 items-center">
            <img :src="photo.user?.profilePhotoUrl ?? '/default-prof-img.webp'" class="w-10 h-10 rounded-full object-cover">
            <div class="flex flex-col justify-between">
                <h3>{{ photo.user?.userName ?? '' }}</h3>
                <span class="text-xs">{{ TimeHelper.timeSince(new Date(photo.createdAtUtc)) }}</span>
            </div>
        </div>
        <SectionHeader content="💽 사진 정보" />
        <PhotoExifPanel v-if="photo.exifTags" :exif="photo.exifTags" class="max-w-[450px]" />
        <SectionHeader content="📝 이 사진이 포함된 게시글" />
        <PostVList :posts="relatedPosts" />
        <SectionHeader content="📷 비슷한 사진들" />
        <ul class="flex overflow-x-scroll gap-2">
            <li class=" shrink-0 " v-for="photo in relatedPhotos" :key="photo.id">
                <img @click="router.push({ name: 'photo-detail', params: { id: photo.id } })" :src="photo.thumbnailUrl"
                    class="w-20 h-20 rounded-md object-cover cursor-auto">
            </li>
        </ul>
    </div>
    <div v-if="enlarged" @click="enlarged = false" class="fixed w-screen h-screen top-0 left-0 z-30">
        <div class="w-full h-full absolute bg-black opacity-80">
        </div>
        <PhotoExifPanel v-if="photo.exifTags" :exif="photo.exifTags"
            class="absolute left-1/2 -translate-x-[50%] bottom-0 w-4/5 sm:max-w-[450px] z-50 mb-8" />
        <img :src="photo.largeUrl" class="w-full h-full object-contain relative z-40" @click="enlarged = !enlarged">
    </div>
</template>
<script setup>
import axios from 'axios'
import { ref, onMounted, watch, defineProps } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TimeHelper } from '@/helpers/TimeHelper';
import PhotoExifPanel from '@/components/PhotoExifPanel.vue';
import PhotoVList from '@/components/PhotoVList.vue';
import PostVList from '@/components/PostVList.vue';
import SectionHeader from '@/components/SectionHeader.vue';
import Skeleton from '@/components/Skeleton.vue';
import ModalWrapperView from './ModalWrapperView.vue';
import DefaultTextField from '@/components/DefaultTextField.vue';
import { AuthHelper } from '@/helpers/AuthHelper';

const route = useRoute()
const router = useRouter()

const photo = ref({});
const enlarged = ref(false);
const isLoading = ref(true);
const relatedPosts = ref([]);
const relatedPhotos = ref([]);

const titleEdit = ref("")
const descEdit = ref("")
const showEdit = ref(false)

watch(
    () => route.fullPath,
    async () => {
        await fetchData()
    }
);

const onEdit = async () => {
    await axios.put(`/api/photos/${route.params.id}`, {
        id: photo.value.id,
        lensId: photo.value.lensId,
        title: titleEdit.value,
        desc: descEdit.value,
        s3ThumbnailKey: photo.value.s3ThumbnailKey,
        s3LargeKey: photo.value.s3LargeKey,
        s3MediumKey: photo.value.s3MediumKey,
        s3SmallKey: photo.value.s3SmallKey,
    })
    photo.value.title = titleEdit.value
    photo.value.desc = descEdit.value
    showEdit.value = false
}

const onDelete = async () => {
    if (!confirm("🛑 정말로 삭제하시겠습니까?")) return
    await axios.delete(`/api/photos/${route.params.id}`)
    router.push({ name: 'home' })
}

const fetchData = async () => {
    let result = await axios.get(`/api/photos/${route.params.id}?breakpoints=Large&includeEmbedding=false`)
    let user = await axios.get(`/api/users/${result.data.uploaderId}`)
    photo.value = result.data
    titleEdit.value = result.data.title
    descEdit.value = result.data.desc
    photo.value.user = user.data

    result = await axios.get(`/api/forumArticles?photoId=${result.data.id}&PageLimit=5&articleSorts=Added&isDescending=true`)
    result = await Promise.all(result.data.map(async (article) => {
        article.user = (await axios.get(`/api/users/${article.authorId}`)).data
        return article
    }))
    relatedPosts.value = result


    let related = await axios.get(`/api/searchPhotos/${route.params.id}`)
    related.data = related.data.filter((id) => id !== route.params.id)
    related = await Promise.all(related.data.map(async (id) => {
        let photo = await axios.get(`/api/photos/${id}?breakpoints=Thumbnail&includeEmbedding=false`)
        return photo.data
    }
    ))
    relatedPhotos.value = related

}

onMounted(async () => {
    await fetchData()
    isLoading.value = false
})
</script>