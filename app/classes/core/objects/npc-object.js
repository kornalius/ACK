const { ItemObject } = require('./item-object')
const { ContainerMixin } = require('../../../mixins/core/container')

class NpcObject extends mix(ItemObject).with(ContainerMixin) {

  kill (attacker) {
    this.emit('dead')
    if (attacker) {
      let exp = (attacker.level - this.level) * 3
      if (exp > 0) {
        attacker.giveExperience(exp)
      }
    }
    if (this.map) {
      this.map.removeNpcAt(this, this.x, this.y, this.z)
    }
  }

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
