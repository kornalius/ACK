const StatsMixin = Mixin(superclass => class StatsMixin extends superclass {

  constructor () {
    super()

    this.clearStats()
  }

  clearStats () {
    for (let name in this._stats) {
      delete this[name]
    }
    this._stats = {}
    this.emit('clear-stats')
    return this
  }

  hasStat (name) {
    return !_.isUndefined(this._stats[name])
  }

  addStat (name) {
    if (!this.hasStat(name)) {
      Object.defineProperty(this, name, {
        enumerable: true,
        get: () => this._stats[name],
        set: value => {
          if (value !== this._stats[name]) {
            let old = this._stats[name]
            this._stats[name] = value
            this.emit(name + '-change', { newValue: value, oldValue: old })
          }
        },
      })

      this._stats[name] = null
      this.emit('add-stat', { name })
    }
  }

  removeStat (name) {
    if (this.hasStat(name)) {
      delete this[name]
      delete this._stats[name]
      this.emit('remove-stat', { name })
    }
  }

  stat (name, value) {
    if (!_.isUndefined(value)) {
      if (!this.hasStat(name)) {
        this.addStat(name)
      }
      this[name] = value
    }
    return this._stats[name]
  }

  incStat (name, by = 1) {
    this[name] += by
    return this._stats[name]
  }

})

module.exports = {
  StatsMixin,
}
