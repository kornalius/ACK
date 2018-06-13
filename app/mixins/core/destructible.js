const DestructibleMixin = Mixin(superclass => class DestructibleMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'hp', 10)
    _.addProp(this, 'maxHp', 10)
  }

  get isDestructible () { return true }

  takeDamage (attacker, damage) {
    this.hp -= damage
    if (this._hp <= 0) {
      this.kill()
    }
  }

  increaseMaxHp (amount = 1) {
    this.maxHp += amount
    this.hp += amount
  }

})

module.exports = {
  DestructibleMixin,
}
