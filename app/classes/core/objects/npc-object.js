const { ItemObject } = require('./item-object')

class NpcObject extends ItemObject {

  constructor (x, y, z, map, type) {
    super(x, y, z, map, type)
  }

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

}

module.exports = {
  NpcObject,
}
