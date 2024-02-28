<template>
    <ul class="flex gap-2 px-4 items-center">
        <li v-for="(option, index) in options" :key="index"
            class=" bg-gray-800 hover:text-gray-300 text-xs text-text-searchbar hover:cursor-pointer px-2 py-1 rounded border-0.5 border-gray-700 transition-all duration-100 ease-in-out">
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


onMounted(() => {
    if (props.optionTree.length === 0) {
        emit('queryChanged', [])
        return
    }
    if (props.initial !== undefined) {
        currentQuery = props.initial
        updateQuery()
        return
    }
    updateQuery()
})

const onDropdownChange = (index, event) => {
    currentQuery[index] = event.target.value
    updateQuery()
    emit('queryChanged', currentQuery)
}

const updateQuery = () => {
    options.value = []
    queryTemp = []
    buildQuery(props.optionTree, 0)
    currentQuery = Object.assign({}, queryTemp);
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