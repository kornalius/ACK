const { ItemObject } = require('../objects/item-object')
const { StackableMixin } = require('../../../mixins/core/stackable')

class StackableItem extends mix(ItemObject).with(StackableMixin) {

}

module.exports = {
  StackableItem,
}
