const StatsMixin = Mixin(superclass => class StatsMixin extends superclass {

  constructor () {
    super()

    this.clearStats()
  }

  clearStats () {
    this._stats = {}
    this.emit('clear-stats')
    return this
  }

  hasStat (name) {
    return !_.isUndefined(this._stats[name])
  }

  addStat (name, value) {
    if (!this.hasStat(name)) {
      this._stats[name] = value
      this.emit('add-stat', { name })
      this.emit('set-stat', { name, value })
    }
    return this
  }

  removeStat (name) {
    if (this.hasStat(name)) {
      delete this._stats[name]
      this.emit('remove-stat', { name })
    }
    return this
  }

  stat (name, value) {
    if (this.hasStat(name)) {
      if (!_.isUndefined(value)) {
        this._stats[name] = value
        this.emit('set-stat', { name, value })
      }
      return this._stats[name]
    }
    else if (!_.isUndefined(value)) {
      return this.addStat(name, value)
    }
    return undefined
  }

  incStat (name, by = 1) {
    return this.stat(name, this.stat(name) + by)
  }

})

module.exports = {
  StatsMixin,
}
