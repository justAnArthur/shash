import { ref } from "vue";
import { useAuth } from "./useAuth";
import { useQuasar } from "quasar";
export function useNotifications() {
  const { user } = useAuth();
  const $q = useQuasar();
  const permission = ref(Notification.permission);

  async function requestPermission() {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications.");
      return;
    }

    const result = await Notification.requestPermission();
    permission.value = result;

    if (result !== "granted") {
      console.warn("Notification permission not granted.");
    }

    return result == "granted";
  }

  function showNotification(
    title: string,
    options: NotificationOptions = {},
    isDirect: boolean,
  ) {
    console.log(user.value?.notifyWhenTagged);
    if (
      !$q.appVisible &&
      user.value?.notificationStatus === "ONLINE" &&
      (isDirect || user.value.notifyWhenTagged === "ALL")
    ) {
      if (permission.value === "granted") {
        const notification = new Notification(title, options);
        return notification;
      } else {
        requestPermission().then((bool) => {
          if (bool) return showNotification(title, options, isDirect);
          else
            console.warn("Cannot show notification, permission not granted.");
        });
      }
    }
  }

  return {
    permission,
    requestPermission,
    showNotification,
  };
}
