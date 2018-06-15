const { ItemObject } = require('../objects/item-object')
const { PickableMixin } = require('../../../mixins/core/pickable')
const { DropableMixin } = require('../../../mixins/core/dropable')

class PickableItem extends mix(ItemObject).with(PickableMixin, DropableMixin) {

}

module.exports = {
  PickableItem,
}
