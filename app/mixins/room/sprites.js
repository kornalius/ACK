const SpritesMixin = Mixin(superclass => class SpritesMixin extends superclass {

  get sprites () {
    return _.concat(
      _.filter(_.map(this._items, i => i.sprite), s => !_.isUndefined(s)),
      _.filter(_.map(this._npcs, n => n.sprite), s => !_.isUndefined(s)),
    )
  }

  spritesAt (x, y) {
    let at = this.at(x, y)
    return _.concat(
      _.filter(_.map(at.items, i => i.sprite), s => !_.isUndefined(s)),
      _.filter(_.map(at.npcs, n => n.sprite), s => !_.isUndefined(s)),
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
