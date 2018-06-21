const faker = require('faker')

const IdentityMixin = Mixin(superclass => class IdentityMixin extends superclass {

  get hasIdentity () { return true }

  reset () {
    super.reset()

    this._firstName = undefined
    this._lastName = undefined
    this._sex = undefined
    this._age = undefined
    this._color = undefined
    this._ethnicity = undefined
    this._eyes = undefined
    this._hair = undefined
    this._build = undefined
    this._isStrong = false
    this._height = undefined
    this._isTall = false
    this._childhoodWealth = undefined
    this._wealth = undefined
    this._isWealthy = false
    this._interests = undefined
    this._moods = undefined
    this._userName = undefined
    this._email = undefined
    this._intelligence = undefined
    this._traits = undefined
  }

  get sex () {
    if (!this._sex) {
      this._sex = _.random([0, 1])
    }
    return this._sex
  }

  get isMale () { return this._sex === 'M' }
  get isFemale () { return this._sex === 'F' }

  get firstName () {
    if (!this._firstName) {
      this._firstName = faker.name.firstName(this.sex)
    }
    return this._firstName
  }

  get lastName () {
    if (!this._lastName) {
      this._lastName = faker.name.lastName(this.sex)
    }
    return this._lastName
  }

  get name () { return this.prefix + this.firstName + ' ' + this.lastName }

  get isChild () { return this.age < 18 }
  get isAdult () { return this.age >= 18 }

  get isYoungAdult () { return this.age >= 18 && this.age <= 29 }
  get isMiddleAgedAdult () { return this.age >= 30 && this.age <= 44 }
  get isSeniorAdult () { return this.age >= 45 && this.age <= 64 }
  get isAncientAdult () { return this.age >= 65 }

  get age () {
    if (!this._age) {
      this._age = _.random([5, 99])
    }
    return this._age
  }

  get ethnicity () {
    if (!this._ethnicity) {
      this._ethnicity = _.sample(ACK.words.ethnicities)
    }
    return this._ethnicity
  }

  get color () {
    if (!this._color) {
      this._color = _.sample(ACK.words.skinColors)
    }
    return this._color
  }

  get eyes () {
    if (!this._eyes) {
      this._eyes = ACK.words.adjective(ACK.words.colorAdjectives) + _.sample(ACK.words.eyeColors)
    }
    return this._eyes
  }

  get hair () {
    if (!this._hair) {
      this._hair = ACK.words.adjective(ACK.words.colorAdjectives) + _.sample(ACK.words.hairColors)
    }
    return this._hair
  }

  get build () {
    if (!this._build) {
      let s = _.sample(ACK.words.buildSizes)
      this._build = ACK.words.adverb() + s
      this._isStrong = _.includes(ACK.words.largeSizes, s)
    }
    return this._build
  }

  get isWeak () { return !this._isStrong }
  get isStrong () { return this._isStrong }

  get height () {
    if (!this._height) {
      let h = _.sample(ACK.words.height)
      this._height = ACK.words.adverb() + h
      this._isTall = _.includes(ACK.words.tall, h)
    }
    return this._height
  }

  get isShort () { return !this._isTall }
  get isTall () { return this._isTall }

  get childhoodWealth () {
    if (!this._childhoodWealth) {
      this._childhoodWealth = ACK.words.adverb() + _.sample(ACK.words.wealth)
    }
    return this._childhoodWealth
  }

  get wealth () {
    if (!this._wealth) {
      let w = _.sample(ACK.words.wealth)
      this._wealth = ACK.words.adverb() + w
      this._isWealthy = _.includes(ACK.words.rich, w)
    }
    return this._wealth
  }

  get interests () {
    if (!this._interests) {
      this._interests = []
      for (let i = 0; i < _.random(3); i++) {
        this._interests.push(ACK.words.adverb() + _.sample(_.concat(ACK.words.socialInterests, ACK.words.politicalInterests, ACK.words.workInterests, ACK.words.badInterests)))
      }
    }
    return this._interests
  }

  get motive () {
    if (!this._motive) {
      this._motive = _.sample(ACK.words.motives)
    }
    return this._motive
  }

  get moods () {
    if (!this._moods) {
      if (_.random(100) > 40) {
        this.moods.push(ACK.words.adverb() + _.sample(ACK.words.happyMoods))
      }
      else {
        this.moods.push(ACK.words.adverb() + _.sample(ACK.words.sadMoods))
      }

      if (_.random(100) > 50) {
        if (this.isHappy) {
          this.moods.push(ACK.words.adverb() + _.sample(ACK.words.energeticMoods))
        }
        else {
          this.moods.push(ACK.words.adverb() + _.sample(ACK.words.tiredMoods))
        }
      }

      if (!this.isHappy) {
        if (_.random(100) > 60) {
          this.moods.push(ACK.words.adverb() + _.sample(ACK.words.angryMoods))
          if (_.random(100) > 75) {
            this.moods.push(ACK.words.adverb() + _.sample(ACK.words.dangerousMoods))
          }
        }
      }

      if (_.random(100) > 60) {
        this.moods.push(ACK.words.adverb() + _.sample(ACK.words.calmMoods))
      }
      else {
        this.moods.push(ACK.words.adverb() + _.sample(ACK.words.stressedMoods))
      }

      this._moods = ACK.words.adverb() + _.sample(ACK.words.stateMoods)
    }
    return this._moods
  }

  get isNice () {
    return _.includes(_.flatten(this._moods), ACK.words.happyMoods)
  }

  get isBad () {
    return _.includes(_.flatten(this._moods), ACK.words.happyMoods)
  }

  get isHappy () {
    return _.includes(_.flatten(this._moods), ACK.words.happyMoods)
  }

  get isSad () {
    return this.isAngry || _.includes(_.flatten(this._moods), ACK.words.sadMoods)
  }

  get isAngry () {
    return _.includes(_.flatten(this._moods), ACK.words.angryMoods)
  }

  get userName () {
    if (!this._userName) {
      this._userName = faker.internet.userName(this.firstName, this.lastName)
    }
    return this._userName
  }

  get email () {
    if (!this._email) {
      this._email = faker.internet.email(this.firstName, this.lastName)
    }
    return this._email
  }

  get intelligence () {
    if (!this._intelligence) {
      this._intelligence = _.sample(ACK.words.intelligence)
    }
    return this._intelligence
  }

  get traits () {
    if (!this._traits) {
      this._traits = []
      this._traits.push(ACK.words.adverb() + _.sample(ACK.words.traits(1)))
      this._traits.push(ACK.words.adverb() + _.sample(ACK.words.traits(2)))
      this._traits.push(ACK.words.adverb() + _.sample(ACK.words.traits(3)))
      this._traits.push(ACK.words.adverb() + _.sample(ACK.words.traits(4)))
      this._traits.push(ACK.words.adverb() + _.sample(ACK.words.traits(5)))

      if (_.includes(this.mood, [''])) {
        this._traits.push(ACK.words.adverb() + 'aggresive')
      }

      this._traits.push(ACK.words.adverb() + _.sample(ACK.words.traits(6)))
      this._traits.push(ACK.words.adverb() + _.sample(ACK.words.traits(7)))
    }
    return this._traits
  }

})

module.exports = {
  IdentityMixin,
}
