<template>
    <div class="index-page">
        <h1 class="index-page__title">Test your typing skills</h1>
        <div class="index-page__test">
            <VTexts
                v-if="textsArray.length"
                class="index-page__texts"
                :texts="textsArray"
                :activeWord="activeWord"
                :errorWords="errorWords"
                :successWords="successWords"
                :isError="isError"
                ref="textsRef"
            />
            <VForm
                class="index-page__form"
                v-model="typingValue"
                @onKeyUp="addWord"
                @end-time="openModal"
            />
        </div>
        <a-modal
            class="modal-result"
            v-model:visible="visible"
            title="Results"
            @ok="resetTest"
            @cancel="resetTest"
        >
            <div class="modal-result__value">MVP: {{ successWords.length }}</div>
            <div class="modal-result__words modal-result__words--error">
                Error words: <span>{{ errorWords.length }}</span>
            </div>
            <div class="modal-result__words modal-result__words--success">
                Correct characters: <span>{{ successWords.join('').length }}</span>
            </div>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import VTexts from '@/components/VTexts.vue'
import { api } from '@/api/api'
import { ref, watch } from 'vue'
import VForm from '@/components/VForm.vue'
const textsArray = ref<string[]>([])
const textsRef = ref<InstanceType<typeof VTexts> | null>(null)

const visible = ref(false)
const activeWord = ref(0)
const typingValue = ref('')
const successWords = ref<string[]>([])
const errorWords = ref<string[]>([])
const isError = ref(false)

const getWords = async () => {
    const textJson = (await api.getWords()) as { text: string }[]
    const sliced = textJson.slice(0, 400)

    sliced.forEach((item) => {
        textsArray.value?.push(...item.text.replace(/[^a-zA-Z ]/g, '').split(' '))
    })
    textsArray.value = textsArray.value.filter(
        (value, index, array) => array.indexOf(value) === index
    )
}

const addWord = () => {
    if (typingValue.value.trim() === textsArray.value[activeWord.value].trim()) {
        successWords.value.push(textsArray.value[activeWord.value].trim())
    } else {
        errorWords.value.push(textsArray.value[activeWord.value].trim())
    }
    activeWord.value++
    typingValue.value = ''
}

const openModal = () => {
    visible.value = true
}
const resetTest = () => {
    activeWord.value = 0
    isError.value = false
    successWords.value = []
    errorWords.value = []
    typingValue.value = ''
    visible.value = false
    if (textsRef.value) {
        textsRef.value.resetScroll()
    }
}

getWords()
</script>

<style scoped>
.index-page {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
.index-page__test {
    width: 100%;
}
.index-page__texts {
    margin: 0 auto;
}
.index-page__form {
    margin: 35px auto 0;
}

.index-page__title {
    text-align: center;
    font-size: 45px;
    line-height: 1.2;
}

.modal-result :deep(.ant-modal-title) {
    font-size: 45px;
}

.modal-result__value {
    font-size: 30px;
    line-height: 1.2;
    color: green;
}

.modal-result__words {
    font-size: 20px;
    line-height: 1.2;
}
.modal-result__words.modal-result__words--error span {
    color: red;
}
.modal-result__words.modal-result__words--success span {
    color: green;
}
</style>
