const { Scene } = require('../../classes/core/scene')
const { MAP_WIDTH, MAP_HEIGHT, MAP_DEPTH, VIDEO_HEIGHT } = require('../../constants')
const { Map } = require('../../classes/core/map')

let PlayScene = class PlayScene extends Scene {

  constructor () {
    super()

    this._maps = []
    this._map = undefined
    this._mouseLocation = undefined
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

    this._map = new Map(_.random(16, MAP_WIDTH), _.random(16, MAP_HEIGHT), _.random(1, MAP_DEPTH + 1))
    this._maps.push(this._map)
    this._map.start()

    this.addToPlayContainer(this._map.container)

    if (ACK.DEVMODE) {
      this._mouseLocation = ACK.text()
      this._mouseLocation.sprite.position.set(0, VIDEO_HEIGHT - 10)
      ACK.video.stage.addChild(this._mouseLocation.sprite)
    }
  }

  stop () {
    super.stop()

    this._map.stop()
    this.removeFromScene(this._uiContainer)

    this._mouseLocation = undefined
  }

  destroy () {
    for (let m of this._maps) {
      m.destroy()
    }
    this._maps = []
    this._map = undefined
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

  updateDevInfo (options) {
    let info = []

    const infoObject = (name, o) => {
      let s = ''
      if (o.blocked) {
        s += 'B'
      }
      else if (o.sightBlocked) {
        s += 'S'
      }
      else if (o.lightBlocked) {
        s += 'L'
      }
      info.push('[' + name + o.type + s + ']')
    }

    let at = this._map.at(options.x, options.y, this._map.level)
    if (at.tile) {
      infoObject('t', at.tile)
    }
    if (!_.isEmpty(at.items)) {
      for (let i of at.items) {
        infoObject('i', i)
      }
    }
    if (!_.isEmpty(at.npcs)) {
      for (let i of at.npcs) {
        infoObject('n', i)
      }
    }

    this._mouseLocation.text = 'x: ' + options.x + ' y: ' + options.y + ' ' + info.join('')
  }
}

module.exports = {
  PlayScene,
}
