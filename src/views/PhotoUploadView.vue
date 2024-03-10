<template>
    <div class="flex flex-col gap-6 p-4">
        <p class="bg-gray-800 border-gray-700 border-0.5 rounded text-xs px-4 py-2 leading-6">
            지원되는 이미지 포맷: <b>JPG, JPEG, PNG, WEBP, TIFF</b>
            <br>
            이미지 최대 크기: <b>30MB</b>
            <br>
            최대 동시 업로드 가능 이미지 수: <b>{{ imageFiles.length }}/10 pics</b>
            <br>
            업로드 가능 이미지 수: <b><span :class="(!AuthHelper.getUser().roles.includes('User') || remainingQuota) > 0 ? 'text-green-500' : 'text-red-500'">{{ 10 - remainingQuota }}</span>/10 pics</b>
            <br>
            <span v-if="!AuthHelper.getUser().roles.includes('User')" class="text-blue-400">관리자는 업로드 제한이 없습니다.</span>
            <span v-else-if="remainingQuota <= 0" class="text-red-500">이미지 업로드 한도에 이르셨습니다! 업로드는 일주일에 최대 10장까지만 가능합니다.</span>
            <span v-else class="text-green-500">업로드는 일주일에 최대 10장까지 가능합니다.</span>
        </p>
        <ul v-if="imageFiles.length > 0" class="flex flex-col gap-4">
            <li class="flex gap-2" v-for="file in imageFiles" :key="file.data.name">
                <img :src="file.path"
                    class="w-1/4 aspect-square rounded object-contain bg-gray-800 border-0.5 border-gray-700">
                <form class="flex flex-col grow gap-2">
                    <DefaultTextField v-model="file.info.title" type="input" :placeholder="'사진 제목'" />
                    <DefaultTextField v-model="file.info.desc" type="textarea" :placeholder="'(선택) 사진을 설명해주세요!'"
                        class="grow" />
                    <DefaultButton @click="deleteImage(file)" type="cancel" class="self-end" content="🗑️ 삭제">
                    </DefaultButton>
                </form>
            </li>
        </ul>
        <form @submit.prevent="" class="flex flex-col">
            <input @change="onImageSubmit" id="imageInput" type="file" name="file" multiple style="display:none;"
                accept="image/jpg, image/jpeg, image/png, image/webp, image/tiff" />
            <DefaultButton @click="() => imageInput.click()" type="primary" content="📂 사진 추가하기" class="self-center">
            </DefaultButton>
        </form>
        <DefaultButton @click="onUploadClick" type="submit" content="🛜 업로드하기" class="self-end"></DefaultButton>
    </div>
    <div v-if="showUploadIndicator"
        class="fixed top-0 left-0 w-screen h-screen bg-gray-950 bg-opacity-50 z-50 flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
        <div class="flex flex-col gap-4 h-fit w-fit bg-gray-800 rounded p-4 border-0.5 border-gray-700 shadow-lg">
            <div class="flex gap-4 items-center">
                <div class="w-80 h-4 bg-gray-900">
                    <div class="animate-pulse h-full bg-main rounded transition-all duration-200"
                        :style="`width: ${uploadedCount / imageFiles.length * 100}%;`"></div>
                </div>
                <span>{{ uploadedCount }} / {{ imageFiles.length }}</span>
            </div>
            <span class=" animate-pulse">🌏🚀 사진을 업로드 중입니다..</span>
            <span>잠시만 기다려 주세요(오래 걸릴 수 있습니다)</span>
            <span class="text-xs">페이지를 새로고침하거나 나가시면 업로드가 정상적으로 진행되지 않습니다.</span>
        </div>
    </div>
</template>
<script setup>
import DefaultButton from '@/components/DefaultButton.vue';
import DefaultTextField from '@/components/DefaultTextField.vue';
import axios from 'axios';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ModalWrapperView from './ModalWrapperView.vue';
import { AuthHelper } from '@/helpers/AuthHelper';

const router = useRouter()

const imageFiles = ref([])
const uploadedCount = ref(0)
const showUploadIndicator = ref(false)
const remainingQuota = ref(0)

var imageInput = null

onMounted(async() => {
    imageInput = document.getElementById("imageInput")

    // get remaining upload quota
    let result = await axios.get(`${import.meta.env.VITE_API_URL}/api/photos/remainingWeeklyQuota/${AuthHelper.getUser().id}`)
    remainingQuota.value = result.data.remaining
})

const onImageSubmit = async () => {
    if (imageFiles.value.some((file) => Array.from(imageInput.files).some((inputFile) => inputFile.name === file.data.name))) {
        alert("📁 같은 사진은 중복해서 선택할 수 없어요!")
        return
    }

    if (imageFiles.value.length + Array.from(imageInput.files).length > 10) {
        alert("📁 한번에 최대 10장까지만 업로드할 수 있어요!\n 현재: " + imageFiles.value.length + '장')
        return
    }

    let filesData = Array.from(imageInput.files).map((file) => {
        return {
            data: file,
            info: {
                title: file.name,
                desc: "",
            },
            path: URL.createObjectURL(file)
        }
    })
    imageFiles.value.push(...filesData)
}

const deleteImage = async (file) => {
    imageFiles.value = imageFiles.value.filter((item) => item.data.name !== file.data.name)
}

const onUploadClick = async () => {
    if(AuthHelper.getUser().roles.includes('User') && remainingQuota.value - imageFiles.value.length <= 0){
        alert("📁🛜 이미지 업로드 한도에 이르셨습니다! 업로드는 일주일에 최대 10장까지만 가능합니다.")
        return
    }

    if (imageFiles.value.length === 0) {
        alert("📁🛜 업로드할 사진이 ㅇ벗습니다..")
        return
    }
    if (imageFiles.value.some((file) => file.info.title === "")) {
        alert("📁🛜 흠.. 제목을 빠뜨리신 사진이 있는 것 같아요")
        return
    }

    showUploadIndicator.value = true
    var uploadedId = []
    uploadedCount.value = 0
    try {
        await Promise.all(imageFiles.value.map(async (file) => {
            let formData = new FormData();
            formData.append("photo", file.data)
            let uploaded = await axios.post(import.meta.env.VITE_API_URL + "/api/photos/preUpload", formData)
            uploadedId.push(uploaded.data.id)

            let request = {
                "id": uploaded.data.id,
                "lensId": uploaded.data.lensId,
                "title": file.info.title,
                "desc": file.info.desc,
                "s3ThumbnailKey": uploaded.data.s3ThumbnailKey,
                "s3SmallKey": uploaded.data.s3SmallKey,
                "s3MediumKey": uploaded.data.s3MediumKey,
                "s3LargeKey": uploaded.data.s3LargeKey,
                "isPreUploaded": false
            }

            await axios.put(`${import.meta.env.VITE_API_URL}/api/photos/${uploaded.data.id}`, request)
            uploadedCount.value++
        }))

        await new Promise(r => setTimeout(r, 1500));
    }
    catch {
        showUploadIndicator.value = false
        await Promise.all(uploadedId.map(async (id) => {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/photos/${id}`)
        }))
        alert("📂❌ 사진 업로드에 실패했습니다ㅠㅠ\n이미지 포맷 및 사이즈를 다시 확인해주세요!")
        return
    }
    alert("📁🛜 사진 업로드 완료!\n프로필로 이동합니다..")
    router.push("/user/" + AuthHelper.getUser().id + "/photos?query=🕗%20업로드_👇%20최신%20순")
}
</script>