const SelectionMixin = Mixin(superclass => class SelectionMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'selection', [])
  }

  get isSelection () { return true }

  get bounds () {
    let bounds = new window.Rect()
    _.each(this._selection, s => {
      if (s.bounds) {
        bounds.union(s.bounds)
      }
    })
    return bounds
  }

  get sameSelectionClass () {
    let c
    for (let s of this._selection) {
      let p = Object.getPrototypeOf(s)
      if (!c) {
        c = p
      }
      else if (c !== p) {
        return false
      }
    }
    return true
  }

  get selectionClass () {
    return Object.getPrototypeOf(_.first(this._selection))
  }

  clearSelection () {
    this._selection = []
  }

  canAddSelection (value) {
    let c = this.selectionClass
    return value && !c || value instanceof c
  }

  addSelection (value) {
    if (_.isArray(value)) {
      _.each(value, v => this.addSelection(v))
    }
    else if (this.canAddSelection(value)) {
      this._selection.push(value)
    }
  }

  canRemoveSelection (value) {
    return true
  }

  removeSelection (value) {
    if (_.isArray(value)) {
      _.each(value, v => this.addSelection(v))
    }
    else if (this.canRemoveSelection(value)) {
      _.pull(this._selection, value)
    }
  }

  select (value, single = false) {
    if (single) {
      this.clearSelection()
    }
    return this.addSelection(value)
  }

  unselect (value) {
    return this.removeSelection(value)
  }

  unselectAll () {
    return this.clearSelection()
  }

})

module.exports = {
  SelectionMixin,
}
