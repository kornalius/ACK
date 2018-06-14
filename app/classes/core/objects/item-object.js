const { GameObject } = require('./game-object')
const { SLOT_GENERIC } = require('../../../constants')

class ItemObject extends GameObject {

  constructor (x, y, z, map) {
    super(x, y, z, map)

    if (this.spriteFrame) {
      this.createSprite(this.spriteFrame)
      this._map.update()
    }
  }

  get type () { return 0 }

  get slotType () { return SLOT_GENERIC }

  get spriteFrame () { return undefined }

  kill (attacker) {
    this.emit('dead')
    if (attacker) {
      let exp = (attacker.level - this.level) * 3
      if (exp > 0) {
        attacker.giveExperience(exp)
      }
    }
    if (this.map) {
      this.map.removeItemAt(this, this.x, this.y, this.z)
    }
  }

}

module.exports = {
  ItemObject,
}
