const { ItemObject } = require('../objects/item-object')
const { PickableMixin } = require('../../mixins/item/pickable')
const { DropableMixin } = require('../../mixins/item/dropable')

class PickableItem extends mix(ItemObject).with(PickableMixin, DropableMixin) {

}

module.exports = {
  PickableItem,
}
