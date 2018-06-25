const TextSpriteMixin = Mixin(superclass => class TextSpriteMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'sprite', undefined, true, 'resetSprite')
  }

  get isSprite () { return true }
  get isTextSprite () { return true }

  resetSprite () {
    this.destroySprite()
  }

  drawText (text, font) {
    let cw = font.width
    let ch = font.height
    let fnt_sz = font.char_size
    let fnt_mem = font.array

    let lines = text.split('\n')

    let width = 0
    let height = lines.length * ch
    for (let line of lines) {
      width = Math.max(width, line.length * cw)
    }

    width = Math.max(1, width)
    height = Math.max(1, height)

    let c = new PIXI.CanvasRenderTarget(width, height)
    let ctx = c.canvas.getContext('2d', { alpha: true, antialias: false })

    let tex = PIXI.Texture.fromCanvas(c.canvas, PIXI.SCALE_MODES.NEAREST)
    tex.scaleMode = PIXI.SCALE_MODES.NEAREST

    let data = ctx.getImageData(0, 0, width, height)
    let pixels = new Uint32Array(data.data.buffer)

    const drawChar = (c, px, py) => {
      let ptr = c * fnt_sz
      for (let by = 0; by < ch; by++) {
        let pi = (py + by) * width + px
        for (let bx = 0; bx < cw; bx++) {
          pixels[pi++] = fnt_mem[ptr++] ? 0xffffffff : 0
        }
      }
    }

    for (let y = 0; y < lines.length; y++) {
      let py = y * ch
      let line = lines[y]

      for (let x = 0; x < line.length; x++) {
        drawChar(line.charCodeAt(x), x * cw, py)
      }
    }

    ctx.putImageData(data, 0, 0)

    tex.update()

    return tex
  }

  updateSprite (text, font) {
    let sprite = this._sprite

    let tex = this.drawText(text, font)

    if (sprite) {
      sprite.texture = tex
    }
    else {
      sprite = new PIXI.Sprite(tex)
    }

    return sprite
  }

  createSprite (text, font) {
    let sprite = this.updateSprite(text, font)
    sprite._parent = this
    this._sprite = sprite
    return sprite
  }

  destroySprite () {
    if (this._sprite) {
      if (this._sprite.parent) {
        this._sprite.parent.removeChild(this._sprite)
      }
      this._sprite.destroy({ children: true })
      this._sprite = undefined
    }
  }

  destroy () {
    if (super.destroy) {
      super.destroy()
    }

    this.destroySprite()
  }

})

module.exports = {
  TextSpriteMixin,
}
