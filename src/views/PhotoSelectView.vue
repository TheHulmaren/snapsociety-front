<template>
    <div class="flex flex-col w-full h-full gap-4">
        <div class="grow flex flex-col gap-4 overflow-y-scroll">
            <ul class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                <li v-for="photo in photos" :key="photo.id">
                    <img @click="onPhotoClicked(photo)" :src="photo.url ?? photo.thumbnailUrl"
                        class="w-full aspect-square object-contain rounded-md cursor-pointer border border-gray-700 transition-all duration-100 ease-in-out"
                        :class="{ 'border-main outline-offset-2 bg-gray-700': selection.some((s) => s.id === photo.id) }" />
                </li>
            </ul>
            <DefaultButton class="self-center" content="🛜 더보기" @click="onMoreClicked" />
        </div>
        <DefaultButton class="self-end" type="submit" @click="emit('onConfirm', selection)" :content="'✅ 선택 완료'">
        </DefaultButton>
    </div>
</template>
<script setup>
import axios from 'axios';
import DefaultButton from '@/components/DefaultButton.vue';
import { defineProps, onMounted, ref, defineEmits } from 'vue'
import { AuthHelper } from '@/helpers/AuthHelper';
import SectionHeader from '@/components/SectionHeader.vue';

const props = defineProps(['pageLimit', 'columns', 'initialSelection', 'selectionLimit'])
const photos = ref([])
const selection = ref([])

const emit = defineEmits(['onConfirm'])

var pageIndex = 0

const onMoreClicked = async () => {
    await addPhotos()
}

const addPhotos = async () => {
    try {
        let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/photos?breakpoints=thumbnail&PageLimit=${props.pageLimit}&PageIndex=${pageIndex}&photoSorts=Added&isDescending=true&includePreUploaded=false&uploaderId=${AuthHelper.getUser().id}`)
        if (result.data.length === 0) {
            alert("📁🛜 No more photos")
            return
        }
        photos.value.push(...result.data)
        pageIndex++
    }
    catch (e) {
        alert("📁🛜 Failed to load photos")
    }
}

const onPhotoClicked = (photo) => {
    if (selection.value.some((s) => s.id === photo.id)){
        deselectPhoto(photo)
        return
    }
    selectPhoto(photo)
}

const selectPhoto = (photo) => {
    if (selection.value.some((s) => s.id === photo.id)) {
        alert("📁🛜 You can't select the same photo twice")
        return
    }
    if (selection.value.length + 1 > props.selectionLimit) {
        alert("📁🛜 You can't select more than " + props.selectionLimit + " photos")
        return
    }
    selection.value.push(photo)
}

const deselectPhoto = (photo) => {
    selection.value = selection.value.filter((p) => p.id !== photo.id)
}

onMounted(async () => {
    selection.value = props.initialSelection ?? []
    await addPhotos()
})
</script>