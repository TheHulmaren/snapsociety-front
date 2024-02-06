<template>
    <div class="px-4 py-2 gap-4 flex items-center border-b-0.5 border-b-stroke-light">
        <h1 @click="router.push('/')" class="text-sm font-semibold text-main hover:cursor-pointer">
            Snap 📸<br>Society
        </h1>
        <form @submit.prevent="router.push('/search-photo?query=' + searchQuery)" class="grow">
            <input v-model="searchQuery" placeholder="🔍   사진을 간략히 묘사해 주세요.."
                class="py-2 px-4 rounded-full w-full bg-button-back-light border-0.5 border-stroke-light text-xs font-normal text-text-searchbar" />
        </form>
        <div class="relative">
            <img v-if="isAuthed" @click="onProfileClicked"
                class="w-8 h-8 rounded-full object-cover object-left-top hover:cursor-pointer"
                :src="user.profilePhotoUrl ?? '/default-prof-img.webp'">
            <button @click="router.push('/login')" v-else
                class="py-2 px-4 rounded-full border-0.5 border-main text-xs font-semibold text-main">
                Login
            </button>
            <div
                class="flex absolute top-100 right-0 rounded-xl bg-white shadow-md border-stroke-light border mt-2 transition-all">
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
    let result = await axios.get(`/api/users/${AuthHelper.getUser().id}`)
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