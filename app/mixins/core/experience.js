const ExperienceMixin = Mixin(superclass => class ExperienceMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'level', 1)
    _.addProp(this, 'xp', 0)
  }

  get hasExperience () { return true }

  get nextLevelExperience () { return this._level * this._level * 10 }

  giveExperience (points = 1) {
    let levelsGained = 0

    while (points > 0) {
      let n = this.nextLevelExperience
      if (this._xp + points >= n) {
        let usedPoints = n - this._xp
        points -= usedPoints

        this._xp += usedPoints
        this.emit('experience', { value: usedPoints })

        this._level++
        levelsGained++
      }
      else {
        this._xp += points
        this.emit('experience', { value: points })
        points = 0
      }
    }
    if (levelsGained > 0) {
      this.emit('gain-level', { value: levelsGained, newLevel: this._level, oldLevel: this._level - levelsGained })
    }
  }

})

module.exports = {
  ExperienceMixin,
}
