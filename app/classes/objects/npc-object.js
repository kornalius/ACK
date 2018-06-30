const { ItemObject } = require('./item-object')
const { ContainerMixin } = require('../../mixins/container/container')
const { IdentityMixin } = require('../../mixins/npc/identity')

class NpcObject extends mix(ItemObject).with(ContainerMixin, IdentityMixin) {

  get isNpc () { return true }

  get animateMove () { return true }

  use (item, target, amount = 1) {
    item = this.findItem(item)
    if (item && item.use(target, amount)) {
      return true
    }
    return false
  }

  activate (item) {
    if (item.distanceFrom(this) <= 1) {
      item.activate(this)
    }
  }

}

module.exports = {
  NpcObject,
}
