const { Scene } = require('../../classes/core/scene')

class IntroScene extends Scene {

  constructor () {
    super()
  }

  start () {
    super.start()
  }

  stop () {
    super.stop()
  }

  load (cb) {
    cb()
  }

  act (t, delta) {
    super.act(t, delta)
  }

}

module.exports = {
  IntroScene,
}
