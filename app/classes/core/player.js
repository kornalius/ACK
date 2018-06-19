const { NpcObject } = require('../objects/npc-object')

class Player extends NpcObject {

  get isPlayer () { return true }

  get spriteFrame () { return ['player-1.png', 'player-2.png'] }

  moveTo (x = this._x, y = this._y, z = this._z, map = this._map, activate = true, animate = this.animateMove) {
    let door = this._map && this._map.doorAt(x, y, z)
    if (door && door.isUnlocked && !door.isOpened) {
      door.activate(this)
      return false
    }

    if (super.moveTo(x, y, z, map, animate)) {

      if (activate) {
        setTimeout(() => {
          let items = this._map ? this._map.itemsAt(x, y, z) : []
          _.each(items, i => {
            if (i.isActivable) {
              i.activate(this)
            }
          })
        }, 100)
      }

      return true
    }
    return false
  }

}

module.exports = {
  Player,
}
