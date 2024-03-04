<template>
    <div class="px-4 py-2 gap-4 flex items-center border-b-0.5 border-b-stroke-light dark:border-b-gray-800">
        <img @click="router.push('/')" src="/icon-512-maskable.png" class="w-8 h-8 rounded hover:cursor-pointer"/>
        <form @submit.prevent="router.push('/search-photo?query=' + searchQuery)" class="grow">
            <input v-model="searchQuery" placeholder="🔍   사진을 묘사해 주세요!"
                class="py-2 px-4 rounded w-full bg-button-back-light dark:bg-gray-950 border border-gray-700 text-xs font-normal text-text-searchbar focus:outline-none focus:ring-2 ring-main transition duration-200 ease-in-out" />
        </form>
        <div class="relative">
            <img v-if="isAuthed" @click="onProfileClicked"
                class="w-8 h-8 rounded-full object-cover object-left-top hover:cursor-pointer outline-main outline"
                :src="user.profilePhotoUrl ?? '/default-prof-img.webp'">
            <button @click="router.push('/login')" v-else
                class="py-2 px-4 rounded border-0.5 border-gray-700 text-xs font-semibold text-main">
                로그인
            </button>
            <div
                class="flex absolute top-100 right-0 rounded border-gray-700 border mt-2 transition-all  z-50">
                <ProfileActions v-if="isAuthed && showProfileActions" @on-select="showProfileActions = false" />
            </div>
        </div>
    </div>
</template>
<script setup>
import axios from 'axios';
import { AuthHelper } from '@/helpers/AuthHelper';
import { onMounted, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProfileActions from './ProfileActions.vue'

const route = useRoute();
const router = useRouter();

const isAuthed = ref(false);
const showProfileActions = ref(false);
const searchQuery = ref("");
const user = ref({});

onMounted(async () => {
    console.log("Checking if authed")
    isAuthed.value = await AuthHelper.checkIfAuthed()
})

watch(
    () => route.fullPath,
    async () => {
        // Update User info display whenever the route changes.
        isAuthed.value = await AuthHelper.checkIfAuthed();
        fetchUserData();
    }
)

const fetchUserData = async () => {
    if (!isAuthed.value) {
        return
    }
    let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${AuthHelper.getUser().id}`)
    user.value = result.data
}

const onProfileClicked = () => {
    if (!isAuthed.value) {
        router.push('/login')
        return
    }
    showProfileActions.value = !showProfileActions.value
    fetchUserData()
}
</script>