const LevelsMixin = Mixin(superclass => class LevelsMixin extends superclass {

  get levels () { return this._levels }
  get level () { return this._level }

  get fovs () { return this._fovs }

  reset () {
    super.reset()

    this._fovs = undefined

    this._levels = undefined
    this._level = -1
  }

  hasLevel (level) {
    return level >= 0 && level < this._depth
  }

  start () {
    super.start()

    this._setupLevels()
    this._setupFovs()

    this.gotoLevel(0)
  }

  stop () {
    this._destroyFovs()
    this._destroyLevels()

    super.stop()
  }

  _setupLevels () {
    this._levels = new Array(this._depth)
    this._rooms = new Array(this._depth)
    this._corridors = new Array(this._depth)
    for (let level = 0; level < this._depth; level++) {
      this._levels[level] = new PIXI.Container()
    }
    this._generateLevels()
  }

  _destroyLevels () {
    for (let level = 0; level < this._depth; level++) {
      this._levels[level].destroy({ children: true })
      this._levels[level] = undefined
    }
    this._levels = undefined
    this._rooms = undefined
    this._corridors = undefined
    this._level = -1
  }

  _setupFovs () {
    this._fovs = new Array(this._depth)
    for (let z = 0; z < this._depth; z++) {
      this._fovs[z] = new ACK.ROT.FOV.PreciseShadowcasting((x, y) => !this.sightBlockedAt(x, y, z))
    }
  }

  _destroyFovs () {
    for (let z = 0; z < this._depth; z++) {
      this._fovs[z] = undefined
    }
    this._fovs = undefined
  }

  inLevel (z) {
    let tiles = this.tilesInLevel(z)
    let items = this.itemsInLevel(z)
    let npcs = this.npcsInLevel(z)
    return { tiles, items, npcs, player: this.player.z === z ? this.player : undefined }
  }

  levelDoors (z) {
    let doors = []
    for (let room of this._rooms[z]) {
      doors = _.concat(doors, this.roomDoors(room))
    }
    return doors
  }

  enter (level, x, y) {
    this._level = level

    let c = this.levelContainer(level)
    c.alpha = 0

    return new Promise((resolve, reject) => {
      let value = { alpha: 0.0 }
      new TWEEN.Tween(value)
        .to({ alpha: 1.0 }, 500)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(() => {
          c.alpha = value.alpha
          ACK.update()
        })
        .onComplete(() => {
          resolve()
        })
        .start()

      this.emit('enter-level', { level })
    })
  }

  exit (level) {
    let c = this.levelContainer(level)

    return new Promise((resolve, reject) => {
      let value = { alpha: 1.0 }
      new TWEEN.Tween(value)
        .to({ alpha: 0.0 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          if (c) {
            c.alpha = value.alpha
            ACK.update()
          }
        })
        .onComplete(() => {
          resolve()
        })
        .start()

      this.emit('exit-level', { level })
    })
  }

  async gotoLevel (level, x, y) {
    if (this._level !== level) {
      ACK.pauseInput = true
      await this.exit(this._level)
      await this.enter(level, x, y)
      ACK.pauseInput = false
    }
  }

  levelContainer (level = this._level) {
    return this._levels[level]
  }

})

module.exports = {
  LevelsMixin,
}
