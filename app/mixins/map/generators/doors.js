const { Door, RedDoor, BlueDoor, GreenDoor, YellowDoor } = require('../../../game/items/doors')
const { RedKey, BlueKey, GreenKey, YellowKey } = require('../../../game/items/keys')

const DoorsGeneratorMixin = Mixin(superclass => class DoorsGeneratorMixin extends superclass {

  generateDoors (dungeon, z) {
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
        if (!this.hasDoor(x, y, z)) {
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

})

module.exports = {
  DoorsGeneratorMixin,
}
