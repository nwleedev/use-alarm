import Client from "pocketbase";

export class PocketBaseAuthLibs {
  static async refresh(client: Client, auth: string) {
    client.authStore.loadFromCookie(auth);
    if (client.authStore.isValid) {
      await client.collection("users").authRefresh();
      return true;
    }

    return false;
  }
}
