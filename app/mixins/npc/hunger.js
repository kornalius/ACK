const HungerMixin = Mixin(superclass => class HungerMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'fullness', 10)
    _.addProp(this, 'maxFullness', 10)
    _.addProp(this, 'fullnessDepletionRate', 0.001)
  }

  get hasHunger () { return true }

  addHunger () {
    this.modifyFullnessBy(-this._fullnessDepletionRate)
  }

  modifyFullnessBy (points = 1) {
    this.fullness = this._fullness + points
    if (this._fullness <= 0) {
      this.kill('You have died of starvation!')
    }
    else if (this._fullness > this._maxFullness) {
      this.kill('You choke and die!')
    }
  }

  toString () {
    var pct = this._maxFullness / 100
    if (this._fullness <= pct * 5) {
      return 'Starving'
    }
    else if (this._fullness <= pct * 25) {
      return 'Hungry'
    }
    else if (this._fullness >= pct * 95) {
      return 'Oversatiated'
    }
    else if (this._fullness >= pct * 75) {
      return 'Full'
    }
    else {
      return 'Not Hungry'
    }
  }

})

module.exports = {
  HungerMixin,
}
