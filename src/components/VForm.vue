<template>
    <form class="form" @submit.prevent="onAddingWord">
        <input
            type="text"
            v-model="inputModel"
            @keyup.space="onAddingWord"
            placeholder="Start typing..."
            class="form__input"
            :disabled="disabledInput"
        />
        <VCoutdown class="form__coutdown" ref="coutdownRef" @end-time="endTime" />
    </form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import VCoutdown from './VCoutdown.vue'
interface Props {
    modelValue: string
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'onKeyUp', 'end-time'])
const coutdownRef = ref<InstanceType<typeof VCoutdown> | null>(null)
const disabledInput = ref(false)
const inputModel = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})
watch(
    () => props.modelValue,
    (val) => {
        if (val.length && coutdownRef.value && !coutdownRef.value.isStarted) {
            coutdownRef.value.startTimer()
            disabledInput.value = false
        }
    }
)

const endTime = () => {
    disabledInput.value = true
    setTimeout(() => {
        disabledInput.value = false
    }, 10)
    emit('end-time')
}

const onAddingWord = () => {
    if (props.modelValue.length) {
        emit('onKeyUp')
    }
}
</script>

<style scoped>
.form {
    width: 100%;
    display: flex;
    /* align-items: center; */
    max-width: 550px;
}
.form__input {
    width: 100%;
    padding: 10px 20px;
    font-size: 30px;
    border-radius: 5px;
    line-height: 1.1;
}
.form__input:focus {
    outline: none;
}
.form__coutdown {
    margin-left: 15px;
}

.form__retry {
    color: #fff;
    background-color: #428bca;
    border-color: #357ebd;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 15px;
    font-size: 17px;
}
</style>
