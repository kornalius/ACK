const { SLOT_GENERIC, SLOT_HEAD, SLOT_EYES, SLOT_ARMS, SLOT_HANDS, SLOT_LHAND, SLOT_RHAND, SLOT_TORSO, SLOT_BELT, SLOT_LEGS, SLOT_FOOT } = require('../../constants')

const SlotMixin = Mixin(superclass => class SlotMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'slotType', SLOT_GENERIC)
  }

  get isSlot () { return true }

  get isGenericSlot () { return this._slotType === SLOT_GENERIC }
  get isHeadSlot () { return this._slotType === SLOT_HEAD }
  get isEyesSlot () { return this._slotType === SLOT_EYES }
  get isArmsSlot () { return this._slotType === SLOT_ARMS }
  get isHandsSlot () { return this._slotType === SLOT_HANDS }
  get isLeftHandSlot () { return this._slotType === SLOT_LHAND }
  get isRightHandSlot () { return this._slotType === SLOT_RHAND }
  get isTorsoSlot () { return this._slotType === SLOT_TORSO }
  get isBeltSlot () { return this._slotType === SLOT_BELT }
  get isLegsSlot () { return this._slotType === SLOT_LEGS }
  get isFootSlot () { return this._slotType === SLOT_FOOT }

})

module.exports = {
  SlotMixin,
}
