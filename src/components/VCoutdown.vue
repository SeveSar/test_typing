<template>
    <div class="coutdown">
        <div class="countdown__time">
            {{ formattedTime }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
    time?: number
}

const props = withDefaults(defineProps<Props>(), {
    time: 60
})
const emit = defineEmits(['end-time'])

let timerId: number
const currentTime = ref(props.time)
const isStarted = ref(false)

const formattedTime = computed(() => {
    const minutes = Math.floor(currentTime.value / 60)
    const seconds = currentTime.value % 60
    return `${padZero(minutes)}:${padZero(seconds)}`
})
const startTimer = () => {
    isStarted.value = true
    timerId = setTimeout(function tick() {
        if (currentTime.value > 0) {
            timerId = setTimeout(tick, 1000)
        }
        if (currentTime.value > 0) {
            currentTime.value--
        }
    }, 1000)
}

watch(currentTime, (val) => {
    if (val === 0) {
        clearTimeout(timerId)
        isStarted.value = false
        currentTime.value = props.time
        emit('end-time')
    }
})

const padZero = (value: number | string) => {
    return value.toString().padStart(2, '0')
}

defineExpose({
    startTimer,
    isStarted
})
</script>

<style scoped>
.coutdown {
    font-size: 30px;
    line-height: 1.2;
    border-radius: 5px;
    color: white;
    background: #3c4d5c;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
}
</style>
