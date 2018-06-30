const { Scene } = require('../../classes/core/scene')
const { Wakeup } = require('../../game/rooms/wakeup')

// const { Editor } = require('../../editor/editor')

class PlayScene extends Scene {

  constructor () {
    super()

    _.addProp(this, 'playContainer', undefined, true)
    _.addProp(this, 'uiContainer', undefined, true)
    _.addProp(this, 'rooms', [], true)
    _.addProp(this, 'room', undefined, true)

    // if (ACK.DEVMODE) {
    //   _.addProp(this, 'editor', undefined, true)
    // }
  }

  start () {
    super.start()

    this._playContainer = this.newContainer([])
    this.addToScene(this._playContainer)

    this._uiContainer = this.newContainer([
      // this.newSprite('healthbar.png', 2, 2, 0),
      // this.newSprite('cpubar.png', 120, 2, 0),
      // this.newSprite('diskbar.png', 238, 2, 0),
    ])
    this._uiContainer.interactive = true
    this.addToScene(this._uiContainer)

    this._room = new Wakeup(this)
    this._rooms.push(this._room)

    this._room.start()
    this._room.enter()

    // if (ACK.DEVMODE) {
    //   this._editor = new Editor(this)
    //   this._editor.start()
    // }
  }

  stop () {
    super.stop()

    if (this._room) {
      this._room.exit()
      this._room.stop()
      this._room = undefined
    }

    this.removeFromScene(this._uiContainer)

    // if (ACK.DEVMODE) {
    //   this._editor.stop()
    //   this._editor = undefined
    // }
  }

  destroy () {
    for (let m of this._rooms) {
      m.destroy()
    }
    this._rooms = []
    this._room = undefined
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

      info.push('[' + name + o.type + s + ']')
    }

    let at = this._room.at(options.x, options.y)
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

    this._editor.mouseLocation.text = 'x: ' + options.x + ' y: ' + options.y + ' ' + info.join('')
  }
}

module.exports = {
  PlayScene,
}
