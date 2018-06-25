const { TileObject } = require('../../classes/objects/tile-object')

const { StairsUp, StairsDown } = require('../../game/items/stairs')
const { Door, RedDoor, BlueDoor, GreenDoor, YellowDoor } = require('../../game/items/doors')
const { RedKey, BlueKey, GreenKey, YellowKey } = require('../../game/items/keys')

const { TILE_WALL, TILE_FLOOR } = require('../../constants')

const GeneratorsMixin = Mixin(superclass => class GeneratorsMixin extends superclass {

  _generateStairs () {
    for (let z = 0; z < this._depth - 1; z++) {
      let idx = this.randomRoom(z)
      let pos = this.randomPositionInRoom(idx, z, (x, y, z) => this.blockedAt(x, y, z) && this.blockedAt(x, y, z + 1))
      if (pos) {
        this.addItemAt(new StairsUp(), pos.x, pos.y, z)
        this.addItemAt(new StairsDown(), pos.x, pos.y, z + 1)
      }
    }
  }

  _generateDoors (dungeon, z) {
    const doors = [Door, Door, Door, Door, Door, Door, RedDoor, Door, Door, Door, BlueDoor, Door, Door, Door, GreenDoor, Door, Door, Door, YellowDoor]
    const keys = {
      Door: undefined,
      RedDoor: RedKey,
      BlueDoor: BlueKey,
      GreenDoor: GreenKey,
      YellowDoor: YellowKey,
    }
    for (let room of this._rooms[z]) {
      room.getDoors((x, y) => {
        let hasDoor = false
        for (let i of this.itemsAt(x, y, z)) {
          if (i.isDoor) {
            hasDoor = true
            break
          }
        }
        if (!hasDoor) {
          let DoorClass = _.sample(doors)
          this.addItemAt(new DoorClass(), x, y, z)

          let KeyClass = keys[DoorClass]
          if (KeyClass) {
            this.addItemAtRandomPosition(new KeyClass(), z)
          }
        }
      })
    }
  }

  _generateLevels () {
    let dungeon = new ACK.ROT.Map.Digger(this._width, this._height)

    for (let z = 0; z < this._depth; z++) {
      dungeon.create((x, y, wall) => this._tiles.push(new TileObject(x, y, z, this, wall ? TILE_WALL : TILE_FLOOR)))
      this._rooms[z] = dungeon.getRooms()
      this._corridors[z] = dungeon.getCorridors()
    }

    for (let z = 0; z < this._depth; z++) {
      this._generateDoors(dungeon, z)
    }

    this._generateStairs()
  }

})

module.exports = {
  GeneratorsMixin,
}
