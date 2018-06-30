const { GameObject } = require('./game-object')
const { SLOT_GENERIC } = require('../../constants')

class ItemObject extends GameObject {

  get type () { return 0 }

  get slotType () { return SLOT_GENERIC }

  isOfType (type) {
    if (_.isArray(type)) {
      return _.includes(type, this.type)
    }
    return this.type === type
  }

}

module.exports = {
  ItemObject,
}
