const { Scene } = require('../core/scene')

let EndScene = class EndScene extends Scene {

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
  EndScene,
}
