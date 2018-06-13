const { NpcObject } = require('./npc-object')

class PlayerObject extends NpcObject {

  constructor (x, y, z, map, type) {
    super(x, y, z, map, type)
  }

  reset () {
    super.reset()
    this._fov = undefined
  }

  setupFov () {
    this._fov = new ACK.ROT.FOV.PreciseShadowcasting((x, y) => _.get(this._map.tileAt(x, y, this._z), 'sightBlocked', true))
  }

}

module.exports = {
  PlayerObject,
}
