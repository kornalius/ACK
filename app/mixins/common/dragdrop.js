const DragDropMixin = Mixin(superclass => class DragDropMixin extends superclass {

  constructor () {
    super(...arguments)

    this._dragging = undefined

    this._dragMousemove = e => {
      let d = this._dragging
      if (d) {
        let el = d.el
        if (d.moveX) {
          el.left = e.clientX - d.offsetX
        }
        if (d.moveY) {
          el.top = e.clientY - d.offsetY
        }
      }
    }
  }

  get dragging () { return _.get(this, '_dragging.el') }

  startDrag (el, offsetX, offsetY, moveX, moveY) {
    if (!this._dragging) {
      this._dragging = {
        el,
        offsetX,
        offsetY,
        moveX,
        moveY,
        oldZIndex: el.style.zIndex,
      }

      el.style.zIndex = 1000

      ACK.disableSelectables()

      window.addEventListener('mousemove', this._dragMousemove, true)

      el.emit('drag-start')
    }
    return this
  }

  endDrag () {
    let d = this._dragging
    if (d) {
      let el = d.el
      el.style.zIndex = d.oldZIndex

      this._dragging = undefined

      ACK.enableSelectables()

      window.removeEventListener('mousemove', this._dragMousemove, true)
      el.emit('drag-end')
    }
    return this
  }

  canDrop (target) {
    let d = this._dragging
    return d && target && target.acceptDrop(d.el)
  }

  drop (target) {
    let d = this._dragging
    if (d) {
      if (this.canDrop(target)) {
        target.drop(d.el)
      }
    }
    return this
  }

})

module.exports = {
  DragDropMixin,
}
