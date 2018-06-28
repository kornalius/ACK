const { TileObject } = require('../../../classes/objects/tile-object')
const { TILE_WALL, TILE_FLOOR } = require('../../../constants')

const LevelsGeneratorMixin = Mixin(superclass => class LevelsGeneratorMixin extends superclass {

  generateLevels () {
    let dungeon = new ACK.ROT.Map.Uniform(this._width, this._height)

    for (let z = 0; z < this._depth; z++) {
      dungeon.create((x, y, wall) => this._tiles.push(new TileObject(x, y, z, this, wall ? TILE_WALL : TILE_FLOOR)))
      this._rooms[z] = dungeon.getRooms()
      this._corridors[z] = dungeon.getCorridors()
      this.generateDoors(dungeon, z)
    }

    this.generateStairs()
  }

})

module.exports = {
  LevelsGeneratorMixin,
}
