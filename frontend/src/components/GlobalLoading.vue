<template>
  <Transition name="loading-fade">
    <div v-if="loading" class="global-loading" :class="{ fullscreen }">
      <div v-if="fullscreen" class="loading-mask"></div>
      <div class="loading-spinner">
        <div class="spinner-dot"></div>
        <div class="spinner-dot"></div>
        <div class="spinner-dot"></div>
      </div>
      <div v-if="tip" class="loading-tip">{{ tip }}</div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  loading: boolean
  tip?: string
  fullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tip: '',
  fullscreen: true
})

// 调试日志
watch(() => props.loading, (val) => {
  console.log('GlobalLoading loading changed:', val)
})
</script>

<style scoped>
.global-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.global-loading.fullscreen {
  position: fixed;
  z-index: 9999;
}

.loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(2px);
}

:deep(.dark) .loading-mask {
  background: rgba(0, 0, 0, 0.6);
}

.loading-spinner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  z-index: 1;
}

.spinner-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--el-color-primary, #1890ff);
  animation: spinner-bounce 1.4s infinite ease-in-out both;
}

.spinner-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.spinner-dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes spinner-bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.6;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-tip {
  margin-top: 16px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  z-index: 1;
}

:deep(.dark) .loading-tip {
  color: rgba(255, 255, 255, 0.65);
}

/* 淡入淡出动画 */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.2s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}

/* 大尺寸 spinner */
.global-loading.fullscreen .spinner-dot {
  width: 20px;
  height: 20px;
  gap: 12px;
}

.global-loading.fullscreen .loading-tip {
  font-size: 16px;
  margin-top: 20px;
}
</style>
