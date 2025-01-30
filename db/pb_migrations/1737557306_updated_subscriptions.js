/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3320881504")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = @collection.subscriptions.user.id",
    "listRule": "@request.auth.id = @collection.subscriptions.user.id",
    "updateRule": "@request.auth.id = @collection.subscriptions.user.id",
    "viewRule": "@request.auth.id = @collection.subscriptions.user.id"
  }, collection)

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number1956595421",
    "max": 31,
    "min": 1,
    "name": "alarm",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number2862495610",
    "max": 31,
    "min": 1,
    "name": "payment",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3320881504")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = @collection.months.user.id",
    "listRule": "@request.auth.id = @collection.months.user.id",
    "updateRule": "@request.auth.id = @collection.months.user.id",
    "viewRule": "@request.auth.id = @collection.months.user.id"
  }, collection)

  // remove field
  collection.fields.removeById("number1956595421")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number2862495610",
    "max": 31,
    "min": 1,
    "name": "date",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
