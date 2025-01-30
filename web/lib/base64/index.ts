export class Base64Libs {
  static toUint8Array(str: string) {
    const len = str.length;
    const padding = "=".repeat((4 - (len % 4)) % 4);
    const base64 = (str + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
