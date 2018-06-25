const CorridorsMixin = Mixin(superclass => class CorridorsMixin extends superclass {

  constructor () {
    super(...arguments)

    this._corridors = undefined
  }

  get corridors () { return this._corridors }

  corridorBounds (idx, z) {
    let c = _.isNumber(idx) ? this._corridors[z][idx] : idx
    return new PIXI.Rectangle(c._startX, c._startY, c._endX - c._startX, c._endY - c._startY)
  }

  corridorAt (x, y, z) {
    for (let corridor of this._corridors[z]) {
      let r = this.corridorBounds(corridor)
      if (r.contains(x, y)) {
        return r
      }
    }
    return undefined
  }

  inCorridor (idx, z) {
    let tiles = this.tilesInCorridor(idx, z)
    let items = this.itemsInCorridor(idx, z)
    let npcs = this.npcsInCorridor(idx, z)
    return { tiles, items, npcs, player: this.playerInCorridor(idx, z) ? this.player : undefined }
  }

  playerInCorridor (idx, z) {
    let r = this.corridorBounds(idx, z)
    let player = this.player
    return player.z === z && r.contains(player.x, player.y)
  }

  tilesInCorridor (idx, z) {
    let r = this.corridorBounds(idx, z)
    return _.filter(this._tiles, t => t.z === z && r.contains(t.x, t.y))
  }

})

module.exports = {
  CorridorsMixin,
}
