/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3320881504")

  // update collection data
  unmarshal({
    "name": "subscriptions"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3320881504")

  // update collection data
  unmarshal({
    "name": "months"
  }, collection)

  return app.save(collection)
})
