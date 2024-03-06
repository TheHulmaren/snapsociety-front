<template>
    <div class="flex flex-col gap-6 p-4">
        <SectionHeader :content="'✍️ 글쓰기'" />
        <ul class="flex flex-wrap gap-2">
            <li v-for="articleType in articleTypes" :key="articleType.slug">
                <DefaultButton @click="onTypeClicked(articleType)"
                    :type="articleType.permissions.includes(AuthHelper.getUser().roles[0]) ? 'primary' : 'disabled'"
                    :content="articleType.name" :is-selected="articleType.slug === post.articleTypeId" />
            </li>
        </ul>
        <form
            class="flex flex-col gap-4 [&_.ck-content]:prose [&_.ck-content]:prose-slate [&_.ck-content]:prose-invert [&_.ck-content]:max-w-none">
            <DefaultTextField v-model="post.title" :placeholder="'제목'" />
            <ckeditor :editor="Editor" v-model="editorHTML" />
        </form>
        <SectionHeader v-if="post.articleTypeId === 'photo' && photos.length > 0"
            :content="'💁‍♂️ 드래그 앤 드롭으로 사진의 순서를 조정할 수 있습니다'" />
        <span class="rounded border-gray-700 border-0.5 bg-gray-800 px-4 py-1 w-fit text-xs">이미지 수: <span
                :class="photos.length > 10 ? 'text-red-500' : 'text-green-500'">{{ photos.length }}</span>/10</span>
        <draggable v-if=" post.articleTypeId === 'photo' && photos.length > 0 " v-bind=" dragOptions "
            class="flex flex-col gap-4" v-model=" photos " group="people" @start="drag = true" @end="drag = false"
            item-key="data.id">
            <template #item="{ element }">
                <li class="flex items-stretch gap-2 w-full">
                    <img :src=" element.data.thumbnailUrl "
                        class="w-1/4 md:w-1/6 aspect-square rounded object-contain bg-gray-800 border-0.5 border-gray-700">
                    <textarea type="text" v-model=" element.caption " placeholder="(선택) 사진 아래에 보일 캡션을 적어주세요!"
                        class="w-full py-2 px-4 rounded grow bg-gray-950 border-0.5 border-gray-700 font-normal"></textarea>
                </li>
            </template>
        </draggable>
        <span v-if=" post.articleTypeId === 'photo' " class="text-xs self-center">아직 사진을 업로드하지 않으셨나요? <RouterLink
                to="/submit/photo" class="underline">업로드 하러가기</RouterLink></span>
        <DefaultButton v-if=" post.articleTypeId === 'photo' " class="self-center" content="🎞️ 사진 선택"
            @click="showModal = true"></DefaultButton>
        <DefaultButton v-if=" props.mode === 'write' || props.mode === undefined " class="self-end" type="submit"
            @click=" onPostSubmit " :content=" '글쓰기' "></DefaultButton>
        <DefaultButton v-else class="self-end" type="submit" @click=" onPostEdit " :content=" '수정하기' "></DefaultButton>
        <ModalWrapperView v-if=" showModal " @on-close="showModal = false">
            <PhotoSelectView :page-limit=" 10 " :columns=" 2 " v-model=" selection " @on-confirm=" onSelectionConfirmed "
                :initial-selection=" photos.map((p) => p.data) " />
        </ModalWrapperView>
    </div>
</template>
<script setup>
import draggable from 'vuedraggable'
import { ref, onMounted, defineProps, watch } from 'vue'
import axios from 'axios'
import { AuthHelper } from '@/helpers/AuthHelper';
import { useRouter } from 'vue-router'
import PhotoSelectView from './PhotoSelectView.vue';
import ModalWrapperView from './ModalWrapperView.vue';
import SectionHeader from '@/components/SectionHeader.vue';
import DefaultButton from '@/components/DefaultButton.vue';
import PhotoVCard from '@/components/PhotoVCard.vue';
import DefaultTextField from '@/components/DefaultTextField.vue';

import Editor from '../Editor'
import '../assets/ckeditor-custom.css';


const router = useRouter()

const props = defineProps(['mode', 'id'])

const post = ref({
    authorId: "",
    title: "",
    articleTypeId: "photo"
})

const showModal = ref(false)
const selection = ref({})
const photos = ref([])
const drag = ref(false)
const editorHTML = ref("")

const editorConfig = {
    toolbar: {
        items: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'imageInsert',
            'blockQuote',
            'insertTable',
            'undo',
            'redo'
        ]
    },
    language: 'ko',
    table: {
        contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells'
        ]
    },
    height: 300
}

const dragOptions = {
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: "ghost"
}

const articleTypes = [
    {
        name: "📸 사진",
        slug: "photo",
        permissions: ["User", "Admin", "Mod"]
    },
    {
        name: "📝 잡담",
        slug: "casual",
        permissions: ["User", "Admin", "Mod"]
    },
    {
        name: "🙋 질문",
        slug: "ask",
        permissions: ["User", "Admin", "Mod"]
    },
    {
        name: "➡️👨‍💻 개발자에게",
        slug: "to-dev",
        permissions: ["User", "Admin", "Mod"]
    },
    {
        name: "⬅️👨‍💻 개발자로부터",
        slug: "from-dev",
        permissions: ["Admin"]
    }
]


onMounted(async () => {
    post.value.authorId = AuthHelper.getUser().id

    if (props.mode === "edit") {
        await loadEditInitialData()
    }
})

const onSelectionConfirmed = (selectedPhotos) => {
    selection.value = selectedPhotos
    photos.value = selectedPhotos.map((photo) => {
        return {
            data: {
                ...photo,
                url: photo.mediumUrl
            },
            caption: photos.value.find((p) => p.data.id === photo.id)?.caption ?? ""
        }
    })

    showModal.value = false
}

const loadEditInitialData = async () => {
    let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles/${props.id}`)
    post.value = result.data

    editorHTML.value = post.value.contentText
    if (result.data.articleTypeId !== "photo") {
        return
    }

    photos.value = (await Promise.all(post.value.articlePhotos.map(async (photo) => {
        let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/photos/${photo.photoId}?breakpoints=thumbnail`)

        return {
            data: result.data,
            caption: photo.caption,
            order: photo.order
        }
    }))).sort((a, b) => a.order - b.order)

    selection.value = photos.value.map((photo) => photo.data)
}

const onTypeClicked = (type) => {
    if (!type.permissions.includes(AuthHelper.getUser().roles[0])) {
        alert("🛑 해당 카테고리의 게시글을 작성할 권한이 없습니다")
        return
    }
    post.value.articleTypeId = type.slug
}

const validatePost = () => {
    let content = editorHTML.value
    if (post.value.title === "" || content === "") {
        alert("📁⁉️ 제목과 내용을 입력해 주세요!")
        return false
    }

    if (post.value.articleTypeId === "photo" && photos.value.length === 0) {
        alert("📁⁉️ 사진을 최소 한장 선택해 주세요")
        return false
    }

    return true
}

const onPostEdit = async () => {

    if (!validatePost()) {
        return
    }

    if(photos.value.length > 10){
        alert("📁🛜 사진은 최대 10장까지만 첨부할 수 있어요!")
        return
    }

    let articleId = null
    var contentTextHtml = editorHTML.value
    try {
        let result = await axios.put(`${import.meta.env.VITE_API_URL}/api/forumArticles/${props.id}`,
            {
                ...post.value,
                contentText: contentTextHtml
            })
        articleId = result.data.id

        let articlePhotos = photos.value.map((photo, index) => {
            return {
                articleId: articleId,
                photoId: photo.data.id,
                caption: photo.caption,
                order: index
            }
        })

        if (post.value.articleTypeId === "photo") {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/forumArticles/${articleId}/photos`, articlePhotos)
        }

        // go to the post
        router.push(`/posts/${articleId}`)
        alert("✅ Edited!")
    }
    catch (e) {
        console.log(e)
        alert("🛜⁉️ Failed to edit")
    }
}

const onPostSubmit = async () => {
    if (!validatePost()) {
        return
    }

    if(photos.value.length > 10){
        alert("📁🛜 사진은 최대 10장까지만 첨부할 수 있어요!")
        return
    }

    let articleUploaded = false
    let articleId = null
    var contentTextHtml = editorHTML.value

    try {
        let result = await axios.post(import.meta.env.VITE_API_URL + "/api/forumArticles",
            {
                ...post.value,
                contentText: contentTextHtml
            })
        articleId = result.data.id
        articleUploaded = true

        let articlePhotos = photos.value.map((photo, index) => {
            return {
                articleId: articleId,
                photoId: photo.data.id,
                caption: photo.caption,
                order: index
            }
        })

        if (post.value.articleTypeId === "photo") {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/forumArticles/${articleId}/photos`, articlePhotos)
        }

        router.push("/main/all?query=🕗%20게시일_👇%20최신%20순")
        alert("✅ Posted!")
    }
    catch (e) {
        if (articleUploaded) {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/forumArticles/${articleId}`)
        }
        alert("🛜⁉️ Failed to post")
    }
}
</script>
