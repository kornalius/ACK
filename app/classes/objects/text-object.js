const { EventsManager } = require('../../mixins/common/events')
const { PositionMixin } = require('../../mixins/core/position')
const { TextSpriteMixin } = require('../../mixins/core/text-sprite')

class TextObject extends mix(Object).with(EventsManager, PositionMixin, TextSpriteMixin) {

  constructor (x, y, z, map, text, font, color = 0xffffffff) {
    super()

    this.reset()

    this._text = text
    this._font = font
    this._color = color

    this.createSprite(text, font, color)

    this.moveTo(x, y, z, map, false)
  }

  get text () { return this._text }
  set text (value) {
    if (value !== this._text) {
      let old = this._text
      this._text = value
      this.updateSprite(this._text, this._font, this._color)
      this.emit('text-change', { value, old })
    }
  }

  get font () { return this._font }
  set font (value) {
    if (value !== this._font) {
      let old = this._font
      this._font = value
      this.updateSprite(this._text, this._font, this._color)
      this.emit('font-changed', { value, old })
    }
  }

  get color () { return this._color }
  set color (value) {
    if (value !== this._color) {
      let old = this._color
      this._color = value
      this.updateSprite(this._text, this._color, this._color)
      this.emit('color-changed', { value, old })
    }
  }

  reset () {
    super.reset()

    this._text = undefined
    this._font = undefined
    this._color = 0xffffff
  }

}

module.exports = {
  TextObject,
}
