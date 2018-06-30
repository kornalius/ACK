const { Room } = require('../../classes/core/room')

class Wakeup extends Room {

  constructor () {
    super(...arguments)
  }

  start () {
    super.start()

    this.addItemToRoom(new ACK.Doors.WoodDoor(140, 96, this))
    this.addItemToRoom(new ACK.Windows.WoodWindow(80, 104, this))
    this.addItemToRoom(new ACK.Windows.WoodWindow(200, 104, this))
  }

}

module.exports = {
  Wakeup
}
