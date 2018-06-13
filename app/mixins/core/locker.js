const LockerMixin = Mixin(superclass => class LockerMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'locked', false)
    _.addProp(this, 'keyId')
  }

  get isLocker () { return true }

  get isLocked () { return this._locked }
  get isUnlocked () { return !this._locked }
  get needsKey () { return !_.isEmpty(this.keyId) }

  canLock (npc) {
    return this.isUnlocked && (!this.needsKey || npc && npc.hasKey(this.keyId))
  }

  lock (npc) {
    if (this.canLock(npc)) {
      this.locked = true
    }
  }

  canUnlock (npc) {
    return this.isLocked && (!this.needsKey || npc && npc.hasKey(this.keyId))
  }

  unlock (npc) {
    if (this.canUnlock(npc)) {
      this.locked = false
    }
  }

})

module.exports = {
  LockerMixin,
}
