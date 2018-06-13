const SightMixin = Mixin(superclass => class SightMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'sightRadius', 1)
  }

  get hasSight () { return true }

  canSee (entity) {
    if (!entity || this._map !== entity.map || this._z !== entity.z) {
      return false
    }

    let otherX = entity.x
    let otherY = entity.y

    if ((otherX - this._x) * (otherX - this._x) + (otherY - this._y) * (otherY - this._y) > this._sightRadius * this._sightRadius) {
      return false
    }

    let found = false
    this.map.fovs[this._z].compute(this._x, this._y, this._sightRadius, (x, y, radius, visibility) => {
      if (x === otherX && y === otherY) {
        found = true
      }
    })
    return found
  }

  scanForFriends () {
    let friends = []
    let radius = this.sightRadius
    let npcs = this.map.npcsAround(this._x, this._y, this._z, radius)

    for (let npc of npcs) {
      if (this.canSee(npc) && (!this.hasRelations || npc.isFriendWith(this))) {
        friends.push(npc)
      }
    }

    return friends
  }

  scanForEnemies () {
    let enemies = []

    let radius = this.sightRadius
    let npcs = this.map.npcsAround(this._x, this._y, this._z, radius)

    for (let npc of npcs) {
      if (this.canSee(npc) && this.hasRelations && npc.isEnemyOf(this)) {
        enemies.push(npc)
      }
    }

    return enemies
  }

})

module.exports = {
  SightMixin,
}
