class Scrollbox extends PIXI.Container {

  constructor () {
    super(...arguments)

    this._width = 0
    this._height = 0
    this.video_scale = 1
    this.isInContainer = false
    this.isLeftDown = false
    this.mousePosition = new PIXI.Point()
    this.content = new PIXI.Container()
    this.constraints = 'all'

    this.content.interactive = true
    this.addChild(this.content)

    this.content.on('mouseover', () => { this.isInContainer = true })
    this.content.on('mousemove', e => {
      const oldMousePosition = _.clone(this.mousePosition)
      this.mousePosition.set(Math.trunc(e.data.global.x / this.video_scale), Math.trunc(e.data.global.y / this.video_scale))
      if (this.isLeftDown) {
        if (this.constraints === 'x' || this.constraints === 'all') {
          this.content.x += this.mousePosition.x - oldMousePosition.x
        }
        if (this.constraints === 'y' || this.constraints === 'all') {
          this.content.y += this.mousePosition.y - oldMousePosition.y
        }
        this.normalizeContentPosition()
        this.emit('scroll')
      }
    })
    this.content.on('mousedown', () => { this.isLeftDown = true })
    this.content.on('mouseup', () => { this.isLeftDown = false })
    this.content.on('mouseout', () => { this.isInContainer = false })
    this.content.on('mouseupoutside', () => { this.isLeftDown = false })
  }

  get width () {
    return this._width
  }

  get height () {
    return this._height
  }

  normalizeContentPosition () {
    const leftBorder = this.width / 2 - this.content.width
    if (this.content.x < leftBorder) {
      this.content.x = leftBorder
    }
    else if (this.content.x > this.width / 2) {
      this.content.x = this.width / 2
    }
    const topBorder = this.height / 2 - this.content.height
    if (this.content.y < topBorder) {
      this.content.y = topBorder
    }
    else if (this.content.y > this.height / 2) {
      this.content.y = this.height / 2
    }
  }

  onResize () {
  }

  resize (width, height) {
    this._width = width
    this._height = height
    this.onResize()
  }

}

module.exports = {
  Scrollbox,
}
