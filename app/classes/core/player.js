const { NpcObject } = require('./objects/npc-object')

class Player extends NpcObject {

  get isPlayer () { return true }

  get spriteFrame () { return ['player-1.png', 'player-2.png'] }

  moveTo (x, y, z, map) {
    if (super.moveTo(x, y, z, map)) {
      if (this.hasSight) {
        this.updateFov()
      }
      this.centerOn()
      return true
    }
    return false
  }

}

module.exports = {
  Player,
}
