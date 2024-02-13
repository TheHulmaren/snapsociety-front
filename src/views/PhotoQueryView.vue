<template>
    <div id="photoQueryView_div" class="flex flex-col gap-4">
        <div class="flex">
            <QueryParamsBuilder :initial="route.query.query?.split('_')" :option-tree="options"
                @query-changed="onQueryChanged" class="grow" />
            <!-- <button @click="onLayoutToggle"
                class="flex items-center justify-center text-xs px-4 py-1 rounded-full border-gray-500 border-0.5 mr-4">
                <span class="material-icons">{{ layout === "vertical" ? "수직" : "블록" }}</span>
            </button> -->
        </div>
        <div v-if="isUnsupportedQuery" class="flex flex-col items-center my-10 gap-2">
            <span class="font-semibold text-2xl text-main">🙏 Sorry..</span>
            <span class="font-sm text-text-dark">That query is not supported, yet.</span>
        </div>
        <Skeleton v-else-if="isLoading" />
        <PhotoVList v-else-if="!isEmpty && layout === 'vertical'" :photos="photos" />
        <PhotoMasonryList ref="masonryListRef" v-else-if="!isEmpty && layout === 'masonry'" :columns="3" />
        <div v-else>
            <div class="flex flex-col items-center my-10 gap-2">
                <span class="font-semibold text-2xl text-main">😱 Wow, emptiness!</span>
                <span class="font-sm text-text-dark">There are no posts, yet.</span>
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
import { ref, defineEmits, onMounted, defineProps } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AuthHelper } from '@/helpers/AuthHelper';

import QueryParamsBuilder from '@/components/QueryParamsBuilder.vue';
import PhotoVList from '../components/PhotoVList.vue';
import PhotoMasonryList from '@/components/PhotoMasonryList.vue';
import DefaultButton from '@/components/DefaultButton.vue';
import Skeleton from '@/components/Skeleton.vue';

const route = useRoute()
const router = useRouter()

const emit = defineEmits(['queryChanged'])
const props = defineProps(['uploaderId', 'defaultQuery'])

const photos = ref([])
const layout = ref('vertical')
const masonryListRef = ref()
const isUnsupportedQuery = ref(false)
const reachedEnd = ref(false)
const isLoading = ref(false)
const isEmpty = ref(false)

var pageIndex = 0
var pageLimit = 5
var currentQuery = ""

const options = [
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
        name: "🔥 인기"
    },
    {
        name: "🕗 업로드",
        options: [
            {
                name: "👇 최신 순"
            },
            {
                name: "👆 오래된 순"
            }
        ]
    }
]

const onLayoutToggle = async () => {
    layout.value = layout.value === "vertical" ? "masonry" : "vertical"
    pageIndex = 0
    pageLimit = layout.value === "vertical" ? 5 : 20
    await updatePhotos(route.query.query.split('_'))
}

const updatePhotos = async (query) => {
    reachedEnd.value = false
    photos.value = []
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

    if (result.length === 0) {
        isEmpty.value = true
        isLoading.value = false
        return
    }

    if (layout.value === "masonry") {
        masonryListRef.value.appendItems(result)
    }
    else {
        photos.value.push(...result)
    }
    isLoading.value = false
}

const onQueryChanged = async (query) => {
    router.push(route.path + '?query=' + Object.values(query).join('_'))
    await updatePhotos(query)
}

const queryTable = {
    // in korean
    "🔥 인기": async () => {
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/photos?breakpoints=Large&photoSorts=Hot&isDescending=true&includePreUploaded=false&pageIndex=${pageIndex}&pageLimit=${pageLimit}&hotLikesThreshold=1`
            + (props.uploaderId === undefined ? "" : `&uploaderId=${props.uploaderId}`));
        return result.data
    },
    "🏆 탑_🕗 지난 일주일": async () => {
        let d = new Date();
        d.setDate(d.getDate() - 7);
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/photos?breakpoints=Large&photoSorts=Top&isDescending=true&includePreUploaded=false&pageIndex=${pageIndex}&pageLimit=${pageLimit}&topLikesThreshold=1&fromUtc=${d.toISOString()}`
            + (props.uploaderId === undefined ? "" : `&uploaderId=${props.uploaderId}`));
        console.log(result.data)
        return result.data
    },
    "🏆 탑_🕗 지난 한달": async () => {
        let d = new Date();
        d.setDate(d.getDate() - 30);
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/photos?breakpoints=Large&photoSorts=Top&isDescending=true&includePreUploaded=false&pageIndex=${pageIndex}&pageLimit=${pageLimit}&topLikesThreshold=1&fromUtc=${d.toISOString()}`
            + (props.uploaderId === undefined ? "" : `&uploaderId=${props.uploaderId}`));
        return result.data
    },
    "🏆 탑_🕗 지난 1년": async () => {
        let d = new Date();
        d.setDate(d.getDate() - 365);
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/photos?breakpoints=Large&photoSorts=Top&isDescending=true&includePreUploaded=false&pageIndex=${pageIndex}&pageLimit=${pageLimit}&topLikesThreshold=1&fromUtc=${d.toISOString()}`
            + (props.uploaderId === undefined ? "" : `&uploaderId=${props.uploaderId}`));
        return result.data
    },
    "🏆 탑_🕗 전체": async () => {
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/photos?breakpoints=Large&photoSorts=Top&isDescending=true&includePreUploaded=false&pageIndex=${pageIndex}&pageLimit=${pageLimit}&topLikesThreshold=1`
            + (props.uploaderId === undefined ? "" : `&uploaderId=${props.uploaderId}`));
        return result.data
    },
    "🕗 업로드_👇 최신 순": async () => {
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/photos?breakpoints=Large&isDescending=true&includePreUploaded=false&pageIndex=${pageIndex}&pageLimit=${pageLimit}`
            + (props.uploaderId === undefined ? "" : `&uploaderId=${props.uploaderId}`));
        return result.data
    },
    "🕗 업로드_👆 오래된 순": async () => {
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/photos?breakpoints=Large&isDescending=false&includePreUploaded=false&pageIndex=${pageIndex}&pageLimit=${pageLimit}`
            + (props.uploaderId === undefined ? "" : `&uploaderId=${props.uploaderId}`));
        return result.data
    },
}

const fetchUserData = async (photos) => {
    await Promise.all(photos.map(async (photo) => {
        let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${photo.uploaderId}`);
        photo.user = result.data;
    }));

    return photos
}

const fetchLikeInfo = async (photos) => {
    await Promise.all(photos.map(async (photo) => {
        let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/likes/countLikes/photos/${photo.id}`);
        photo.likeCount = result.data;
        result = await axios.get(`${import.meta.env.VITE_API_URL}/api/likes/checkIfLiked/photos/${photo.id}/user/${AuthHelper.getUser().id}`);
        photo.isLikedByCurrentUser = result.data;
    }));

    return photos
}


onMounted(async () => {
    if (layout.value === "masonry") {
        pageLimit = 20
    }
    if (route.query.query !== undefined) {
        await updatePhotos(route.query.query.split('_'))
    }
    else if (props.defaultQuery !== undefined) {
        router.push(route.path + `?query=${props.defaultQuery}`)
    }

    let list = document.getElementById("photoQueryView_div")

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
            isLoading.value = true
            let result = await queryTable[currentQuery]();
            if (result.length === 0) {
                reachedEnd.value = true
                isLoading.value = false
                return
            }
            result = await fetchUserData(result);
            if (layout.value === "masonry") {
                masonryListRef.value.appendItems(result)
            }
            else {
                photos.value.push(...result)
            }
            console.log(photos.value)
            isLoading.value = false
        }
    })
})

</script>