const { GameObject } = require('./game-object')

class ItemObject extends GameObject {

  constructor (x, y, z, map, type) {
    super(x, y, z, map)

    this._type = type
  }

  get type () { return this._type }
  set type (value) {
    if (value !== this._type) {
      this._type = value
      this.destroySprite()
      let sf = this.spriteFrame
      if (sf) {
        this.createSprite(sf)
      }
      this._map.update()
    }
  }

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
