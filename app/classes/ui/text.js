const { EventsManager } = require('../../mixins/common/events')
const { TextSpriteMixin } = require('../../mixins/core/text-sprite')

class Text extends mix(Object).with(EventsManager, TextSpriteMixin) {

  constructor (text = '', font = ACK.font('normal'), color = 0xffffffff) {
    super()

    this._text = text
    this._font = font
    this._color = 0xffffffff

    this.createSprite(text, font)

    this.color = color
  }

  get text () { return this._text }
  set text (value) {
    if (value !== this._text) {
      let old = this._text
      this._text = value
      this.updateSprite(this._text, this._font)
      this._sprite.tint = this._color
      this.emit('text-change', { value, old })
    }
  }

  get font () { return this._font }
  set font (value) {
    if (value !== this._font) {
      let old = this._font
      this._font = value
      this.updateSprite(this._text, this._font)
      this._sprite.tint = this._color
      this.emit('font-changed', { value, old })
    }
  }

  get color () { return this._color }
  set color (value) {
    if (value !== this._color) {
      let old = this._color
      this._color = value
      this._sprite.tint = value
      this.emit('color-changed', { value, old })
    }
  }

}

module.exports = {
  Text,
}
