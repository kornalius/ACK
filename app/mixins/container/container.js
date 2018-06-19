const ContainerMixin = Mixin(superclass => class ContainerMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'slots', [], true)
    _.addProp(this, 'items', [], true)
  }

  get isContainer () { return true }

  addItemSlot (type) {
    this._slots.push(type)
    this._items.push(undefined)
  }

  removeItemSlot (type) {
    let i = _.first(this.slotsIndex(type))
    if (i) {
      this._slots.splice(i, 1)
      this._items.splice(i, 1)
    }
  }

  emptySlotIndex (type) {
    for (let i of this.slotsIndex(type)) {
      if (this._items[i] === undefined) {
        return i
      }
    }
    return -1
  }

  slotsIndex (type) {
    return _.filter(this._slots, type)
  }

  slotTypeFor (item) {
    let i = this.itemIndex(item)
    if (i !== -1) {
      return this._slots[i]
    }
    return 0
  }

  hasItem (item) {
    if (_.isNumber(item)) {
      return !_.isUndefined(_.find(this._items, { type: item }))
    }
    return _.includes(this._items, item)
  }

  itemIndex (item) {
    if (_.isNumber(item)) {
      return _.indexOf(this._items, { type: item })
    }
    return _.indexOf(this._items, item)
  }

  findItem (item) {
    let i = this.itemIndex(item)
    if (i !== -1) {
      return this._items[i]
    }
    return undefined
  }

  canAddItem (item, amount = 1) {
    if (!this.hasItem(item)) {
      return this._items.length + 1 <= this._maxItems
    }
    else if (item.isStackable) {
      return true
    }
    return false
  }

  addItem (item, amount = 1) {
    if (this.canAddItem(item, amount)) {
      if (item.container && !item.container.removeItem(item)) {
        return false
      }

      if (!this.hasItem(item)) {
        let i = this.emptySlotIndex(item.slotType)
        if (i !== -1) {
          this._items[i] = item
          item._container = this
        }
        if (item.isStackable) {
          item.qty = amount
        }
      }
      else if (item.isStackable) {
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
    else if (item.isStackable) {
      return true
    }
    return false
  }

  removeItem (item, amount = 1) {
    if (this.canRemoveItem(item, amount)) {
      if (this.isEquipper) {
        this.unequip(item)
      }

      if (item.isStackable && item.qty > 1) {
        item.removeFromStack(amount)
      }
      else {
        let i = this.itemIndex(item)
        if (i !== -1) {
          this._items[i] = undefined
        }
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
