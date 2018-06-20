const faker = require('faker')
faker.locale = 'en'

const JobMixin = Mixin(superclass => class JobMixin extends superclass {

  get hasJob () { return true }

  reset () {
    super.reset()

    this._jobArea = undefined
    this._jobType = undefined
    this._jobTitle = undefined
  }

  get jobArea () {
    if (!this._jobArea) {
      this._jobArea = faker.name.jobArea()
    }
    return this._jobArea
  }

  get jobType () {
    if (!this._jobType) {
      this._jobType = faker.name.jobType()
    }
    return this._jobType
  }

  get jobTitle () {
    if (!this._jobTitle) {
      this._jobTitle = faker.name.jobTitle()
    }
    return this._jobTitle
  }

})

module.exports = {
  JobMixin,
}
