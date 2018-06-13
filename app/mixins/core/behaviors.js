const BehaviorsMixin = Mixin(superclass => class BehaviorsMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'behaviors', [], true)
  }

  get hasBehaviors () { return true }

  addBehavior (behavior) {
    this._behaviors.push(behavior)
    this.emit('add-behavior', { behavior })
  }

  removeBehavior (behavior) {
    _.pull(this._behaviors, behavior)
    this.emit('remove-behavior', { behavior })
  }

  executeBehaviors () {
    for (let behavior of this._behaviors) {
      let success = behavior.act(this)
      if (success) {
        return true
      }
    }
    return false
  }

})

module.exports = {
  BehaviorsMixin,
}
