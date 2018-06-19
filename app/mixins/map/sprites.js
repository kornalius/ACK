const SpritesMixin = Mixin(superclass => class SpritesMixin extends superclass {

  get sprites () {
    return _.concat(
      _.filter(_.map(this._tiles, t => t.sprite), s => !_.isUndefined(s)),
      _.filter(_.map(this._items, i => i.sprite), s => !_.isUndefined(s)),
      _.filter(_.map(this._npcs, n => n.sprite), s => !_.isUndefined(s)),
      this.player && this.player.sprite ? [this.player.sprite] : [],
    )
  }

  spritesAt (x, y, z) {
    let at = this.at(x, y, z)
    return _.concat(
      at.tile && at.tile.sprite ? [at.tile.sprite] : [],
      _.filter(_.map(at.items, i => i.sprite), s => !_.isUndefined(s)),
      _.filter(_.map(at.npcs, n => n.sprite), s => !_.isUndefined(s)),
      at.player && at.player.sprite ? [at.player.sprite] : [],
    )
  }

  spritesInLevel (z) {
    let tiles = this.tilesInLevel(z)
    let items = this.itemsInLevel(z)
    let npcs = this.npcsInLevel(z)
    return _.concat(
      _.map(tiles, t => t.sprite),
      _.map(items, i => i.sprite),
      _.map(npcs, n => n.sprite),
      this.player.z === z ? [this.player.sprite] : [],
    )
  }

  spritesInRoom (idx, z) {
    let tiles = this.tilesInRoom(idx, z)
    let items = this.itemsInRoom(idx, z)
    let npcs = this.npcsInRoom(idx, z)
    return _.concat(
      _.map(tiles, t => t.sprite),
      _.map(items, i => i.sprite),
      _.map(npcs, n => n.sprite),
      this.playerInRoom(idx, z) ? [this.player.sprite] : [],
    )
  }

  spritesInCorridor (idx, z) {
    let tiles = this.tilesInCorridor(idx, z)
    let items = this.itemsInCorridor(idx, z)
    let npcs = this.npcsInCorridor(idx, z)
    return _.concat(
      _.map(tiles, t => t.sprite),
      _.map(items, i => i.sprite),
      _.map(npcs, n => n.sprite),
      this.playerInCorridor(idx, z) ? [this.player.sprite] : [],
    )
  }

  resetSpritesTint () {
    for (let sprite of this.sprites) {
      sprite.tint = 0xFFFFFF
    }
  }

})

module.exports = {
  SpritesMixin,
}
