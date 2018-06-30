const { NpcObject } = require('../objects/npc-object')

class Player extends NpcObject {

  get isPlayer () { return true }

}

module.exports = {
  Player,
}
