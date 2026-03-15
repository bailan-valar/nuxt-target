/**
 * Toast通知composable
 * 提供简单的toast通知功能
 */
export const useToast = () => {
  const toasts = ref<
    Array<{
      id: string
      message: string
      type: 'success' | 'error' | 'warning' | 'info'
      duration: number
    }>
  >([])

  let idCounter = 0

  const show = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration: number = 3000
  ) => {
    const id = `toast-${idCounter++}`
    toasts.value.push({ id, message, type, duration })

    // 自动移除
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  const remove = (id: string) => {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, duration?: number) => {
    return show(message, 'success', duration)
  }

  const error = (message: string, duration?: number) => {
    return show(message, 'error', duration)
  }

  const warning = (message: string, duration?: number) => {
    return show(message, 'warning', duration)
  }

  const info = (message: string, duration?: number) => {
    return show(message, 'info', duration)
  }

  const clear = () => {
    toasts.value = []
  }

  return {
    toasts: readonly(toasts),
    show,
    remove,
    success,
    error,
    warning,
    info,
    clear
  }
}
