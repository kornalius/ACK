const SightMixin = Mixin(superclass => class SightMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'sightRadius', 6)
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
    this._map.fovs[this._z].compute(this._x, this._y, this._sightRadius, (x, y, radius, visibility) => {
      if (x === otherX && y === otherY) {
        found = true
      }
    })
    return found
  }

  scanForFriends () {
    let friends = []
    let radius = this._sightRadius
    let npcs = this._map.npcsAround(this._x, this._y, this._z, radius)

    for (let npc of npcs) {
      if (this.canSee(npc) && (!this.hasRelations || npc.isFriendWith(this))) {
        friends.push(npc)
      }
    }

    return friends
  }

  scanForEnemies () {
    let enemies = []

    let radius = this._sightRadius
    let npcs = this._map.npcsAround(this._x, this._y, this._z, radius)

    for (let npc of npcs) {
      if (this.canSee(npc) && this.hasRelations && npc.isEnemyOf(this)) {
        enemies.push(npc)
      }
    }

    return enemies
  }

  updateFov () {
    let pt = new PIXI.Point(this._x, this._y)
    let z = this._z
    let s = this._sightRadius

    if (_.isArray(this._prevSprites)) {
      _.each(this._prevSprites, s => { s.alpha = !s._parent.isNpc ? 0.2 : 0 })
    }
    this._prevSprites = []

    this._map.fovs[z].compute(this._x, this._y, this._sightRadius, (x, y) => {
      this._map.setExplored(x, y, z, true)

      let alpha = 0
      if (this._map.isFloorAt(x, y, z) || this._map.isWallAt(x, y, z)) {
        alpha = Math.max(0.2, 1 - (pt.distance(new PIXI.Point(x, y)) / s))
      }

      let sprites = this._map.spritesAt(x, y, z)
      _.each(sprites, s => { s.alpha = alpha })

      this._prevSprites = _.concat(this._prevSprites, sprites)
    })
  }

})

module.exports = {
  SightMixin,
}
