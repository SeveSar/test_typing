<template>
    <div class="texts" ref="textBlockRef">
        <div class="texts__wrap" ref="textsWrapRef">
            <span
                class="texts__item"
                v-for="(word, idx) in texts"
                ref="itemRefs"
                :key="idx"
                :class="{
                    active: idx === activeWord,
                    success: successWords.includes(word.trim()),
                    error: errorWords.includes(word.trim())
                }"
            >
                {{ word }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
    texts: string[]
    activeWord?: number
    successWords: string[]
    isError: boolean
    errorWords: string[]
}
const props = withDefaults(defineProps<Props>(), {
    activeWord: 0
})

const textBlockRef = ref<HTMLElement | null>(null)
const textsWrapRef = ref<HTMLElement | null>(null)
const itemRefs = ref<HTMLElement[] | null>(null)

const resetScroll = () => {
    if (textsWrapRef.value) {
        textsWrapRef.value.style.top = 0 + 'px'
    }
}

watch(
    () => props.activeWord,
    () => {
        if (textsWrapRef.value && itemRefs.value) {
            itemRefs.value.forEach((item, idx, array) => {
                if (item.classList.contains('active') && array[idx + 1] !== undefined) {
                    const isNextLine = array[idx + 1].offsetTop > array[idx].offsetTop
                    if (textsWrapRef.value && isNextLine) {
                        textsWrapRef.value.style.top = -array[idx + 1].offsetTop - 3 + 'px'
                    }
                }
            })
        }
    }
)

defineExpose({
    resetScroll
})
</script>

<style scoped>
.texts {
    user-select: none;
    box-shadow: 0 9px 24px rgba(0, 0, 0, 0.12), 0 9px 24px rgba(0, 0, 0, 0.12);
    background-color: #fff;
    padding: 20px 12px 30px 12px;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    height: 130px;
    overflow: hidden;
}
.texts__wrap {
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 17px;
}
.texts__item {
    /* width: calc((100% / 6) - 30px); */
    font-size: 30px;
    line-height: 1;
    border-radius: 4px;
    padding: 3px 5px 3px 5px;
}
.texts__item.active {
    background-color: #dddddd;
}

.texts__item.success {
    background-color: greenyellow;
}
.texts__item.error {
    background-color: red;
}
</style>
