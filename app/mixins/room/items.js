const ItemsMixin = Mixin(superclass => class ItemsMixin extends superclass {

  constructor () {
    super(...arguments)

    this._items = []
  }

  get items () { return this._items }

  itemsAt (x, y) {
    return _.filter(this._items, i => i.bounds.contains(x, y))
  }

  hasItemInRoom (item) {
    return !_.isUndefined(_.find(this._items, item))
  }

  addItemToRoom (item) {
    if (!this.hasItemInRoom(item)) {
      this._items.push(item)
      item.room = this
      return true
    }
    return false
  }

  removeItemFromRoom (item) {
    if (this.hasItemInRoom(item)) {
      _.remove(this._items, item)
      item.room = undefined
      return true
    }
    return false
  }

  act (t, delta) {
    super.act(t, delta)

    for (let item of this._items) {
      item.act(t, delta)
    }
  }

})

module.exports = {
  ItemsMixin,
}
