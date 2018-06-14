const OptionsMixin = Mixin(superclass => class OptionsMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'validOptions', [], true)
    _.addProp(this, 'options', [], true)
  }

  get hasOptions () { return true }

  addOption (name) {
    if (_.isArray(name)) {
      for (let n of name) {
        this.addOption(n)
      }
    }
    else if (!this.hasOption(name) && this.isValidOption(name)) {
      this._options.push(name)
      this.emit('option-add', { name })
    }
  }

  removeOption (name) {
    if (_.isArray(name)) {
      for (let n of name) {
        this.removeOption(n)
      }
    }
    else if (this.hasOption(name)) {
      _.pull(this._options, name)
      this.emit('option-remove', { name })
    }
  }

  setOption (name, value) {
    if (this.hasOption(name) && !value) {
      this.removeOption(name)
      return true
    }
    else if (!this.hasOption(name) && value) {
      this.addOption(name)
      return true
    }
    return false
  }

  toggleOption (name) {
    this.setOption(name, !this.hasOption(name))
  }

  isValidOption (name) {
    return _.includes(this._validOptions, name)
  }

  addValidOption (name) {
    if (_.isArray(name)) {
      for (let n of name) {
        this.addValidOption(n)
      }
    }
    else if (!this.isValidOption(name)) {
      this._validOptions.push(name)
    }
  }

  removeValidOption (name) {
    if (_.isArray(name)) {
      for (let n of name) {
        this.removeValidOption(n)
      }
    }
    else if (this.isValidOption(name)) {
      _.pull(this._validOptions, name)
    }
  }

  hasOption (name) {
    return this.isValidOption(name) && _.includes(this._options, name)
  }

})

module.exports = {
  OptionsMixin,
}
