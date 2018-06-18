const LockerMixin = Mixin(superclass => class LockerMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'locked', false)
  }

  get isLocker () { return true }

  get isLocked () { return this._locked }
  get isUnlocked () { return !this._locked }

  canLock () {
    return this.isUnlocked
  }

  lock () {
    if (this.canLock()) {
      this.locked = true
      this.updateSpriteFrame()
      this.emit('lock')
      return true
    }
    return false
  }

  canUnlock () {
    return this.isLocked
  }

  unlock () {
    if (this.canUnlock()) {
      this.locked = false
      this.updateSpriteFrame()
      this.emit('unlock')
      return true
    }
    return false
  }

})

module.exports = {
  LockerMixin,
}
