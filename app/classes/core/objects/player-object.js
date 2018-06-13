const { NpcObject } = require('./npc-object')

class PlayerObject extends NpcObject {

  constructor (x, y, z, map, type) {
    super(x, y, z, map, type)
  }

  reset () {
    super.reset()
    this._fov = undefined
  }

  setupFov (map) {
    this._fov = new ACK.ROT.FOV.PreciseShadowcasting((x, y) => _.get(map.tileAt(x, y, this._z), 'blocksLight', true))
  }

}

module.exports = {
  PlayerObject,
}
