const { TILE_WIDTH, TILE_HEIGHT } = require('../../constants')

const TilesMixin = Mixin(superclass => class TilesMixin extends superclass {

  get tiles () { return this._tiles }

  reset () {
    this._tiles = []
  }

  tileAt (x, y, z) {
    return _.find(this._tiles, { x, y, z })
  }

  tilesAround (centerX, centerY, centerZ) {
    let tiles = _.map(this.around(centerX, centerY, centerZ), 'tiles')
    return _.flatten(_.filter(tiles, a => !_.isEmpty(a)))
  }

  tilesInLevel (z) {
    return _.filter(this._tiles, { z })
  }

  tilesInRoom (idx, z) {
    let r = this.roomBounds(idx, z)
    return _.filter(this._tiles, t => t.z === z && r.contains(t.x, t.y))
  }

  tilesInCorridor (idx, z) {
    let r = this.corridorBounds(idx, z)
    return _.filter(this._tiles, t => t.z === z && r.contains(t.x, t.y))
  }

  selectTileAt (x, y) {
    let s = this._tileSelector
    if (!s) {
      s = new PIXI.Sprite(PIXI.Texture.fromFrame('select.png'))
      this._tileSelector = s
    }
    let c = this.levelContainer()
    if (s.parent !== c) {
      if (s.parent) {
        s.parent.removeChild(s)
      }
      c.addChild(s)
    }
    s.position.set(x * TILE_WIDTH, y * TILE_HEIGHT)
  }

  unselectTiles () {
    let s = this._tileSelector
    if (s && s.parent) {
      s.parent.removeChild(s)
    }
  }

  act (t, delta) {
    super.act(t, delta)

    for (let t of this._tiles) {
      t.act(t, delta)
    }
  }

})

module.exports = {
  TilesMixin,
}
