<template>
    <div id="postQueryView_div" class="flex flex-col gap-4">
        <QueryParamsBuilder :initial="route.query.query?.split('_')" :option-tree="options"
            @query-changed="onQueryChanged" />
        <div v-if="isUnsupportedQuery" class="flex flex-col items-center my-10 gap-2">
            <span class="font-semibold text-2xl text-main">🙏 Sorry..</span>
            <span class="font-sm">That query is not supported, yet.</span>
        </div>
        <Skeleton v-if="isLoading"/>
        <PostVList v-else-if="posts.length > 0" :posts="posts" />
        <div v-else>
            <div class="flex flex-col items-center my-10 gap-2">
                <span class="font-semibold text-2xl text-main">😱 Wow, emptiness!</span>
                <span class="font-sm">There are no posts, yet.</span>
            </div>
        </div>
        <div class="flex flex-col items-center text-base" v-if="reachedEnd">
            <span class=" font-semibold">✋ You've reached an end of the list<br></span>
            <span class=" text-sm">That was quite an effort, nice!</span>
        </div>
    </div>
</template>
<script setup>
import axios from 'axios';
import { ref, watch, defineEmits, defineProps, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AuthHelper } from '@/helpers/AuthHelper';
import QueryParamsBuilder from '@/components/QueryParamsBuilder.vue';
import PostVList from '../components/PostVList.vue';
import Skeleton from '@/components/Skeleton.vue';

const route = useRoute()
const router = useRouter()

const emit = defineEmits(['queryChanged'])
const props = defineProps(['authorId', 'articleType'])

const posts = ref([])
const isUnsupportedQuery = ref(false)
const reachedEnd = ref(false)
const isLoading = ref(false)

var pageIndex = 0
var pageLimit = 20
var currentQuery = ""
var articleType = ""

const options = [
    {
        name: "🕗 게시일",
        options: [
            {
                name: "👇 최신 순"
            },
            {
                name: "👆 오래된 순"
            }
        ]
    },
    {
        name: "🔥 인기"
    },
    {
        name: "🏆 탑",
        options: [
            {
                name: "🕗 지난 일주일"
            },
            {
                name: "🕗 지난 한달"
            },
            {
                name: "🕗 지난 1년"
            },
            {
                name: "🕗 전체"
            }
        ]
    },
    {
        name: "💬 댓글",
        options: [
            {
                name: "👇 댓글 많은 순",
                options: [
                    {
                        name: "🕗 지난 일주일"
                    },
                    {
                        name: "🕗 지난 한달"
                    },
                    {
                        name: "🕗 지난 1년"
                    },
                    {
                        name: "🕗 전체"
                    }
                ]
            },
            {
                name: "👆 댓글 적은 순",
                options: [
                    {
                        name: "🕗 지난 일주일"
                    },
                    {
                        name: "🕗 지난 한달"
                    },
                    {
                        name: "🕗 지난 1년"
                    },
                    {
                        name: "🕗 전체"
                    }
                ]
            }
        ]
    },
]

const updatePosts = async (query) => {
    reachedEnd.value = false
    posts.value = []
    currentQuery = Object.values(query).join('_');
    pageIndex = 0

    let matched = queryTable[currentQuery];
    if (matched === undefined) {
        isUnsupportedQuery.value = true
        return
    }
    isUnsupportedQuery.value = false
    isLoading.value = true
    emit('queryChanged', query)
    let result = await queryTable[currentQuery]();
    result = await fetchUserData(result);
    result = await fetchLikeInfo(result);
    posts.value.push(...result)
    isLoading.value = false
}

const onQueryChanged = async (query) => {
    router.push(route.path + '?query=' + Object.values(query).join('_'))
    await updatePosts(query)
}

const queryTable = {
    "🕗 게시일_👇 최신 순": async () => {
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles?articleSorts=Added&isDescending=true&pageIndex=${pageIndex}&pageLimit=${pageLimit}`
            + (props.articleType === undefined ? "" : `&articleType=${props.articleType}`)
            + (props.authorId === undefined ? "" : `&authorId=${props.authorId}`));
        return result.data
    },
    "🕗 게시일_👆 오래된 순": async () => {
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles?articleSorts=Added&isDescending=false&pageIndex=${pageIndex}&pageLimit=${pageLimit}`
            + (props.articleType === undefined ? "" : `&articleType=${props.articleType}`)
            + (props.authorId === undefined ? "" : `&authorId=${props.authorId}`));
        return result.data
    },
    "🔥 인기": async () => {
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles?articleSorts=Hot&pageIndex=${pageIndex}&pageLimit=${pageLimit}&hotLikesThreshold=1`
            + (props.articleType === undefined ? "" : `&articleType=${props.articleType}`)
            + (props.authorId === undefined ? "" : `&authorId=${props.authorId}`));
        return result.data
    },
    "💬 댓글_👇 댓글 많은 순_🕗 전체": async () => {
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles?articleSorts=Comments&isDescending=true&pageIndex=${pageIndex}&pageLimit=${pageLimit}`
            + (props.articleType === undefined ? "" : `&articleType=${props.articleType}`)
            + (props.authorId === undefined ? "" : `&authorId=${props.authorId}`));
        return result.data
    },
    "💬 댓글_👇 댓글 많은 순_🕗 지난 일주일": async () => {
        let d = new Date()
        d.setDate(d.getDate() - 7)
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles?articleSorts=Comments&isDescending=true&pageIndex=${pageIndex}&pageLimit=${pageLimit}&fromUtc=${d.toISOString()}`
            + (props.articleType === undefined ? "" : `&articleType=${props.articleType}`)
            + (props.authorId === undefined ? "" : `&authorId=${props.authorId}`));
        return result.data
    },
    "💬 댓글_👇 댓글 많은 순_🕗 지난 한달": async () => {
        let d = new Date()
        d.setDate(d.getDate() - 30)
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles?articleSorts=Comments&isDescending=true&pageIndex=${pageIndex}&pageLimit=${pageLimit}&fromUtc=${d.toISOString()}`
            + (props.articleType === undefined ? "" : `&articleType=${props.articleType}`)
            + (props.authorId === undefined ? "" : `&authorId=${props.authorId}`));
        return result.data
    },
    "💬 댓글_👇 댓글 많은 순_🕗 지난 1년": async () => {
        let d = new Date()
        d.setDate(d.getDate() - 365)
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles?articleSorts=Comments&isDescending=true&pageIndex=${pageIndex}&pageLimit=${pageLimit}&fromUtc=${d.toISOString()}`
            + (props.articleType === undefined ? "" : `&articleType=${props.articleType}`)
            + (props.authorId === undefined ? "" : `&authorId=${props.authorId}`));
        return result.data
    },
    "💬 댓글_👆 댓글 적은 순_🕗 전체": async () => {
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles?articleSorts=Comments&isDescending=false&pageIndex=${pageIndex}&pageLimit=${pageLimit}`
            + (props.articleType === undefined ? "" : `&articleType=${props.articleType}`)
            + (props.authorId === undefined ? "" : `&authorId=${props.authorId}`));
        return result.data
    },
    "💬 댓글_👆 댓글 적은 순_🕗 지난 일주일": async () => {
        let d = new Date()
        d.setDate(d.getDate() - 7)
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles?articleSorts=Comments&isDescending=false&pageIndex=${pageIndex}&pageLimit=${pageLimit}&fromUtc=${d.toISOString()}`
            + (props.articleType === undefined ? "" : `&articleType=${props.articleType}`)
            + (props.authorId === undefined ? "" : `&authorId=${props.authorId}`));
        return result.data
    },
    "💬 댓글_👆 댓글 적은 순_🕗 지난 한달": async () => {
        let d = new Date()
        d.setDate(d.getDate() - 30)
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles?articleSorts=Comments&isDescending=false&pageIndex=${pageIndex}&pageLimit=${pageLimit}&fromUtc=${d.toISOString()}`
            + (props.articleType === undefined ? "" : `&articleType=${props.articleType}`)
            + (props.authorId === undefined ? "" : `&authorId=${props.authorId}`));
        return result.data
    },
    "💬 댓글_👆 댓글 적은 순_🕗 지난 1년": async () => {
        let d = new Date()
        d.setDate(d.getDate() - 365)
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles?articleSorts=Comments&isDescending=false&pageIndex=${pageIndex}&pageLimit=${pageLimit}&fromUtc=${d.toISOString()}`
            + (props.articleType === undefined ? "" : `&articleType=${props.articleType}`)
            + (props.authorId === undefined ? "" : `&authorId=${props.authorId}`));
        return result.data
    },
    "🏆 탑_🕗 전체": async () => {
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles?articleSorts=Top&isDescending=true&pageIndex=${pageIndex}&pageLimit=${pageLimit}`
            + (props.articleType === undefined ? "" : `&articleType=${props.articleType}`)
            + (props.authorId === undefined ? "" : `&authorId=${props.authorId}`));
        return result.data
    },
    "🏆 탑_🕗 지난 일주일": async () => {
        let d = new Date()
        d.setDate(d.getDate() - 7)
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles?articleSorts=Top&isDescending=true&pageIndex=${pageIndex}&pageLimit=${pageLimit}&fromUtc=${d.toISOString()}`
            + (props.articleType === undefined ? "" : `&articleType=${props.articleType}`)
            + (props.authorId === undefined ? "" : `&authorId=${props.authorId}`));
        return result.data
    },
    "🏆 탑_🕗 지난 한달": async () => {
        let d = new Date()
        d.setDate(d.getDate() - 30)
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles?articleSorts=Top&isDescending=true&pageIndex=${pageIndex}&pageLimit=${pageLimit}&fromUtc=${d.toISOString()}`
            + (props.articleType === undefined ? "" : `&articleType=${props.articleType}`)
            + (props.authorId === undefined ? "" : `&authorId=${props.authorId}`));
        return result.data
    },
    "🏆 탑_🕗 지난 1년": async () => {
        let d = new Date()
        d.setDate(d.getDate() - 365)
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/forumArticles?articleSorts=Top&isDescending=true&pageIndex=${pageIndex}&pageLimit=${pageLimit}&fromUtc=${d.toISOString()}`
            + (props.articleType === undefined ? "" : `&articleType=${props.articleType}`)
            + (props.authorId === undefined ? "" : `&authorId=${props.authorId}`));
        return result.data
    },
}

const fetchUserData = async (posts) => {
    await Promise.all(posts.map(async (post) => {
        let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${post.authorId}`);
        post.user = result.data;
    }));

    return posts
}

const fetchLikeInfo = async (posts) => {
    await Promise.all(posts.map(async (post) => {
        let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/likes/countLikes/articles/${post.id}`);
        post.likeCount = result.data;
        result = await axios.get(`${import.meta.env.VITE_API_URL}/api/likes/checkIfLiked/articles/${post.id}/user/${AuthHelper.getUser().id}`);
        post.isLikedByCurrentUser = result.data;
    }));

    return posts
}

onMounted(async () => {
    articleType = props.articleType ?? 'null'

    if (route.query.query !== undefined) {
        await updatePosts(route.query.query.split('_'))
    }
    let list = document.getElementById("postQueryView_div")

    document.addEventListener("scroll", async () => {
        let top = (window.scrollY || document.documentElement.scrollTop)
        let clientRect = list.getBoundingClientRect()
        // below filtering is necessary, otherwise it will fire too many times
        // might be related to chrome caching or vue virtual DOM? i dont know
        if (clientRect.top > -50) {
            return
        }

        let listBottom = clientRect.bottom + top
        var screenBottom = top + window.innerHeight

        if (listBottom <= screenBottom + 50 && !reachedEnd.value && !isLoading.value) {
            pageIndex++
            let result = await queryTable[currentQuery]();
            result = await fetchUserData(result);
            result = await fetchLikeInfo(result);
            if (result.length === 0) {
                reachedEnd.value = true
                return
            }
            result = await fetchUserData(result);
            posts.value.push(...result)
        }
    })
})

</script>