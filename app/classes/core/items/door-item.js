const { ItemObject } = require('../../classes/core/objects/item-object')
const { OpenerMixin } = require('../../mixins/core/opener')
const { LockerMixin } = require('../../mixins/core/locker')
const { UsableWithMixin } = require('../../mixins/core/usable-with')
const { ITEM_DOOR } = require('../../constants')

class DoorItem extends mix(ItemObject).with(OpenerMixin, LockerMixin, UsableWithMixin) {

  get color () { return '' }

  get name () { return _.capitalize(this.color) + ' ' + (this.opened ? 'Opened' : 'Closed') + ' Door' }

  get type () { return ITEM_DOOR }

  get spriteFrame () { return this.color + '-door-' + (this.opened ? 'opened' : 'closed') + '.png' }

  get blocked () { return !this.opened }

  get sightBlocked () { return !this.opened }

  get lightBlocked () { return !this.opened }

  useWith (amount = 1, source) {
    return this.unlock()
  }

}

module.exports = {
  DoorItem,
}
