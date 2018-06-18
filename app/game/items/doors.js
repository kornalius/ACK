const { DoorItem } = require('../../classes/core/items/door-item')


const { ITEM_DOOR } = require('../../constants')

class Door extends DoorItem {

  get name () { return (this.opened ? 'Opened' : 'Closed') + ' Door' }

  get type () { return ITEM_DOOR }

  get spriteFrame () { return 'door-' + (this.opened ? 'opened' : 'closed') + '.png' }

  get blocked () { return false }

}


const { BLUE_DOOR, BLUE_KEY } = require('../../constants')

class BlueDoor extends DoorItem {

  get color () { return 'blue' }

  get type () { return BLUE_DOOR }

  get useWithType () { return BLUE_KEY }

}


const { RED_DOOR, RED_KEY } = require('../../constants')

class RedDoor extends DoorItem {

  get color () { return 'red' }

  get type () { return RED_DOOR }

  get useWithType () { return RED_KEY }

}


const { GREEN_DOOR, GREEN_KEY } = require('../../constants')

class GreenDoor extends DoorItem {

  get color () { return 'green' }

  get type () { return GREEN_DOOR }

  get useWithType () { return GREEN_KEY }

}


const { YELLOW_DOOR, YELLOW_KEY } = require('../../constants')

class YellowDoor extends DoorItem {

  get color () { return 'yellow' }

  get type () { return YELLOW_DOOR }

  get useWithType () { return YELLOW_KEY }

}


module.exports = {
  Door,
  BlueDoor,
  RedDoor,
  GreenDoor,
  YellowDoor,
}
