const { ItemObject } = require('../../core/objects/item-object')
const { ActivableMixin } = require('../../../mixins/core/activable')

class ActivableItem extends mix(ItemObject).with(ActivableMixin) {

}

module.exports = {
  ActivableItem,
}
