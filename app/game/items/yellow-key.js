const { KeyItem } = require('../../classes/core/items/key-item')
const { YELLOW_KEY } = require('../../constants')

class YellowKey extends KeyItem {

  get name () { return 'Yellow Key Card' }
  get type () { return YELLOW_KEY }
  get spriteFrame () { return 'yellow-key.png' }

}

module.exports = {
  YellowKey,
}
