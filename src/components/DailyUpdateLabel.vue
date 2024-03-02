<template>
    <MarqueeText class="bg-gray-800 text-gray-400 border-y-0.5 border-y-gray-700 text-[11px] py-2" :duration="70">
        <span class="rounded-full bg-blue-600 text-white text-[8px] font-semibold px-2 py-0.5 mx-2">알림</span>
        스냅 소사이어티에 오신 것을 환영합니다, 작가님 여러분!🎨 손수 찍은 사진을 손쉽게 업로드하고, 다른 작가님들과 공유해 보세요. 혹은 특별히 찾으시는 사진이 있으신가요? 최상단의 검색창으로 검색해 보세요!
    </MarqueeText>
</template>
<script setup>
import MarqueeText from 'vue-marquee-text-component'
const html = '🛠️ 이번 주 ⏱️<u>목요일 자정부터 금요일 오전 6시</u> 까지는 점검 및 업데이트가 있을 예정입니다. 따라서 해당 시간에는 사이트 이용이 불가하며, 이점 양해 부탁드릴게요😅. 이후 더 나은 서비스로 찾아뵙겠습니다. 감사합니다.😊//'
</script>