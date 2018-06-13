const ItemsHolderMixin = Mixin(superclass => class ItemsHolderMixin extends superclass {

  get isItemsHolder () { return true }

  pickupItem (item) {
    if (this.isContainer) {
      let mapItems = this._map.getItemsAt(this._x, this._y, this._z)
      if (_.includes(mapItems, item)) {
      }
      if (this.addItem(item)) {
        item.removeFromStack()
        this._map.removeItemAt(item, this._x, this._y, this._z)
        return 1
      }
    }
    return 0
  }

  pickupItems (items) {
    let added = 0
    for (let item of items) {
      added += this.pickupItem(item)
    }
    return added === items.length
  }

  dropItem (item) {
    if (this.isEquipper) {
      this.unequip(item)
    }

    if (this._map) {
      this._map.addItem(item, this._x, this._y, this._z)
    }

    this.removeItem(item, item.isStackable ? item.qty : 0)
  }

  dropItems (items) {
    for (let item of items) {
      this.dropItem(item)
    }
    return true
  }

})

module.exports = {
  ItemsHolderMixin,
}
