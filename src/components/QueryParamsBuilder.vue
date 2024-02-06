<template>
    <ul class="flex gap-2 px-4">
        <li v-for="(option, index) in options" :key="index"
            class=" hover:bg-text-searchbar hover:text-white text-sm font-semibold text-text-searchbar hover:cursor-pointer px-2 py-1 rounded-full border-0.5 border-stroke-mid">
            <select @change="onDropdownChange(index, $event)"
                class="bg-transparent hover:cursor-pointer focus:outline-none">
                <option :selected="currentQuery[index] === item" v-for="item in option" :key="item">{{ item }}</option>
            </select>
        </li>
    </ul>
</template>
<script setup>
import { defineProps, defineEmits, onMounted, ref, watch } from 'vue'

const options = ref([])

let currentQuery = []
let queryTemp = []

const props = defineProps(['optionTree', 'initial'])
const emit = defineEmits(['queryChanged'])

watch(
    () => props.optionTree,
    async () => {
        currentQuery = []
        if (props.optionTree.length === 0) {
            options.value = []
            emit('queryChanged', [])
            return
        }
        updateAndEmits()
    }
);

onMounted(() => {
    if (props.optionTree.length === 0) {
        emit('queryChanged', [])
        return
    }
    if (props.initial !== undefined) {
        currentQuery = props.initial
        options.value = []
        queryTemp = []
        buildQuery(props.optionTree, 0)
        currentQuery = Object.assign({}, queryTemp);
        return
    }
    updateAndEmits()
})

const onDropdownChange = (index, event) => {
    currentQuery[index] = event.target.value
    updateAndEmits()
}

const updateAndEmits = () => {
    options.value = []
    queryTemp = []
    buildQuery(props.optionTree, 0)
    currentQuery = Object.assign({}, queryTemp);
    emit('queryChanged', currentQuery)
}

const buildQuery = (optionTree, index) => {
    let nextOptions = optionTree.filter((query) => {
        return query.name === currentQuery[index]
    })

    nextOptions = nextOptions.length === 0 ? optionTree[0] : nextOptions[0]

    queryTemp.push(nextOptions.name)
    let temp = []
    optionTree.forEach((query) => {
        temp.push(query.name)
    })
    options.value.push(temp)
    if (nextOptions.options === undefined) {
        return
    }
    buildQuery(nextOptions.options, index + 1)
}
</script>