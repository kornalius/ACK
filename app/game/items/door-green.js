const { DoorItem } = require('../../classes/core/items/door-item')
const { GREEN_DOOR, GREEN_KEY } = require('../../constants')

class GreenDoor extends DoorItem {

  get color () { return 'green' }

  get type () { return GREEN_DOOR }

  get useWithType () { return GREEN_KEY }

}

module.exports = {
  GreenDoor,
}
