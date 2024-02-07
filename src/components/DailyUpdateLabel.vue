<template>
    <MarqueeText class="bg-main text-white text-xs font-semibold py-2" :duration="70">
        <div v-html="html"></div>
    </MarqueeText>
</template>
<script setup>
import MarqueeText from 'vue-marquee-text-component'
const html = '🛠️ 이번 주 ⏱️<u>목요일 자정부터 금요일 오전 6시</u> 까지는 점검 및 업데이트가 있을 예정입니다. 따라서 해당 시간에는 사이트 이용이 불가하며, 이점 양해 부탁드릴게요😅. 이후 더 나은 서비스로 찾아뵙겠습니다. 감사합니다.😊//'
</script>