const { ItemObject } = require('./item-object')
const { ContainerMixin } = require('../../../mixins/core/container')
const { SightMixin } = require('../../../mixins/core/sight')

class NpcObject extends mix(ItemObject).with(ContainerMixin, SightMixin) {

  get animateMove () { return true }

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

  canMoveTo (x, y, z, map) {
    x = x || this._x
    y = y || this._y
    z = z || this._z
    map = map || this._map
    return super.canMoveTo(x, y, z, map) && map && !map.blockedAt(x, y, z)
  }

}

module.exports = {
  NpcObject,
}
