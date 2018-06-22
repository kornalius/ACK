const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/common/state')

class Action extends mix(Object).with(EventsManager, StateMixin) {

  constructor (options) {
    super()

    this.reset()

    this._options = options
  }

  get parent () { return this._parent }
  get instance () { return _.get(this._options, 'instance') }
  get startData () {
    let value = _.get(this._options, 'start')
    if (_.isNumber(value)) {
      value = { value: value }
    }
    else if (_.isUndefined(value)) {
      value = {}
    }
    return value
  }
  get endData () {
    let value = _.get(this._options, 'end')
    if (_.isNumber(value)) {
      value = { value: value }
    }
    else if (_.isUndefined(value)) {
      value = {}
    }
    return value
  }
  get ease () { return _.get(this._options, 'ease', TWEEN.Easing.Linear.None) }
  get delay () { return _.get(this._options, 'delay', 1) }
  get duration () { return _.get(this._options, 'duration', 1000) }
  get repeat () { return _.get(this._options, 'repeat', 0) }
  get reverse () { return _.get(this._options, 'reverse', false) }

  reset () {
    super.reset()

    this._parent = undefined
    this._options = {}
    this._tween = undefined
  }

  start () {
    if (super.start()) {
      this._parent.current = this

      if (this._tween) {
        this._tween.stop()
        this._tween = undefined
      }

      let data = _.clone(this.startData)
      this._tween = new TWEEN.Tween(data)
        .delay(this.delay)
        .to(_.clone(this.endData), this.duration)
        .easing(this.ease)
        .repeat(this.repeat - 1)
        .yoyo(this.reverse)
        .onUpdate(() => {
          this.update(data)
        })
        .onComplete(() => {
          this.done()
          let old = this._parent.current
          this._parent.next(old)
          old.stop()
        })
        .start()
    }
  }

  stop () {
    if (super.stop()) {
      if (this._tween) {
        this._tween.stop()
        this._tween = undefined
      }

      this._parent.current = undefined
    }
  }

  pause () {
    if (super.pause()) {
      if (this._tween) {
        this._tween.pause()
      }
    }
  }

  resume () {
    if (super.resume()) {
      if (this._tween) {
        this._tween.resume()
      }
    }
  }

  update (data) {
  }

  done () {
  }

}

module.exports = {
  Action,
}
