<template>
    <div class="flex flex-col py-2 px-4 gap-2 bg-gray-950 border-gray-700 border-0.5 text-xs rounded">
        <ul class="flex gap-2 text-nowrap flex-wrap justify-between">
            <li>{{ props.exif.exifCameraModelRawString ?? 'N/A Camera' }}</li>
            <li>{{ props.exif.exifLensModelRawString ?? 'N/A Lens' }}</li>
        </ul>
        <ul class="flex gap-2 text-nowrap flex-wrap justify-between">
            <li>{{ props.exif.exifFocalLength ?? 'N/A' }}mm</li>
            <li>f/{{ props.exif.exifAperture ?? 'N/A' }}</li>
            <li v-if="props.exif.exifShutterSpeedDenominator == undefined">N/A sec</li>
            <li v-else-if="props.exif.exifShutterSpeedDenominator === 1">{{ props.exif.exifShutterSpeedNumerator }} sec</li>
            <li v-else>{{ props.exif.exifShutterSpeedNumerator }}/{{ props.exif.exifShutterSpeedDenominator }} sec</li>
            <li>ISO {{ props.exif.exifIso }}</li>
        </ul>
    </div>
</template>
<script setup>
import { defineProps } from 'vue';

const props = defineProps(['exif'])
</script>