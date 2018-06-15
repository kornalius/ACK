const { DoorItem } = require('../../classes/core/items/door-item')
const { BLUE_DOOR, BLUE_KEY } = require('../../constants')

class BlueDoor extends DoorItem {

  get color () { return 'blue' }

  get type () { return BLUE_DOOR }

  get useWithType () { return BLUE_KEY }

}

module.exports = {
  BlueDoor,
}
