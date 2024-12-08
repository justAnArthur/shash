import { ref } from 'vue'

export function useNotifications() {
  const permission = ref(Notification.permission)

  async function requestPermission() {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications.")
      return
    }

    const result = await Notification.requestPermission()
    permission.value = result

    if (result !== 'granted') {
      console.warn('Notification permission not granted.')
    }

    return result == 'granted'
  }

  function showNotification(title: string, options: NotificationOptions = {}) {
    if (permission.value === 'granted') {
      return new Notification(title, options)
    } else {
      requestPermission()
        .then(bool => {
          if (bool)
            return showNotification(title, options)
          else
            console.warn("Cannot show notification, permission not granted.")
        })
    }
  }

  return {
    permission,
    requestPermission,
    showNotification
  }
}
