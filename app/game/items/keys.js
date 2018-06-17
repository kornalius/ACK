const { KeyItem } = require('../../classes/core/items/key-item')


const { BLUE_KEY } = require('../../constants')

class BlueKey extends KeyItem {

  get name () { return 'Blue Key Card' }

  get type () { return BLUE_KEY }

  get spriteFrame () { return 'blue-key.png' }

}


const { GREEN_KEY } = require('../../constants')

class GreenKey extends KeyItem {

  get name () { return 'Green Key Card' }

  get type () { return GREEN_KEY }

  get spriteFrame () { return 'green-key.png' }

}


const { RED_KEY } = require('../../constants')

class RedKey extends KeyItem {

  get color () { return 'red' }

  get type () { return RED_KEY }

}


const { YELLOW_KEY } = require('../../constants')

class YellowKey extends KeyItem {

  get name () { return 'Yellow Key Card' }

  get type () { return YELLOW_KEY }

  get spriteFrame () { return 'yellow-key.png' }

}

module.exports = {
  BlueKey,
  GreenKey,
  RedKey,
  YellowKey,
}
