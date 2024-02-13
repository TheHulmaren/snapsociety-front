<template>
    <div class="p-4 flex flex-col gap-4">
        <form @submit.prevent="onBanSubmit" class="flex flex-col gap-2">
            <lebal for="id">ID</lebal>
            <input type="text" id="id" v-model="userBan.userId">
            <label for="banReason">Reason</label>
            <textarea id="banReason" v-model="userBan.reason"></textarea>
            <label for="banDays">Days</label>
            <input type="number" id="banDays" v-model="userBan.days">
            <button class=" text-red-500" type="submit">Ban</button>
        </form>
        <span class=" text-red-500" v-if="isSucceded">Banned: {{ userBan.userId }} for {{ userBan.days }} days</span>
        <h3 class="font-bold">Banned User List</h3>
        <table class="table-auto border-collapse border border-slate-500">
            <tr>
                <th class="border border-slate-600">ID</th>
                <th class="border border-slate-600">Reason</th>
                <th class="border border-slate-600">Banned At</th>
                <th class="border border-slate-600">Unbanned At</th>
                <th class="border border-slate-600">Days</th>
                <th class="border border-slate-600 text-green-600">Unban</th>
            </tr>
            <tr v-for="user in bannedUsers" :key="user.userId" class="hover:bg-slate-300">
                <td @click="router.push(`/user/${user.userId}`)" class="border border-slate-700 underline cursor-pointer">{{ user.userId }}
                </td>
                <td class="border border-slate-700">{{ user.reason }}</td>
                <td class="border border-slate-700">{{ user.bannedAtUtc }}</td>
                <td class="border border-slate-700">{{ user.unbannedAtUtc }}</td>
                <td class="border border-slate-700">{{ user.days }}</td>
                <td @click="onUnbanClicked(user.userId)" class="border border-slate-700 cursor-pointer hover:bg-green-500">
                    🔓</td>
            </tr>
        </table>
    </div>
</template>
<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userBan = ref({
    userId: '',
    reason: '',
    days: 0
});
const bannedUsers = ref([]);
const isSucceded = ref(false);

const onBanSubmit = async () => {
    try {
        let result = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${userBan.value.userId}/ban`, userBan.value)
        fetchBannedUsers();
        isSucceded.value = true;
    } catch (e) {
        alert("Failed to ban user: " + e.response.data);
        isSucceded.value = false;
    }
}

const onUnbanClicked = async (userId) => {
    if (!confirm("Are you sure to unban user: " + userId)) return;
    try {
        let result = await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${userId}/ban`)
        fetchBannedUsers();
    } catch (e) {
        alert("Failed to unban user: " + e.response.data);
    }
}

const fetchBannedUsers = async () => {
    let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/bannedUsers`)
    bannedUsers.value = result.data;
}

onMounted(() => {
    fetchBannedUsers();
})

</script>
<style scoped>
input,
textarea,
button {
    padding: 0.5rem;
    border: 1px solid #000;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
}
</style>