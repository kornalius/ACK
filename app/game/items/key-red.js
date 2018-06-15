const { KeyItem } = require('../../classes/core/items/key-item')
const { RED_KEY } = require('../../constants')

class RedKey extends KeyItem {

  get color () { return 'red' }

  get type () { return RED_KEY }

}

module.exports = {
  RedKey,
}
