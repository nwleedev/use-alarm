/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3320881504")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = user.id",
    "listRule": "@request.auth.id = user.id",
    "updateRule": "@request.auth.id = user.id",
    "viewRule": "@request.auth.id = user.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3320881504")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = @collection.subscriptions.user.id",
    "listRule": "@request.auth.id = @collection.subscriptions.user.id",
    "updateRule": "@request.auth.id = @collection.subscriptions.user.id",
    "viewRule": "@request.auth.id = @collection.subscriptions.user.id"
  }, collection)

  return app.save(collection)
})
