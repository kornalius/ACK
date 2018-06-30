const { ActivableItem } = require('./activable-item')
const { OpenerMixin } = require('../../mixins/core/opener')
const { LockerMixin } = require('../../mixins/core/locker')
const { UsableWithMixin } = require('../../mixins/item/usable-with')

const { WINDOW } = require('../../constants')

class WindowItem extends mix(ActivableItem).with(OpenerMixin, LockerMixin, UsableWithMixin) {

  get isWindow () { return true }

  get type () { return WINDOW }

  get material () { return undefined }

  get name () { return _.upperFirst((this.material ? this.material + ' ' : '') + (this.opened ? 'opened' : 'closed') + ' door') }

  get spriteFrame () { return (this.material ? this.material + '-' : '') + 'window-' + (this.opened ? 'opened' : 'closed') + '.png' }

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
  WindowItem,
}
