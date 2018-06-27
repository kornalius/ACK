const { TileObject } = require('../../../classes/objects/tile-object')

const { TILE_WALL, TILE_FLOOR, TILE_WALL_UP, TILE_WALL_DOWN, TILE_WALL_LEFT, TILE_WALL_RIGHT, TILE_WALL_DOWN_LEFT, TILE_WALL_DOWN_RIGHT, TILE_WALL_UP_LEFT, TILE_WALL_UP_RIGHT, TILE_WALL_CORNER_UP_LEFT, TILE_WALL_CORNER_UP_RIGHT, TILE_WALL_CORNER_DOWN_LEFT, TILE_WALL_CORNER_DOWN_RIGHT, TILE_WALL_LEFT_RIGHT } = require('../../../constants')

const WallsGeneratorMixin = Mixin(superclass => class WallsGeneratorMixin extends superclass {

  _setWall (wall, x, y, z) {
    let t = this.tileAt(x, y, z)
    if (!t) {
      this._tiles.push(new TileObject(x, y, z, this, wall))
    }
    else if (t.type === TILE_WALL) {
      t.type = wall
    }
  }

  _topWalls (z, left, right, top) {
    let y = top - 1
    for (let x = left; x <= right; x++) {
      this._setWall(TILE_WALL_UP, x, y, z)
    }
  }

  _bottomWalls (z, left, right, bottom) {
    let y = bottom + 1
    for (let x = left; x <= right; x++) {
      this._setWall(TILE_WALL_DOWN, x, y, z)
    }
  }

  _leftWalls (z, left, top, bottom) {
    let x = left - 1
    for (let y = top; y <= bottom; y++) {
      this._setWall(TILE_WALL_LEFT, x, y, z)
    }
  }

  _rightWalls (z, right, top, bottom) {
    let x = right + 1
    for (let y = top; y <= bottom; y++) {
      this._setWall(TILE_WALL_RIGHT, x, y, z)
    }
  }

  _sideWalls (z, left, top, right, bottom) {
    this._topWalls(z, left, right, top)
    this._bottomWalls(z, left, right, bottom)
    this._leftWalls(z, left, top, bottom)
    this._rightWalls(z, right, top, bottom)
  }

  _cornerWalls (z, left, top, right, bottom) {
    this._setWall(TILE_WALL_LEFT, left - 1, top - 1, z)
    this._setWall(TILE_WALL_RIGHT, right + 1, top - 1, z)
    this._setWall(TILE_WALL_DOWN_LEFT, left - 1, bottom + 1, z)
    this._setWall(TILE_WALL_DOWN_RIGHT, right + 1, bottom + 1, z)
  }

  generateRoomWalls (z) {
    for (let room of this._rooms[z]) {
      let r = this.roomBounds(room)

      this._sideWalls(z, r.left, r.top, r.right, r.bottom)
      this._cornerWalls(z, r.left, r.top, r.right, r.bottom)
    }
  }

  generateCorridorWalls (z) {
    for (let corridor of this._corridors[z]) {
      let left = corridor._startX
      let top = corridor._startY
      let right = corridor._endX
      let bottom = corridor._endY

      if (top > bottom) {
        let t = top
        top = bottom
        bottom = t
      }

      if (left > right) {
        let l = left
        left = right
        right = l
      }

      this._sideWalls(z, left, top, right, bottom)
      this._cornerWalls(z, left, top, right, bottom)
    }
  }

  adjustCorners (z) {
    // from top to bottom
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let t = this.tileAt(x, y, z)
        if (t && t.isWall) {
          let type = t.type

          let lt = _.get(this.tileAt(x - 1, y, z), 'type')
          let rt = _.get(this.tileAt(x - 1, y, z), 'type')
          let tt = _.get(this.tileAt(x, y - 1, z), 'type')
          let bt = _.get(this.tileAt(x, y + 1, z), 'type')

          // fLf | fRf
          if (lt === TILE_FLOOR && (type === TILE_WALL_LEFT || type === TILE_WALL_RIGHT) && rt === TILE_FLOOR) {
            t.type = TILE_WALL_LEFT_RIGHT
          }

          // Df
          else if (type === TILE_WALL_DOWN && rt === TILE_FLOOR) {
            t.type = TILE_WALL_DOWN_LEFT
          }

          // fD
          else if (lt === TILE_FLOOR && type === TILE_WALL_DOWN) {
            t.type = TILE_WALL_DOWN_RIGHT
          }

          // UL
          else if (lt === TILE_FLOOR && type === TILE_WALL_DOWN) {
            t.type = TILE_WALL_DOWN_RIGHT
          }
        }
      }
    }
  }

})

module.exports = {
  WallsGeneratorMixin,
}
