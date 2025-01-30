export class NotificationLibs {
  static async getSubscription() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.getSubscription();

    return sub;
  }

  static getPermission() {
    try {
      return Notification.permission;
    } catch {
      return "default";
    }
  }
}
