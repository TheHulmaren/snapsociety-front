<template>
    <MarqueeText class="bg-gray-800 text-gray-400 border-y-0.5 border-y-gray-700 text-[11px] py-2" :duration="70">
        <span class="rounded-full bg-blue-600 text-white text-[8px] font-semibold px-2 py-0.5 mx-2">알림</span>
        📸스냅 소사이어티의 베타테스트에 참여해주셔서 정말 감사합니다😊. 현 베타테스트는 이번주 금요일 자정까지 진행될 예정이며, 정식 오픈🎊 이후에도 여러분께서 작성하신 글이나 사진들은 모두 보관되어 계속해서 이용하실 수 있습니다. 즐거운 하루 되세요!!🎉
    </MarqueeText>
</template>
<script setup>
import MarqueeText from 'vue-marquee-text-component'
const html = '🛠️ 이번 주 ⏱️<u>목요일 자정부터 금요일 오전 6시</u> 까지는 점검 및 업데이트가 있을 예정입니다. 따라서 해당 시간에는 사이트 이용이 불가하며, 이점 양해 부탁드릴게요😅. 이후 더 나은 서비스로 찾아뵙겠습니다. 감사합니다.😊//'
</script>