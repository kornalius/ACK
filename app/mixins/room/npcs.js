const NpcsMixin = Mixin(superclass => class NpcsMixin extends superclass {

  constructor () {
    super(...arguments)

    this._npcs = []
  }

  get npcs () { return this._npcs }

  npcsAt (x, y) {
    return _.filter(this._npcs, n => n.bounds.contains(x, y))
  }

  hasNpcInRoom (npc) {
    return !_.isUndefined(_.find(this._npcs, npc))
  }

  addNpcInRoom (npc) {
    if (!this.hasNpcInRoom(npc)) {
      this._npcs.push(npc)
      npc.room = this
      return true
    }
    return false
  }

  removeNpcAt (npc, x = npc.x, y = npc.y) {
    if (this.hasNpcInRoom(npc)) {
      _.remove(this._npcs, npc)
      npc.room = undefined
      return true
    }
    return false
  }

  act (t, delta) {
    super.act(t, delta)

    for (let n of this._npcs) {
      n.act(t, delta)
    }
  }

})

module.exports = {
  NpcsMixin,
}
