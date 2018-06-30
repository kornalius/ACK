const { ItemObject } = require('../../classes/objects/item-object')
const { WALL } = require('../../constants')

class Wall extends ItemObject {

  constructor () {
    super(...arguments)

    this.color = this.randomColor
  }

  get isWall () { return true }

  get white () { return 0xFFFFFF }
  get grey () { return 0xB6B6AA }
  get pink () { return 0xDBB6AA }
  get blue () { return 0xDBFFFF }
  get purple () { return 0xDBDBFF }
  get green () { return 0xDBFFAA }
  get yellow () { return 0xFFFFAA }
  get red () { return 0xDB4955 }

  get colors () { return [this.white, this.grey, this.pink, this.blue, this.purple, this.green, this.yellow, this.red] }

  get randomColor () { return _.sample(this.colors) }

  get color () { return this._color }
  set color (value) {
    if (value !== this._color) {
      let old = this._color
      this._sprite.tint = value
      this.emit('color-changed', { old, value })
    }
  }

  get name () { return 'Wall' }

  get type () { return WALL }

  get spriteFrame () { return 'wall.png' }

}

module.exports = {
  Wall,
}
