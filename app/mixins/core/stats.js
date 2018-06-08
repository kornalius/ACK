const StatsMixin = Mixin(superclass => class StatsMixin extends superclass {

  constructor () {
    super()

    this.clearStats()
  }

  clearStats () {
    this._stats = {}
  }

  hasStat (name) {
    return !_.isUndefined(this._stats[name])
  }

  addStat (name, value) {
    if (!this.hasStat(name)) {
      this._stats[name] = value
      this.emit('stat-add', { name, value })
    }
    return this
  }

  removeStat (name) {
    if (this.hasStat(name)) {
      delete this._stats[name]
      this.emit('stat-remove', { name })
    }
    return this
  }

  setStat (name, value) {
    if (this.hasStat(name) && !value) {
      this.removeStat(name)
      return true
    }
    else if (!this.hasStat(name) && value) {
      this.addStat(name, value)
      return true
    }
    return false
  }

  incStat (name, by = 1) {
    if (this.hasStat(name)) {
      this._stats[name] += by
    }
    return this._stats[name]
  }

})

module.exports = {
  StatsMixin,
}
