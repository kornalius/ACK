const ResizeMixin = Mixin(superclass => class ResizeMixin extends superclass {

  constructor () {
    super(...arguments)

    this._resizing = undefined
    this.resizeOnTop = false

    this._resizeMousemove = e => {
      let r = this._resizing
      if (r) {
        if (r.el._resizeState && this._canResizeTo(e)) {
          this._resizeTo(e)
          r.prevX = e.clientX
          r.prevY = e.clientY
        }
      }
    }
  }

  _canResizeTo (e) {
    let r = this._resizing
    if (r) {
      let el = r.el
      let x = e.clientX
      let y = e.clientY
      let px = r.prevX
      let py = r.prevY
      let s = el._resizeState
      let h = s.left || s.right
      let v = s.top || s.bottom
      let mh = x < px || x > px
      let mv = y < py || y > py
      return mh && h || mv && v
    }
    return false
  }

  _resizeTo (e) {
    let r = this._resizing
    if (r) {
      let el = r.el
      let s = el._resizeState

      let rect = r.rect

      if (s.left || s.right) {
        let x = e.clientX
        let ox = r.offsetX

        if (el.flex || el.grow || el.shrink) {
          el.__flex = true
          el.flex = undefined
          el.grow = undefined
          el.shrink = undefined
        }

        if (s.left) {
          let newLeft = Math.trunc(x - ox)
          let newWidth = Math.trunc(rect.right - newLeft)
          if (el.isAllowedWidth(newWidth)) {
            if (!el.__flex && !_.isUndefined(el.left)) {
              el.left = newLeft
            }
            el.width = newWidth
          }
        }
        else if (s.right) {
          let newRight = Math.trunc(x + ox)
          let newWidth = Math.trunc(newRight - rect.left)
          if (el.isAllowedWidth(newWidth)) {
            el.width = newWidth
          }
        }
      }

      if (s.top || s.bottom) {
        let y = e.clientY
        let oy = r.offsetY

        if (el.flex || el.grow || el.shrink) {
          el.__flex = true
          el.flex = undefined
          el.grow = undefined
          el.shrink = undefined
        }

        if (s.top) {
          let newTop = Math.trunc(y - oy)
          let newHeight = Math.trunc(rect.bottom - newTop)
          if (el.isAllowedHeight(newHeight)) {
            if (!el.__flex && !_.isUndefined(el.top)) {
              el.top = newTop
            }
            el.height = newHeight
          }
        }
        else if (s.bottom) {
          let newBottom = Math.trunc(y + oy)
          let newHeight = Math.trunc(newBottom - rect.top)
          if (el.isAllowedHeight(newHeight)) {
            el.height = newHeight
          }
        }
      }
    }
  }

  get resizing () { return _.get(this, '_resizing.el') }

  startResize (el, prevX, prevY, offsetX, offsetY) {
    if (!this._resizing) {
      this._resizing = {
        el,
        prevX,
        prevY,
        offsetX,
        offsetY,
        rect: el.getBoundingClientRect(),
        oldZIndex: el.style.zIndex,
      }

      if (this.resizeOnTop) {
        el.style.zIndex = 1000
      }

      ACK.disableSelectables()

      window.addEventListener('mousemove', this._resizeMousemove, true)
      this._resizing.el.emit('resize-start')
    }
    return this
  }

  endResize () {
    let d = this._resizing
    if (d) {
      let el = d.el
      el.style.zIndex = d.oldZIndex

      this._resizing = undefined

      ACK.enableSelectables()

      window.removeEventListener('mousemove', this._resizeMousemove, true)
      el.emit('resize-end')
    }
    return this
  }

})

module.exports = {
  ResizeMixin,
}
