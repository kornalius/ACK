const { ActivableItem } = require('./activable-item')
const { OpenerMixin } = require('../../mixins/core/opener')
const { LockerMixin } = require('../../mixins/core/locker')
const { UsableWithMixin } = require('../../mixins/item/usable-with')
const { ITEM_DOOR } = require('../../constants')

class DoorItem extends mix(ActivableItem).with(OpenerMixin, LockerMixin, UsableWithMixin) {

  get isDoor () { return true }

  get color () { return '' }

  get name () { return _.upperFirst(this.color) + ' ' + (this.opened ? 'Opened' : 'Closed') + ' Door' }

  get type () { return ITEM_DOOR }

  get spriteFrame () { return this.color + '-door-' + (this.opened ? 'opened' : 'closed') + '.png' }

  get blocked () { return !this.opened }

  get sightBlocked () { return !this.opened }

  get lightBlocked () { return !this.opened }

  useWith (amount = 1, source) {
    return this.unlock()
  }

  activate (npc) {
    if (this.isUnlocked && !this.isOpened) {
      this.open(npc)
      if (npc.hasSight) {
        npc.updateFov()
      }
    }
  }

}

module.exports = {
  DoorItem,
}
