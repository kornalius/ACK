const { GameObject } = require('./game-object')
const { SLOT_GENERIC } = require('../../constants')

class ItemObject extends GameObject {

  get type () { return 0 }

  get slotType () { return SLOT_GENERIC }

  isOfType (type) {
    if (_.isArray(type)) {
      return _.includes(type, this.type)
    }
    return this.type === type
  }

  kill (attacker) {
    this.emit('dead')
    if (attacker) {
      let exp = (attacker.level - this.level) * 3
      if (exp > 0) {
        attacker.giveExperience(exp)
      }
    }
    if (this._map) {
      this._map.removeItemAt(this, this.x, this.y, this.z)
    }
  }

}

module.exports = {
  ItemObject,
}
