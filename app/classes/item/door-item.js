const { ActivableItem } = require('./activable-item')
const { OpenerMixin } = require('../../mixins/core/opener')
const { LockerMixin } = require('../../mixins/core/locker')
const { UsableWithMixin } = require('../../mixins/item/usable-with')

const { DOOR } = require('../../constants')

class DoorItem extends mix(ActivableItem).with(OpenerMixin, LockerMixin, UsableWithMixin) {

  get isDoor () { return true }

  get type () { return DOOR }

  get color () { return undefined }

  get material () { return undefined }

  get name () { return _.upperFirst((this.color ? this.color + ' ' : '') + (this.material ? this.material + ' ' : '') + (this.opened ? 'opened' : 'closed') + ' door') }

  get spriteFrame () { return (this.color ? this.color + '-' : '') + (this.material ? this.material + '-' : '') + 'door-' + (this.opened ? 'opened' : 'closed') + '.png' }

  get blocked () { return !this.opened }

  useWith (amount = 1, source) {
    return this.unlock()
  }

  activate (npc) {
    if (this.isUnlocked && !this.isOpened) {
      this.open(npc)
    }
  }

}

module.exports = {
  DoorItem,
}
