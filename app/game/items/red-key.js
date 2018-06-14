const { KeyItem } = require('../../classes/core/items/key-item')
const { RED_KEY } = require('../../constants')

class RedKey extends KeyItem {

  get name () { return 'Red Key Card' }
  get type () { return RED_KEY }
  get spriteFrame () { return 'red-key.png' }

}

module.exports = {
  RedKey,
}
