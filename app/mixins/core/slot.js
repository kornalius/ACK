const { SLOT_GENERIC, SLOT_HEAD, SLOT_EYES, SLOT_ARMS, SLOT_HANDS, SLOT_LHAND, SLOT_RHAND, SLOT_TORSO, SLOT_BELT, SLOT_LEGS, SLOT_FOOT } = require('../../constants')

const SlotMixin = Mixin(superclass => class SlotMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'type', SLOT_GENERIC)
  }

  get isSlot () { return true }

  get isGenericSlot () { return this._type === SLOT_GENERIC }
  get isHeadSlot () { return this._type === SLOT_HEAD }
  get isEyesSlot () { return this._type === SLOT_EYES }
  get isArmsSlot () { return this._type === SLOT_ARMS }
  get isHandsSlot () { return this._type === SLOT_HANDS }
  get isLeftHandSlot () { return this._type === SLOT_LHAND }
  get isRightHandSlot () { return this._type === SLOT_RHAND }
  get isTorsoSlot () { return this._type === SLOT_TORSO }
  get isBeltSlot () { return this._type === SLOT_BELT }
  get isLegsSlot () { return this._type === SLOT_LEGS }
  get isFootSlot () { return this._type === SLOT_FOOT }

})

module.exports = {
  SlotMixin,
}
