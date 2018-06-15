const { ActivableItem } = require('../../classes/core/items/activable-item')
const { ITEM_STAIRS } = require('../../constants')

class StairsUp extends ActivableItem {

  get type () { return ITEM_STAIRS }

  get isStairsUp () { return true }

  canActivate (npc) {
    return super.canActivate(npc) && npc.isPlayer
  }

  activate (npc) {
    if (this.canActivate(npc)) {
      this._map.gotoLevel(this._map.level + 1)
    }
  }

}

module.exports = {
  StairsUp,
}
