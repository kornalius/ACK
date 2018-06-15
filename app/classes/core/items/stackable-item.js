const { PickableItem } = require('../objects/pickable-item')
const { StackableMixin } = require('../../../mixins/core/stackable')

class StackableItem extends mix(PickableItem).with(StackableMixin) {

}

module.exports = {
  StackableItem,
}
