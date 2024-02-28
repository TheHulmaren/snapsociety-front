<template>
    <div class="p-4">
        <PhotoMasonryList ref="photoMasonryListRef" :columns="2"
            @photo-clicked="(photo) => router.push(`/photos/${photo.id}`)" />
    </div>
</template>
<script setup>
import axios from 'axios'
import PhotoMasonryList from '@/components/PhotoMasonryList.vue';
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const photos = ref([]);
const photoMasonryListRef = ref();

watch(
    () => route.query.query,
    async () => {
        let translated = await translateQuery()
        let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/searchPhotos?query=${translated}&breakpoints=medium&includePreUploads=false`)
        photoMasonryListRef.value.updateItems(result.data);
    }
)

const translateQuery = async () => {
    let header = {
        "Ocp-Apim-Subscription-Key": import.meta.env.VITE_AZURE_TRANSLATION_KEY,
        "Ocp-Apim-Subscription-Region": "koreacentral",
    }
    let translated = await axios.post(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=en`, [{
        "text": route.query.query
    }], {
        headers: header
    })
    return translated.data[0].translations[0].text
}

onMounted(async () => {
    let translated = await translateQuery()

    let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/searchPhotos?query=${translated}&breakpoints=medium&includePreUploads=false`)

    photoMasonryListRef.value.appendItems(result.data);
})

</script>