<template>
    <div class="gap-6">
        <ul class="flex flex-col divide-y-0.5 divide-gray-800">
            <PostVCard @click="router.push(`/posts/${post.id}`)" v-for="post in props.posts" :key="post.id" :post="post" class="cursor-auto"/>
        </ul>
    </div>
</template>
<script setup>
import { defineProps } from 'vue';
import { TimeHelper } from '@/helpers/TimeHelper';
import { useRouter } from 'vue-router'
import PostVCard from './PostVCard.vue';

const router = useRouter();

const props = defineProps(['posts']);
</script>