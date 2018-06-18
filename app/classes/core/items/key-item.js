const { StackableItem } = require('./stackable-item')
const { UsableMixin } = require('../../../mixins/core/usable')
const { ITEM_KEY } = require('../../../constants')

class KeyItem extends mix(StackableItem).with(UsableMixin) {

  get isKey () { return true }

  get color () { return '' }

  get name () { return _.upperFirst(this.color) + ' Key' }

  get type () { return ITEM_KEY }

  get spriteFrame () { return this.color + '-key.png' }

  use (amount = 1, target) {
    return super.use(amount, target)
  }

}

module.exports = {
  KeyItem,
}
