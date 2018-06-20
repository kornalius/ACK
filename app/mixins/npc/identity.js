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
    this._height = undefined
    this._childhoodWealth = undefined
    this._wealth = undefined
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

  get subjectivePronoun () { return this.isFemale ? 'she' : 'he' }
  get possesivePronoun () { return this.isFemale ? 'her' : 'his' }
  get objectivePronoun () { return this.isFemale ? 'her' : 'him' }
  get reflexivePronoun () { return this.isFemale ? 'herself' : 'himself' }

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

  get prefix () {
    return this.isAdult ? (this.isMale ? 'Mr' : 'Mrs') : ''
  }

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
      this._ethnicity = _.sample(['African', 'Haitian', 'American', 'Canadian', 'Russian', 'Arab', 'Albanian', 'Armenian', 'Bulgarian', 'Dutch', 'French', 'German', 'Chinese', 'Japanese', 'Hungarian', 'Italian', 'Korean', 'Cuban', 'Norwegian', 'Romanian', 'Scottish', 'Slovakian', 'Somalian', 'Turk', 'Vietnamese'])
    }
    return this._ethnicity
  }

  get color () {
    if (!this._color) {
      this._color = _.sample(['Light black', 'Black', 'Deep black', 'Pale white', 'White', 'Light brown', 'Brown', 'Deep brown', 'Yellow'])
    }
    return this._color
  }

  get eyes () {
    if (!this._eyes) {
      this._eyes = _.sample(['Black', 'Grey', 'Blue', 'Light blue', 'Teal', 'Green', 'Light green', 'Brown', 'Amber', 'Hazel', 'Dark blue', 'Dark green'])
    }
    return this._eyes
  }

  get hair () {
    if (!this._hair) {
      this._hair = _.sample(['Brown', 'Grey', 'White', 'Black', 'Orange', 'Auburn', 'Blond', 'Light brown', 'Dark brown', 'Chestnut'])
    }
    return this._hair
  }

  get build () {
    if (!this._build) {
      this._build = _.sample(['Very skinny', 'Skinny', 'Average weight', 'Pudgy', 'Fat', 'Obese', 'Brawny', 'Muscular', 'Lean', 'Weak'])
    }
    return this._build
  }

  get height () {
    if (!this._height) {
      this._height = _.sample(['Stunted', 'Short', 'Average', 'Above average', 'Tall'])
    }
    return this._height
  }

  get childhoodWealth () {
    if (!this._childhoodWealth) {
      this._childhoodWealth = _.sample(['Extremely poor', 'Poor', 'Low income', 'Middle class', 'Upper class', 'Extremely wealthy'])
    }
    return this._childhoodWealth
  }

  get wealth () {
    if (!this._wealth) {
      this._wealth = _.sample(['Extremely poor', 'Poor', 'Low income', 'Middle class', 'Upper class', 'Extremely wealthy'])
    }
    return this._wealth
  }

  get _socialInterests () {
    return ['Flirting', 'Networking', 'People', 'Helping', 'Listening', 'Talking']
  }

  get _politicalInterests () {
    return ['Government', 'Freedom', 'Truth', 'Leading']
  }

  get _workInterests () {
    return ['Crafting', 'Exploring', 'Working', 'Building', 'Learning', 'Exercise']
  }

  get _hobbyInterests () {
    return ['Nature', 'Cities', 'Animals', 'Food', 'Sunshine']
  }

  get _badInterests () {
    return ['Fighting', 'Lying', 'Drinking', 'Stealing', 'Vandalism', 'Storms', 'Slacking']
  }

  get interests () {
    if (!this._interests) {
      this._interests = []
      for (let i = 0; i < _.random(3); i++) {
        this._interests.push(_.sample(_.concat(this._socialInterests, this._politicalInterests, this._workInterests, this._badInterests)))
      }
    }
    return this._interests
  }

  get motive () {
    if (!this._motive) {
      this._motive = _.sample(['Money', 'Love', 'Fate', 'Sickness', 'Glory', 'Revenge'])
    }
    return this._motive
  }

  get _happyMoods () {
    return ['Cheerful', 'Content', 'Ecstatic', 'Happy', 'Joyful', 'Jubilant', 'Pleased', 'Gentle', 'Good', 'Peaceful', 'Sympathetic', 'Thoughtful']
  }

  get _sadMoods () {
    return ['Annoyed', 'Apathetic', 'Ashamed', 'Bittersweet', 'Bored', 'Cynical', 'Depressed', 'Discontent', 'Pessimistic', 'Sad']
  }

  get _angryMoods () {
    return ['Aggravated', 'Angry', 'Cranky', 'Enraged', 'Frustrated', 'Grumpy', 'Infuriated', 'Irritated', 'Mad']
  }

  get _energeticMoods () {
    return ['Energetic', 'Excited', 'High', 'Hyper', 'Intense', 'Lively']
  }

  get _tiredMoods () {
    return ['Drained', 'Exhausted', 'Lazy', 'Lethargic', 'Morose', 'Sleepy']
  }

  get _dangerousMoods () {
    return ['Chaotic', 'Crazy', 'Demented', 'Predatory', 'Psychotic']
  }

  get _calmMoods () {
    return ['Calm', 'Chilled', 'Relaxed']
  }

  get _stressedMoods () {
    return ['Anxious', 'Cautious', 'Defensive', 'Paranoid', 'Scared', 'Stressed', 'Shocked']
  }

  get _stateMoods () {
    return ['Cold', 'Confused', 'Curious', 'Delusional', 'Dorky', 'Empathetic', 'Envious', 'Fearful', 'Impatient', 'Indifferent', 'Melancholic', 'Mellow', 'Passionate', 'Rebellious', 'Rejected', 'Strange', 'Weird']
  }

  get moods () {
    if (!this._moods) {
      if (_.random(100) > 40) {
        this.moods.push(_.sample(this._happyMoods))
      }
      else {
        this.moods.push(_.sample(this._sadMoods))
      }

      if (_.random(100) > 50) {
        if (this.isHappy) {
          this.moods.push(_.sample(this._energeticMoods))
        }
        else {
          this.moods.push(_.sample(this._tiredMoods))
        }
      }

      if (!this.isHappy) {
        if (_.random(100) > 60) {
          this.moods.push(_.sample(this._angryMoods))
          if (_.random(100) > 75) {
            this.moods.push(_.sample(this._dangerousMoods))
          }
        }
      }

      if (_.random(100) > 60) {
        this.moods.push(_.sample(this._calmMoods))
      }
      else {
        this.moods.push(_.sample(this._stressedMoods))
      }

      this._moods = _.sample(this._stateMoods)
    }
    return this._moods
  }

  get isNice () {
    return _.includes(_.flatten(this._moods), this._happyMoods)
  }

  get isBad () {
    return _.includes(_.flatten(this._moods), this._happyMoods)
  }

  get isHappy () {
    return _.includes(_.flatten(this._moods), this._happyMoods)
  }

  get isSad () {
    return this.isAngry || _.includes(_.flatten(this._moods), this._sadMoods)
  }

  get isAngry () {
    return _.includes(_.flatten(this._moods), this._angryMoods)
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
      this._intelligence = _.sample(['Smart', 'Dumb', 'Stupid', 'Intelligent', 'Average', 'Slow', 'Fast', 'Bright', 'Sharp', 'Intellectual', 'Clever', 'Ignorant', 'Simple', 'Idiot', 'Thick'])
    }
    return this._intelligence
  }

  get traits () {
    if (!this._traits) {
      this._traits = []
      this._traits.push(_.sample(['Curious', 'Studious', 'Mysterious', 'Rough', 'Silent', 'Skeptic', 'Immature', 'Materialistic', 'Dreamy', 'Creative', 'Romantic', 'Frivolous', 'Aloof']))
      this._traits.push(_.sample(['Introvert', 'Extrovert']))
      this._traits.push(_.sample(['Leader', 'Follower']))
      this._traits.push(_.sample(['Emotional', 'Emotionless']))

      this._traits.push(_.sample(['Humorous', 'Grim']))

      if (_.includes(this.mood, [''])) {
        this._traits.push('Aggresive')
      }

      this._traits.push(_.sample(['Selfsufficent', 'Dependent']))
      this._traits.push(_.sample(['Logical', 'Illogical']))
    }
    return this._traits
  }

})

module.exports = {
  IdentityMixin,
}
