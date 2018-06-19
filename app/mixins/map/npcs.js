const NpcsMixin = Mixin(superclass => class NpcsMixin extends superclass {

  get npcs () { return this._npcs }

  reset () {
    super.reset()

    this._npcs = []
  }

  npcsAt (x, y, z) {
    return _.filter(this._npcs, n => n.x === x && n.y === y && n.z === z)
  }

  npcsAround (centerX, centerY, centerZ) {
    let npcs = _.map(this.around(centerX, centerY, centerZ), 'npcs')
    return _.flatten(_.filter(npcs, a => !_.isEmpty(a)))
  }

  npcsInLevel (z) {
    return _.filter(this._npcs, { z })
  }

  npcsInRoom (idx, z) {
    let r = this.roomBounds(idx, z)
    return _.filter(this._npcs, n => n.z === z && r.contains(n.x, n.y))
  }

  npcsInCorridor (idx, z) {
    let r = this.corridorBounds(idx, z)
    return _.filter(this._npcs, n => n.z === z && r.contains(n.x, n.y))
  }

  addNpcAtRandomPosition (npc, z) {
    let p = this.getRandomFloorPosition(z)
    if (p) {
      return this.addNpc(p.x, p.y, z, npc)
    }
    return false
  }

  addNpcAt (npc, x = npc.x, y = npc.y, z = npc.z) {
    if (!npc.isAt(x, y, z, this)) {
      npc.moveTo(x, y, z, this)
      this._npcs.push(npc)
      return true
    }
    return false
  }

  removeNpcAt (npc, x = npc.x, y = npc.y, z = npc.z) {
    if (npc.isAt(x, y, z, this)) {
      _.remove(this._npcs, npc)
      npc.map = undefined
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
