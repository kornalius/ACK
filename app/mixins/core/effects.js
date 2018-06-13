const EffectsMixin = Mixin(superclass => class EffectsMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'effects', [], true)
  }

  get hasEffects () { return true }

  get modifiers () {
    let mods = {}
    for (let effect of this._effects) {
      if (effect.isRunning) {
        _.extend(mods, effect.modifiers || {})
      }
    }
    return mods
  }

  addEffect (effect) {
    this._effects.push(effect)
    this.emit('add-effect', { effect })
  }

  removeEffect (effect) {
    _.pull(this._effects, effect)
    this.emit('remove-effect', { effect })
  }

})

module.exports = {
  EffectsMixin,
}
