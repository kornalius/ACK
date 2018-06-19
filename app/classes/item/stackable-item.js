const { PickableItem } = require('./pickable-item')
const { StackableMixin } = require('../../mixins/item/stackable')

class StackableItem extends mix(PickableItem).with(StackableMixin) {

}

module.exports = {
  StackableItem,
}
