const { StackableItem } = require('./stackable-item')
const { ITEM_KEY } = require('../../../constants')

class KeyItem extends StackableItem {

  get name () { return 'key' }
  get type () { return ITEM_KEY }

}

module.exports = {
  KeyItem,
}
