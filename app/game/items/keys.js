const { KeyItem } = require('../../classes/item/key-item')


const { KEY_BLUE } = require('../../constants')

class BlueKey extends KeyItem {

  get name () { return 'Blue Key Card' }

  get type () { return KEY_BLUE }

  get spriteFrame () { return 'blue-key.png' }

}


const { KEY_GREEN } = require('../../constants')

class GreenKey extends KeyItem {

  get name () { return 'Green Key Card' }

  get type () { return KEY_GREEN }

  get spriteFrame () { return 'green-key.png' }

}


const { KEY_RED } = require('../../constants')

class RedKey extends KeyItem {

  get color () { return 'red' }

  get type () { return KEY_RED }

}


module.exports = {
  BlueKey,
  GreenKey,
  RedKey,
}
