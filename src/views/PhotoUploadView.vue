<template>
    <div class="flex flex-col gap-6 p-4">
        <ul v-if="imageFiles.length > 0" class="flex flex-col gap-4">
            <li class="flex gap-2" v-for="file in imageFiles" :key="file.data.name">
                <img :src="file.path"
                    class="w-1/4 aspect-square rounded-xl object-contain bg-button-back-light border-0.5 border-stroke-light">
                <form class="flex flex-col grow gap-2">
                    <DefaultTextField v-model="file.info.title" type="input" :placeholder="'사진 제목'" />
                    <DefaultTextField v-model="file.info.desc" type="textarea" :placeholder="'사진을 설명해주세요!'" class="grow" />
                    <DefaultButton @click="deleteImage(file)" type="cancel" class="self-end" content="🗑️ 삭제">
                    </DefaultButton>
                </form>
            </li>
        </ul>
        <div v-else @click="() => imageInput.click()"
            class="flex flex-col gap-2 items-center py-6 border-main border-0.5 rounded-xl cursor-pointer">
            <span class="font-semibold text-sm text-main">📂 사진을 선택해주세요</span>
            <span class="text-xs ml-1">한번에 최대 10장까지 업로드할 수 있어요!</span>
        </div>
        <form @submit.prevent="" class="flex flex-col">
            <input @change="onImageSubmit" id="imageInput" type="file" name="file" multiple style="display:none;"
                accept="image/jpg, image/jpeg, image/png, image/webp, image/tiff" />
            <DefaultButton v-if="imageFiles.length > 0" @click="() => imageInput.click()" type="primary" content="📂 사진 추가하기" class="self-center"></DefaultButton>
        </form> 
        <DefaultButton @click="onUploadClick" type="submit" content="🛜 업로드하기" class="self-end"></DefaultButton>
    </div>
</template>
<script setup>
import DefaultButton from '@/components/DefaultButton.vue';
import DefaultTextField from '@/components/DefaultTextField.vue';
import axios from 'axios';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const imageFiles = ref([])

var imageInput = null

onMounted(() => {
    imageInput = document.getElementById("imageInput")
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
                title: "",
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
    if (imageFiles.value.length === 0) {
        alert("📁🛜 업로드할 사진이 ㅇ벗습니다..")
        return
    }
    if (imageFiles.value.some((file) => file.info.title === "") || imageFiles.value.some((file) => file.info.desc === "")) {
        alert("📁🛜 흠.. 제목이나 설명을 빠뜨리신 사진이 있는 것 같아요")
        return
    }
    var uploadedId = []
    try {
        await Promise.all(imageFiles.value.map(async (file) => {
            let formData = new FormData();
            formData.append("photo", file.data)
            let uploaded = await axios.post("/api/photos/preUpload", formData)
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
            await axios.put(`/api/photos/${uploaded.data.id}`, request)
        }))
        alert("📁🛜 Successfully uploaded images")
        router.push("/")
    }
    catch {
        await Promise.all(uploadedId.map(async (id) => {
            await axios.delete(`/api/photos/${id}`)
        }))
        alert("📁🛜 Failed to upload images")
        return
    }
}
</script>