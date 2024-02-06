<template>
    <div class="flex flex-col gap-4 py-4">
        <!-- <DailyUpdateLabel /> -->
        <div class="flex flex-col gap-2 px-4">
            <ul class="flex gap-2 flex-wrap">
                <DefaultButton class="grow" v-for="tab in tabs" :key="tab.slug" :content="tab.name" :is-selected="selectedTabSlug === tab.slug" @click="onTabClick(tab)" />
            </ul>
        </div>
        <RouterView :key="route.fullPath" />
    </div>
</template>
<script setup>
import { RouterView } from 'vue-router';
import { defineProps, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DailyUpdateLabel from '@/components/DailyUpdateLabel.vue';
import DefaultButton from '@/components/DefaultButton.vue';

const router = useRouter();
const route = useRoute();

const props = defineProps(['category'])

const selectedTabSlug = ref("")

watch(
    () => props.category,
    async () => {
        selectedTabSlug.value = props.category
    }
);

onMounted(() => {
    selectedTabSlug.value = props.category
})

const onTabClick = (tab) => {
    selectedTabSlug.value = tab.slug
    router.push(`/main/${tab.slug}`)
}

const tabs = [
    {
        name: "🚀 사진 모아보기",
        slug: "photos"
    },
    {
        name: "🌄 사진과 글",
        slug: "posts",
    },
    {
        name: "💁‍♂️ 글 모아보기",
        slug: "board"
    },
    {
        name: "💡 정보글 & 팁",
        slug: "tips"
    },
    {
        name: "🙋 질문 & 답변",
        slug: "ask"
    },
    {
        name: "🏆 컨테스트",
        slug: "contest"
    },
    {
        name: "🤣 유우머",
        slug: "humor"
    },
    {
        name: "😄 잡담",
        slug: "casual"
    },
    {
        name: "🙋‍♂️ 토론 & 투표",
        slug: "agora"
    },
    {
        name: "📷💰 박스추 & 장비 자랑",
        slug: "gear"
    },
    {
        name: "➡️👨‍💻 개발자에게",
        slug: "to-dev"
    },
    {
        name: "⬅️👨‍💻 개발자로부터",
        slug: "from-dev"
    },
]

</script>
<style scoped></style>
