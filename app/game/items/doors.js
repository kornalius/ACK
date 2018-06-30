const { DoorItem } = require('../../classes/item/door-item')


const { WOOD_DOOR } = require('../../constants')

class WoodDoor extends DoorItem {

  get material () { return 'wood' }

  get type () { return WOOD_DOOR }

}


const { GLASS_DOOR } = require('../../constants')

class GlassDoor extends DoorItem {

  get material () { return 'glass' }

  get type () { return GLASS_DOOR }

}

module.exports = {
  WoodDoor,
  GlassDoor,
}
