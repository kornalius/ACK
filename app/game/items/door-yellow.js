const { DoorItem } = require('../../classes/core/items/door-item')
const { YELLOW_DOOR, YELLOW_KEY } = require('../../constants')

class YellowDoor extends DoorItem {

  get color () { return 'yellow' }

  get type () { return YELLOW_DOOR }

  get useWithType () { return YELLOW_KEY }

}

module.exports = {
  YellowDoor,
}
