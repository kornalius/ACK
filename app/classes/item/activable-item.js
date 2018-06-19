const { ItemObject } = require('../objects/item-object')
const { ActivableMixin } = require('../../mixins/item/activable')

class ActivableItem extends mix(ItemObject).with(ActivableMixin) {

}

module.exports = {
  ActivableItem,
}
