const { KeyItem } = require('../../classes/core/items/key-item')
const { GREEN_KEY } = require('../../constants')

class GreenKey extends KeyItem {

  get name () { return 'Green Key Card' }
  get type () { return GREEN_KEY }
  get spriteFrame () { return 'green-key.png' }

}

module.exports = {
  GreenKey,
}
