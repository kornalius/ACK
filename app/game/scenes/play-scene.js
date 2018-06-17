const { Scene } = require('../../classes/core/scene')
const { MAP_WIDTH, MAP_HEIGHT, MAP_DEPTH } = require('../../constants')
const { Map } = require('../../classes/core/map')

let PlayScene = class PlayScene extends Scene {

  constructor () {
    super()

    this._maps = []
  }

  get map () { return this._map }
  get maps () { return this._maps }

  get uiContainer () { return this._uiContainer }
  get playContainer () { return this._playContainer }

  start () {
    super.start()

    this._playContainer = this.newContainer([])
    this.addToScene(this._playContainer)

    this._uiContainer = this.newContainer([
      this.newSprite('healthbar.png', 2, 2, 0),
      this.newSprite('cpubar.png', 120, 2, 0),
      this.newSprite('diskbar.png', 238, 2, 0),
    ])
    this.addToScene(this._uiContainer)

    let depth = Math.floor(Math.random() * MAP_DEPTH)
    this._map = new Map(MAP_WIDTH, MAP_HEIGHT, depth)
    this._maps.push(this._map)
    this._map.start()

    this.addToPlayContainer(this._map.container)
  }

  stop () {
    super.stop()

    this._map.stop()
    this.removeFromScene(this._uiContainer)
  }

  load (cb) {
    cb()
  }

  act (t, delta) {
    super.act(t, delta)
  }

  addToPlayContainer (sprite) {
    if (_.isArray(sprite)) {
      for (let s of sprite) {
        this._playContainer.addChild(s)
      }
    }
    else {
      this._playContainer.addChild(sprite)
    }
    ACK.update()
  }

  removeFromPlayContainer (sprite) {
    if (_.isArray(sprite)) {
      for (let s of sprite) {
        this._playContainer.removeChild(s)
      }
    }
    else {
      this._playContainer.removeChild(sprite)
    }
    ACK.update()
  }

}

module.exports = {
  PlayScene,
}
