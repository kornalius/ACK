const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/core/state')
const { ActMixin } = require('../../mixins/core/act')

const { COMPLETED, FAILED } = require('../../constants')

let Quest = class Quest extends mix(Object).with(EventsManager, StateMixin, ActMixin) {

  constructor () {
    super()

    _.addProp(this, 'duration', 0)
    _.addProp(this, 'status', 0)
    _.addProp(this, 'steps', [], true)

    this.reset()
  }

  get isCompleted () {
    for (let step of this._steps) {
      if (step.isFailed && !step.optional) {
        return false
      }
    }
    return true
  }

  get isFailed () { return this._status === FAILED }

  reset () {
    _.resetProps(this)
  }

  get progress () {
    let c = 0
    let t = 0

    for (let step of this._steps) {
      if (!step.isFailed) {
        c += step.progress
        t++
      }
    }

    return Math.trunc(c / t)
  }

  get rewards () {
    return []
  }

  act (t, delta) {
    super.act(t, delta)
    if (this._duration > 0) {
      this.duration -= delta
      if (this._duration <= 0) {
        this.fail()
      }
    }
  }

  fail () {
    this._status = FAILED
  }

}

let QuestStep = class QuestStep extends mix(Object).with(EventsManager, StateMixin, ActMixin) {

  constructor () {
    super()

    _.addProp(this, 'duration', 0)
    _.addProp(this, 'status', 0)
    _.addProp(this, 'optional', false)

    this.reset()
  }

  get isCompleted () { return this.progress === 100 }
  get isFailed () { return this._status === FAILED }

  reset () {
    _.resetProps(this)
  }

  get progress () {
    return 0
  }

  act (t, delta) {
    super.act(t, delta)
    if (this._duration > 0) {
      this.duration -= delta
      if (this._duration <= 0) {
        this.fail()
      }
    }
  }

  fail () {
    this._status = FAILED
  }

}

module.exports = {
  Quest,
  QuestStep,
}
