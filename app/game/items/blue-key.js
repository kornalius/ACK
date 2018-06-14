const { KeyItem } = require('../../classes/core/items/key-item')
const { BLUE_KEY } = require('../../constants')

class BlueKey extends KeyItem {

  get name () { return 'Blue Key Card' }
  get type () { return BLUE_KEY }
  get spriteFrame () { return 'blue-key.png' }

}

module.exports = {
  BlueKey,
}
