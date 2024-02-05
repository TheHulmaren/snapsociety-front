<template>
    <div class="w-full px-1">
        <div id="photoMasonryGrid" class="w-full">
        </div>
    </div>
</template>
<script setup>
import { defineProps, onMounted, watch } from 'vue';

const props = defineProps({
    columns: {
        type: Number,
        required: true
    }
});

const emits = defineEmits(['photoClicked']);

var msnry = null;
var incrementalIndex = 0;

watch(
    () => props.columns,
    async () => {
        msnry.columnWidth = document.querySelector('#photoMasonryGrid').clientWidth / props.columns;
        msnry.layout();
    }
);

const updateItems = (photos) => {
    var grid = document.querySelector('#photoMasonryGrid');
    // remove all children
    msnry.remove(grid.children);
    msnry.layout();
    // add new children
    appendItems(photos);
}

const appendItems = async (photos) => {
    var grid = document.querySelector('#photoMasonryGrid');
    for (const photo of photos) {
        let gridItem = document.createElement('img');
        let id = 'Id_' + photo.id + '_gridItem_' + incrementalIndex;
        gridItem.setAttribute('src', photo.largeUrl ?? photo.mediumUrl ?? photo.smallUrl ?? photo.thumbnailUrl ?? photo.url);
        gridItem.setAttribute('id', id);
        gridItem.setAttribute('class', 'grid-item p-1 object-cover rounded-lg cursor-pointer');
        gridItem.setAttribute('style', `width: ${100 / props.columns}%;`)
        gridItem.addEventListener('click', () => {
            emits('photoClicked', photo, id);
        });
        grid.appendChild(gridItem);
        msnry.appended(gridItem);
        incrementalIndex++;
        await new Promise(resolve => setTimeout(resolve, 100));
        msnry.layout();
    };
}

const prependItems = async (photos) => {
    var grid = document.querySelector('#photoMasonryGrid');
    for (const photo of photos) {
        let gridItem = document.createElement('img');
        let id = 'Id_' + photo.id + '_gridItem_' + incrementalIndex;
        gridItem.setAttribute('src', photo.mediumUrl);
        gridItem.setAttribute('id', id);
        gridItem.setAttribute('class', 'grid-item p-1 object-cover rounded-lg cursor-pointer');
        gridItem.setAttribute('style', `width: ${100 / props.columns}%;`)
        gridItem.addEventListener('click', () => {
            emits('photoClicked', photo, id);
        });
        grid.insertBefore(gridItem, grid.firstChild);
        msnry.prepended(gridItem);
        incrementalIndex++;
        await new Promise(resolve => setTimeout(resolve, 1000));
        msnry.layout();
    };
}

defineExpose({
    updateItems: updateItems,
    appendItems: appendItems,
    prependItems: prependItems
});


onMounted(() => {
    msnry = new Masonry('#photoMasonryGrid', {
        itemSelector: '.grid-item',
        percentPosition: true,
        columnWidth: document.querySelector('#photoMasonryGrid').clientWidth / props.columns,
        transitionDuration: '0.2s',
        stagger: 30
    });
})
</script>