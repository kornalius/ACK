const OpenerMixin = Mixin(superclass => class OpenerMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'opened', false)
  }

  get isOpener () { return true }

  get isOpened () { return this._opened }
  get isClosed () { return !this._opened }

  canOpen (npc) {
    if (this.isClosed) {
      return !this.isLocker || this.canUnlock(npc)
    }
    return false
  }

  open (npc) {
    if (this.canOpen(npc)) {
      this.opened = true
    }
  }

  canClose (npc) {
    return true
  }

  close (npc) {
    if (this.canClose(npc)) {
      this.opened = false
    }
  }

})

module.exports = {
  OpenerMixin,
}
