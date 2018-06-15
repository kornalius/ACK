const { DoorItem } = require('../../classes/core/items/door-item')
const { RED_DOOR, RED_KEY } = require('../../constants')

class RedDoor extends DoorItem {

  get color () { return 'red' }

  get type () { return RED_DOOR }

  get useWithType () { return RED_KEY }

}

module.exports = {
  RedDoor,
}
