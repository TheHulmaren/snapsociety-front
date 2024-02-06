<template>
    <div class="gap-6">
        <ul id="photoList_ul" class="flex flex-col divide-y-0.5 divide-slate-300">
            <PhotoVCard v-for="photo in props.photos" :key="photo.id" :show-profile="true" :photo="photo" class=" cursor-auto"/>
        </ul>
    </div>
</template>
<script setup>
import { TimeHelper } from '@/helpers/TimeHelper';
import PhotoVCard from './PhotoVCard.vue';
import { useRouter } from 'vue-router'

const router = useRouter();

const props = defineProps(['photos'])
</script>