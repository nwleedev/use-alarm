/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_432047489")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number1881018702",
    "max": null,
    "min": null,
    "name": "hour",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_432047489")

  // remove field
  collection.fields.removeById("number1881018702")

  return app.save(collection)
})
