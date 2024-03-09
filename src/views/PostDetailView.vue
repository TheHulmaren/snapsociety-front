<template>
    <Skeleton v-if="isLoading" />
    <div v-else class="flex flex-col gap-4 py-4">
        <div class="flex items-center justify-between px-4">
            <SectionHeader :content="`👩‍💻 Post ID: ${post.id}`" />
            <div class="gap-4 flex"
                v-if="post.authorId === AuthHelper.getUser()?.id || AuthHelper.getUser()?.roles?.some((r) => r === 'Admin' || r === 'Mod')">
                <button v-if="post.authorId === AuthHelper.getUser()?.id" @click="onPostEdit" class="text-xs">수정하기</button>
                <button @click="onPostDelete" class="text-xs text-red-500">삭제하기</button>
            </div>
        </div>
        <div class="flex flex-col gap-2 px-4">
            <span class="text-xs py-1 px-2 w-fit rounded bg-gray-800 border-0.5 border-gray-700 text-nowrap">{{
                articleType.titleBefore
            }}</span>
            <h2 class="flex items-center gap-2 text-xl text-gray-300"> {{ post.title }}</h2>
            <div @click="router.push('/user/' + post.authorId)"
                class="flex text-xs gap-2 items-stretch cursor-pointer mt-2">
                <img :src="post.user?.profilePhotoUrl ?? '/default-prof-img.webp'"
                    class="w-10 h-10 rounded-full object-cover">
                <div class="flex flex-col justify-around font-semibold">
                    <h3>{{ post.user?.userName }}</h3>
                    <span class="text-xs text-gray-600">{{ TimeHelper.timeSince(new Date(post.createdAtUtc)) }}</span>
                </div>
            </div>
        </div>
        <ul v-if="post.articleTypeId === 'photo'" class="flex flex-col gap-2">
            <div v-if="photos.length === 0" class="flex flex-col items-center justify-center gap-2">
                <h3 class="text-xl font-semibold">❌ No photos</h3>
                <p class="text-sm">This post has no photos.</p>
            </div>
            <div v-else class="flex flex-col items-center" v-for="photo in photos" :key="photo.id">
                <PhotoVCard :photo="photo" />
                <div class="px-4 w-full">

                    <PhotoExifPanel :exif="photo.exifTags" class="w-full sm:w-[450px]" />
                </div>
                <p class="mt-2">{{ photo.caption }}</p>
            </div>
        </ul>
        <div v-html="post.contentText" class="px-4 prose prose-slate prose-invert "></div>
        <div class="flex flex-col justify-center gap-4 px-4">
            <div class="flex w-full font-normal text-xs gap-4 items-center">
                <SectionHeader :content="`📊 Stats`" />
                <span>{{ TimeHelper.timeSince(new Date(post.createdAtUtc)) }} 전</span>
                <span>댓글 {{ commentCount }}</span>
                <span>조회수 {{ viewCount }}</span>
            </div>
            <button @click="onLikeClicked" class="text-2xl">{{ post.isLikedByCurrentUser ? '❤️' : '🩶' }} {{ post.likeCount
            }}</button>
        </div>
        <SectionHeader class="mx-4"
            :content="`${articleType.commentBefore} ${comments.length} ${articleType.commentAfter}`" />
        <ul class="flex flex-col divide-y-0.5 divide-gray-800">
            <li class="relative flex flex-col" v-for="comment in comments" :key="comment.id">
                <div class="flex gap-2 items-start p-2">
                    <img :src="comment.user?.profilePhotoUrl ?? '/default-prof-img.webp'"
                        @click="router.push('/user/' + comment.authorId)"
                        class="w-4 h-4 object-cover rounded-full cursor-pointer">
                    <div class="flex flex-col grow">
                        <div class="flex gap-2 items-center text-[11px]">
                            <h3 class=" ">{{
                                comment.user?.userName }}</h3>
                            <span class="text-gray-500">{{ TimeHelper.timeSince(new Date(comment.createdAtUtc)) }}</span>
                            <span v-if="AuthHelper.getUser()?.id === comment.authorId"
                                class="font-semibold text-main  rounded text-[11px]">me</span>
                            <span v-else-if="comment.authorId === post.authorId"
                                class="font-semibold text-blue-500  rounded text-[11px]">op</span>
                            <div class="grow"></div>
                            <div class="flex gap-4">
                                <button
                                    @click="replyIndex = replyIndex === undefined ? comment.id : undefined; replyContent = ''"
                                    class="">
                                    답글</button>
                                <button
                                    @click="commentEditIndex = commentEditIndex === comment.id ? undefined : comment.id; commentEditContent = comment.content; console.log(commentEditIndex)"
                                    v-if="AuthHelper.getUser()?.id === comment.authorId" class=" ">수정</button>
                                <button @click="onCommentDelete(comment)"
                                    v-if="AuthHelper.getUser()?.id === comment.authorId || (AuthHelper.getUser()?.roles ?? []).some(r => r === 'Admin')"
                                    class=" text-red-500 ">삭제</button>
                            </div>
                        </div>
                        <p v-if="commentEditIndex !== comment.id" class="py-2 text-sm">{{ comment.content }}</p>
                        <div v-else class="flex flex-col gap-2 mt-2 justify-end">
                            <DefaultTextField v-model="commentEditContent" :placeholder="'Edit comment'" class="" />
                            <div class="flex gap-2 justify-end">
                                <DefaultButton @click="commentEditIndex = undefined; commentEditContent = ''"
                                    :type="'cancel'" :content="'취소'" />
                                <DefaultButton @click="onCommentEditSubmit" :type="'submit'" :content="'저장'" />
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <div class="absolute w-[1px] h-[calc(100%-28px)] bottom-0 left-[10px] bg-gray-700"></div> -->
                <ul class="flex flex-col divide-y-0.5 divide-gray-800 border-t-0.5 border-gray-800 bg-gray-950">
                    <li class="relative flex flex-col gap-2 p-2 pl-4 border-l-4 border-gray-800"
                        v-for="reply in comment.replies" :key="reply.id">
                        <div class="flex gap-2 items-start">
                            <img :src="reply.user?.profilePhotoUrl ?? '/default-prof-img.webp'"
                                @click="router.push('/user/' + comment.authorId)"
                                class="w-4 h-4 object-cover rounded-full cursor-pointer">
                            <div class="flex flex-col grow">
                                <div class="flex gap-2 items-center text-[11px]">
                                    <h3 class="  ">{{
                                        reply.user?.userName }}</h3>
                                    <span class=" text-gray-500">{{ TimeHelper.timeSince(new Date(reply.createdAtUtc))
                                    }}</span>
                                    <span v-if="AuthHelper.getUser()?.id === reply.authorId"
                                        class="font-semibold text-main  rounded text-[11px]">me</span>
                                    <span v-else-if="reply.authorId === post.authorId"
                                        class="font-semibold text-blue-500  rounded text-[11px]">op</span>
                                    <div class="grow"></div>
                                    <div class="flex gap-4">
                                        <button
                                            @click="commentEditIndex = commentEditIndex === reply.id ? undefined : reply.id; commentEditContent = reply.content; console.log(commentEditIndex)"
                                            v-if="AuthHelper.getUser()?.id === reply.authorId" class="">수정</button>
                                        <button @click="onCommentDelete(reply)"
                                            v-if="AuthHelper.getUser()?.id === reply.authorId || (AuthHelper.getUser()?.roles ?? []).some(r => r === 'Admin')"
                                            class=" text-red-500">삭제</button>
                                    </div>
                                </div>
                                <p v-if="commentEditIndex !== reply.id" class="py-2 text-sm">{{
                                    reply.content }}</p>
                                <textarea v-else v-model="commentEditContent" placeholder="Edit comment"
                                    class="py-1 px-2 bg-back rounded-lg border-main border-0.5"
                                    oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'></textarea>
                            </div>
                        </div>
                        <div v-if="commentEditIndex === reply.id" class="flex gap-2 justify-end">
                            <button @click="commentEditIndex = undefined; commentEditContent = ''"
                                class="px-4 py-1 rounded-full border-0.5 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold text-xs w-fit">Cancel</button>
                            <button @click="onCommentEditSubmit"
                                class="px-4 py-1 rounded-full border-0.5 border-main text-main hover:bg-main hover:text-white font-semibold text-xs w-fit">Confirm</button>
                        </div>
                        <!-- <div class="absolute w-[1px] h-[calc(100%-24px)] bottom-0 left-[8px] bg-gray-700"></div> -->
                    </li>
                    <li v-if="replyIndex === comment.id && AuthHelper.getUser() !== null"
                        class="relative flex flex-col gap-2 p-2 border-l-4 border-gray-800">
                        <div class="flex gap-2 items-start">
                            <img :src="currentUser.profilePhotoUrl ?? '/default-prof-img.webp'"
                                class="w-4 h-4 object-cover rounded-full">
                            <div class="flex flex-col gap-2 grow">
                                <div class="flex gap-2 items-center text-[11px]">
                                    <h3 class="">{{ AuthHelper.getUser()?.username }}</h3>
                                    <span class=" text-main font-semibold">New</span>
                                </div>
                                <DefaultTextField v-model="replyContent" :placeholder="'댓글을 남겨주세요'" class="" />
                            </div>
                        </div>
                        <DefaultButton @click="onReplySubmit" :type="'submit'" :content="'등록'" class="ml-auto">
                        </DefaultButton>
                    </li>
                </ul>
            </li>
            <li v-if="AuthHelper.getUser() !== null"
                class="relative flex flex-col gap-2 p-2 border-l-4 border-main bg-gray-700">
                <div class="flex gap-2 items-start">
                    <img :src="currentUser.profilePhotoUrl ?? '/default-prof-img.webp'"
                        class="w-4 h-4 object-cover rounded-full">
                    <div class="flex flex-col gap-2 grow">
                        <div class="flex gap-2 items-center text-[11px]">
                            <h3 class="">{{ AuthHelper.getUser()?.username }}</h3>
                            <span class=" text-main font-semibold">New</span>
                        </div>
                        <DefaultTextField v-model="commentContent" :placeholder="'댓글을 남겨주세요'" class="" />
                    </div>
                </div>
                <DefaultButton @click="onCommentSubmit" :type="'submit'" :content="'등록'" class="ml-auto"></DefaultButton>
            </li>
        </ul>
        <ul ref="pageButtonsRef" class="flex gap-2 flex-wrap justify-center">
            <li v-for="index in Math.ceil(commentCount / commentPageSize)">
                <button @click="onPageClick(index)" :class="{ 'shadow-md text-gray-300': index === commentPage + 1 }"
                    class="px-4 py-1 rounded border-0.5 border-gray-700 bg-gray-800 hover:text-gray-300 shadow-main transition duration-100 ease-in-out">{{
                        index }}</button>
            </li>
        </ul>
    </div>
</template>
<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AuthHelper } from '@/helpers/AuthHelper';
import { TimeHelper } from '@/helpers/TimeHelper';
import PhotoVCard from '@/components/PhotoVCard.vue';
import PhotoExifPanel from '@/components/PhotoExifPanel.vue';
import SectionHeader from '@/components/SectionHeader.vue';
import Skeleton from '@/components/Skeleton.vue';
import DefaultTextField from '@/components/DefaultTextField.vue';
import DefaultButton from '@/components/DefaultButton.vue';


const router = useRouter()
const route = useRoute()

const post = ref({})
const currentUser = ref({})
const photos = ref([])
const isLoading = ref(false)
const comments = ref([])
const replyIndex = ref()
const replyContent = ref("")
const commentContent = ref("")
const commentCount = ref(50)
const commentEditIndex = ref()
const commentEditContent = ref("")
const pageButtonsRef = ref()
const articleType = ref({})
const viewCount = ref(0)

var commentPage = 0
var commentPageSize = 15
const articleTypes = [
    {
        name: "📸 사진",
        slug: "photo",
        titleBefore: "📸 사진",
        commentBefore: "💬",
        commentAfter: "댓글",
    },
    {
        name: "📝 잡담",
        slug: "casual",
        titleBefore: "📝 잡담",
        commentBefore: "💬",
        commentAfter: "댓글",
    },
    {
        name: "🙋 질문",
        slug: "ask",
        titleBefore: "𝐐. 질문",
        commentBefore: "𝐀.",
        commentAfter: "답변",
    },
    {
        name: "➡️👨‍💻 개발자에게",
        slug: "to-dev",
        titleBefore: "➡️👨‍💻 개발자에게",
        commentBefore: "👨‍💻",
        commentAfter: "답변",
    },
    {
        name: "⬅️👨‍💻 개발자로부터",
        slug: "from-dev",
        titleBefore: "⬅️👨‍💻 개발자로부터",
        commentBefore: "👨‍💻",
        commentAfter: "댓글",
    }
]

const onPostDelete = async () => {
    if (!confirm("🛑 정말로 이 글을 삭제하시겠어요?")) {
        return
    }

    try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/forumArticles/${route.params.id}`)
    } catch (e) {
        alert("🛜⁉️ Failed to delete post")
        return
    }

    router.push('/main')
}

const onPostEdit = async () => {
    router.push(`/edit/post/${route.params.id}`)
}

const onLikeClicked = async () => {
    if(AuthHelper.getUser() === null){
        alert("🛑 로그인 후에 좋아요를 누르실 수 있어요!")
        return
    }
    if (post.value.isLikedByCurrentUser) {
        let result = await axios.post(`${import.meta.env.VITE_API_URL}/api/likes/decrementLikes/articles/${route.params.id}/user/${AuthHelper.getUser().id}`)
        post.value.likeCount = result.data.likeCount
        post.value.isLikedByCurrentUser = false
        return
    }
    let result = await axios.post(`${import.meta.env.VITE_API_URL}/api/likes/incrementLikes/articles/${route.params.id}/user/${AuthHelper.getUser().id}`)
    post.value.likeCount = result.data.likeCount
    post.value.isLikedByCurrentUser = true
}

const onPageClick = async (index) => {
    commentPage = index - 1
    await updateComments()
    pageButtonsRef.value.scrollIntoView()
}

const onCommentEditSubmit = async () => {
    if (commentEditContent.value === "") {
        alert("✋ Comment cannot be empty!")
        return
    }

    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/comments/${commentEditIndex.value}`, {
            content: commentEditContent.value
        })
    } catch (e) {
        alert("🛜⁉️ Failed to edit comment")
        return
    }

    commentEditIndex.value = undefined
    commentEditContent.value = ""
    await updateComments()
}

const onReplySubmit = async () => {
    if (replyContent.value === "") {
        alert("✋ Reply cannot be empty!")
        return
    }

    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/comments`, {
            authorId: AuthHelper.getUser().id,
            articleId: route.params.id,
            content: replyContent.value,
            parentCommentId: replyIndex.value
        })
    } catch (e) {
        alert("🛜⁉️ Failed to post reply")
        return
    }

    await updateComments()
    replyContent.value = ""
}

const onCommentSubmit = async () => {
    if (commentContent.value === "") {
        alert("✋ Comment cannot be empty!")
        return
    }

    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/comments`, {
            authorId: AuthHelper.getUser().id,
            articleId: route.params.id,
            content: commentContent.value,
            parentCommentId: null
        })
    } catch (e) {
        alert("🛜⁉️ Failed to post comment")
        return
    }

    let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/comments/count?articleId=${route.params.id}`)
    commentCount.value = result.data

    // last 
    commentPage = Math.ceil(commentCount.value / commentPageSize) - 1
    await updateComments()
    commentContent.value = ""
}

const onCommentDelete = async (comment) => {
    if (!confirm("🛑 Do you really want to delete this comment?")) {
        return
    }

    try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/comments/${comment.id}`)
    } catch (e) {
        alert("🛜⁉️ Failed to delete comment")
        return
    }

    let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/comments/count?articleId=${route.params.id}`)
    commentCount.value = result.data

    // last 
    commentPage = Math.ceil(commentCount.value / commentPageSize) - 1
    await updateComments()
}

const updateComments = async () => {
    let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/comments?articleId=${route.params.id}&forumCommentSorts=Added&isDescending=false&pageIndex=${commentPage}&pageLimit=${commentPageSize}`)

    await Promise.all(result.data.map(async (comment) => {
        comment.user = (await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${comment.authorId}`)).data
        comment.replies = (await axios.get(`${import.meta.env.VITE_API_URL}/api/comments/${comment.id}/replies`)).data
        comment.replies = await Promise.all(comment.replies.map(async (reply) => {
            reply.user = (await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${reply.authorId}`)).data
            return reply
        }))
    }))

    comments.value = result.data
}

onMounted(async () => {
    isLoading.value = true
    let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles/${route.params.id}`)
    result.data.user = (await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${result.data.authorId}`)).data
    post.value = result.data

    articleType.value = articleTypes.filter((t) => t.slug === post.value.articleTypeId)[0]

    result = await axios.get(`${import.meta.env.VITE_API_URL}/api/photos?breakpoints=Large&articleId=${route.params.id}&photoSorts=Added&isDescending=true&includePreUploaded=false&pageIndex=0&pageLimit=100`)

    photos.value = result.data.map((photo) => {
        return {
            ...photo,
            url: photo.largeUrl,
            username: post.value.username,
            caption: post.value.articlePhotos.filter((p) => p.photoId === photo.id)[0].caption,
            order: post.value.articlePhotos.filter((p) => p.photoId === photo.id)[0].order
        }
    }).sort((a, b) => a.order - b.order)

    result = await axios.get(`${import.meta.env.VITE_API_URL}/api/comments?articleId=${route.params.id}&forumCommentSorts=Added&isDescending=false&pageIndex=0&pageLimit=${commentPageSize}`)
    console.log(result.data)

    await Promise.all(result.data.map(async (comment) => {
        comment.user = (await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${comment.authorId}`)).data
        comment.replies = (await axios.get(`${import.meta.env.VITE_API_URL}/api/comments/${comment.id}/replies`)).data
        comment.replies = await Promise.all(comment.replies.map(async (reply) => {
            reply.user = (await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${reply.authorId}`)).data
            return reply
        }))
    }))

    comments.value = result.data

    result = await axios.get(`${import.meta.env.VITE_API_URL}/api/comments/count?articleId=${route.params.id}`)
    commentCount.value = result.data

    result = await axios.get(`${import.meta.env.VITE_API_URL}/api/likes/countLikes/articles/${route.params.id}`)
    post.value.likeCount = result.data

    if (AuthHelper.getUser() === null) {
        post.value.isLikedByCurrentUser = false
    }
    else {
        result = await axios.get(`${import.meta.env.VITE_API_URL}/api/likes/checkIfLiked/articles/${route.params.id}/user/${AuthHelper.getUser().id}`)
        post.value.isLikedByCurrentUser = result.data
    }

    // update view count
    result = await axios.post(`${import.meta.env.VITE_API_URL}/api/forumArticles/${route.params.id}/view`)
    viewCount.value = result.data.count

    if (AuthHelper.getUser() === null) {
        currentUser.value = null
    } else {
        // fetch current user
        currentUser.value = (await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${AuthHelper.getUser().id}`)).data
    }


    isLoading.value = false
})
</script>