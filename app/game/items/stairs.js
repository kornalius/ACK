const { ActivableItem } = require('../../classes/core/items/activable-item')
const { ITEM_STAIRS } = require('../../constants')

class StairsUp extends ActivableItem {

  get type () { return ITEM_STAIRS }

  get spriteFrame () { return 'stairs-up.png' }

  get isStairsUp () { return true }

  canActivate (npc) {
    return super.canActivate(npc) && npc.isPlayer
  }

  activate (npc) {
    if (this.canActivate(npc)) {
      this._map.gotoLevel(this._map.level + 1, npc.x, npc.y)
    }
  }

}


class StairsDown extends ActivableItem {

  get type () { return ITEM_STAIRS }

  get spriteFrame () { return 'stairs-down.png' }

  get isStairsDown () { return true }

  canActivate (npc) {
    return super.canActivate(npc) && npc.isPlayer
  }

  activate (npc) {
    if (this.canActivate(npc)) {
      this._map.gotoLevel(this._map.level - 1, npc.x, npc.y)
    }
  }

}


module.exports = {
  StairsUp,
  StairsDown,
}
