const ItemsMixin = Mixin(superclass => class ItemsMixin extends superclass {

  get items () { return this._items }

  reset () {
    super.reset()

    this._items = []
  }

  itemsAt (x, y, z) {
    return _.filter(this._items, i => i.x === x && i.y === y && i.z === z)
  }

  itemsAround (centerX, centerY, centerZ) {
    let items = _.map(this.around(centerX, centerY, centerZ), 'items')
    return _.flatten(_.filter(items, a => !_.isEmpty(a)))
  }

  itemsInLevel (z) {
    return _.filter(this._items, { z })
  }

  itemsInRoom (idx, z) {
    let r = this.roomBounds(idx, z)
    return _.filter(this._items, i => i.z === z && r.contains(i.x, i.y))
  }

  itemsInCorridor (idx, z) {
    let r = this.corridorBounds(idx, z)
    return _.filter(this._items, i => i.z === z && r.contains(i.x, i.y))
  }

  addItemAtRandomPosition (item, z, bounds) {
    let p = this.getRandomFloorPosition(z, bounds)
    if (p) {
      return this.addItemAt(item, p.x, p.y, z)
    }
    return false
  }

  addItemAt (item, x = item.x, y = item.y, z = item.z) {
    if (!item.isAt(x, y, z, this)) {
      this._items.push(item)
      item.moveTo(x, y, z, this)
      return true
    }
    return false
  }

  removeItemAt (item, x = item.x, y = item.y, z = item.z) {
    if (item.isAt(x, y, z, this)) {
      _.remove(this._items, item)
      item.map = undefined
      return true
    }
    return false
  }

  act (t, delta) {
    super.act(t, delta)

    for (let i of this._items) {
      i.act(t, delta)
    }
  }

})

module.exports = {
  ItemsMixin,
}
