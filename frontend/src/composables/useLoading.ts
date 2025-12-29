import { ref } from 'vue'

// 模块级别的状态，确保全局单例
const loading = ref(false)
const tip = ref('')

export function useLoading() {
  const show = (text = '加载中...') => {
    console.log('showLoading:', text)
    tip.value = text
    loading.value = true
  }

  const hide = () => {
    console.log('hideLoading')
    loading.value = false
    tip.value = ''
  }

  // 直接返回 ref 对象，保持响应性
  return {
    loading,
    tip,
    show,
    hide
  }
}
