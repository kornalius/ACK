const ContainerMixin = Mixin(superclass => class ContainerMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'items', [], true)
    _.addProp(this, 'maxItems', 10)
  }

  get isContainer () { return true }

  hasItem (item) {
    return _.includes(this._items, item)
  }

  canAddItem (item, amount = 1) {
    if (!this.hasItem(item)) {
      return this._items.length + 1 <= this._maxItems
    }
    else if (item.stackable) {
      return true
    }
    return false
  }

  addItem (item, amount = 1) {
    if (this.canAddItem(item, amount)) {
      if (item.container) {
        if (!item.container.removeItem(item)) {
          return false
        }
      }

      if (!this.hasItem(item)) {
        this._items.push(item)
        item.container = this
        if (item.stackable) {
          item.qty = amount
        }
      }
      else if (item.stackable) {
        item.addToStack(amount)
      }

      this.emit('add-item', { item, value: amount })

      return true
    }

    return false
  }

  canRemoveItem (item, amount = 1) {
    if (this.hasItem(item)) {
      return true
    }
    else if (item.stackable) {
      return true
    }
    return false
  }

  removeItem (item, amount = 1) {
    if (this.canAddItem(item, amount)) {
      if (this.equipper) {
        this.unequip(item)
      }

      if (item.stackable && item.qty > 1) {
        item.removeFromStack(amount)
      }
      else {
        _.pull(this._items, item)
      }

      this.emit('remove-item', { item, value: amount })

      return true
    }

    return false
  }

})

module.exports = {
  ContainerMixin,
}
