const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/common/state')

class Action extends mix(Object).with(EventsManager, StateMixin) {

  constructor (options = {}) {
    super()

    this.reset()

    this._options = options
  }

  get options () { return this._options }
  get parent () { return _.get(this._options, 'parent') }
  get instance () { return _.get(this._options, 'instance') }
  get name () { return _.get(this._options, 'name') }
  get auto () { return _.get(this._options, 'auto', false) }
  get update () { return _.get(this._options, 'update', () => {}) }
  get done () { return _.get(this._options, 'done', () => {}) }

  get startData () {
    let value = _.get(this._options, 'start')
    if (_.isNumber(value)) {
      value = { value }
    }
    else if (_.isUndefined(value)) {
      value = {}
    }
    return value
  }

  get endData () {
    let value = _.get(this._options, 'end')
    if (_.isNumber(value)) {
      value = { value }
    }
    else if (_.isUndefined(value)) {
      value = {}
    }
    return value
  }

  get ease () {
    let ease = _.camelCase(_.get(this._options, 'ease', 'linear'))
    let type = 'In'
    if (ease.endsWith('InOut')) {
      type = 'InOut'
      ease = ease.substr(0, ease.length - 5)
    }
    else if (ease.endsWith('Out')) {
      type = 'Out'
      ease = ease.substr(0, ease.length - 3)
    }
    if (ease === 'linear') {
      type = 'None'
    }

    return TWEEN.Easing[_.upperFirst(ease)][type]
  }

  get delay () { return _.get(this._options, 'delay', 0) }
  get duration () { return _.get(this._options, 'duration', 1000) }
  get repeat () { return _.get(this._options, 'repeat', 0) }
  get reverse () { return _.get(this._options, 'reverse', false) }

  reset () {
    this._options = {}
    this._tween = undefined
  }

  _buildTween () {
    let data = _.clone(this.startData)
    let end = _.clone(this.endData)

    this._tween = new TWEEN.Tween(data)
      .to(end, this.duration)
      .easing(this.ease)
      .repeat(this.repeat)
      .yoyo(this.reverse)
      .onUpdate(() => {
        this.update(data)
      })
      .onComplete(() => {
        this.done()
        this.stop()
      })
      .start()
  }

  start () {
    if (super.start()) {
      if (this._tween) {
        this._tween.stop()
        this._tween = undefined
      }

      this._timeout = setTimeout(() => {
        this._buildTween()
      }, this.delay)
      this._timeoutStart = performance.now()
      this._delayRemaining = this.delay

      return true
    }
    return false
  }

  stop () {
    if (super.stop()) {
      if (this._tween) {
        this._tween.stop()
        this._tween = undefined
      }

      clearTimeout(this._timeout)
      this._timeout = 0
      this._timeoutStart = 0
      this._delayRemaining = 0

      this.parent.remove(this)
      this.parent.next()

      return true
    }
    return false
  }

  pause () {
    if (super.pause()) {
      if (this._tween) {
        this._tween.pause()
      }

      clearTimeout(this._timeout)
      this._timeout = 0
      this._delayRemaining -= performance.now() - this._timeoutStart

      return true
    }
    return false
  }

  resume () {
    if (super.resume()) {
      if (this._tween) {
        this._tween.resume()
      }

      this._timeout = setTimeout(() => {
        this._buildTween()
      }, this._delayRemaining)
      this._timeoutStart = performance.now()

      return true
    }
    return false
  }

}

module.exports = {
  Action,
}
