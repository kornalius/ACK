const { Scene } = require('../core/scene')

let PlayScene = class PlayScene extends Scene {

  constructor () {
    super()
  }

  start () {
    super.start()

    this.newSprite('healthbar.png', 2, 2, 0)
    this.newSprite('cpubar.png', 2, 12, 0)
    this.newSprite('diskbar.png', 2, 24, 0)
  }

  stop () {
    super.stop()
  }

  load (cb) {
    cb()
  }

  act (t, delta) {
  }

}

module.exports = {
  PlayScene,
}
