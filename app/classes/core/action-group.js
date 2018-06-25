const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/common/state')
const { Action } = require('./action')

class ActionGroup extends mix(Object).with(EventsManager, StateMixin) {

  constructor (actions = [], options = {}) {
    super()

    this._queue = []
    this._options = options

    for (let a of actions) {
      this.add(a)
    }
  }

  get options () { return this._options }
  get parent () { return _.get(this._options, 'parent') }
  get name () { return _.get(this._options, 'name') }
  get auto () { return _.get(this._options, 'auto', false) }

  get queue () { return this._queue }

  get playing () {
    let actions = []
    for (let q of this._queue) {
      if (q.isRunning) {
        actions.push(q)
      }
    }
    return actions
  }

  get duration () {
    let t = 0
    if (!this.isPaused) {
      for (let q of this._queue) {
        if (q instanceof Action) {
          t += (q.delay + q.duration) * q.repeat
        }
        else if (q instanceof ActionGroup) {
          t += q.duration
        }
      }
    }
    return t
  }

  inQueue (action) {
    return _.includes(this._queue, action)
  }

  add (actions) {
    if (_.isArray(actions)) {
      for (let action of actions) {
        this.add(action)
      }
    }
    else {
      let action = actions
      if (!this.inQueue(action)) {
        this._queue.push(action)
        action.options.parent = this
      }
      if (action.auto) {
        action.start()
      }
    }

    return this
  }

  remove (action) {
    if (_.isArray(action)) {
      for (let a of action) {
        this.remove(a)
      }
    }
    else {
      action.stop()
      _.pull(this._queue, action)
    }
    return this
  }

  group (actions, options) {
    return this.add(new ActionGroup(actions, _.extend(options, { parent: this })))
  }

  _instanceOverideCall (instance, fnName) {
    if (instance) {
      for (let q of this._queue) {
        if (q instanceof ActionGroup) {
          q[fnName](instance)
        }
        else if (q instanceof Action && (_.isString(instance) && q.name === instance) || q.instance === instance) {
          q[fnName]()
        }
      }
    }
    else {
      super[fnName]()
    }
  }

  start () {
    if (super.start()) {
      return this.next()
    }
    return false
  }

  stop (instance) {
    this._instanceOverideCall(instance, 'stop')
  }

  pause (instance) {
    this._instanceOverideCall(instance, 'pause')
  }

  resume (instance) {
    this._instanceOverideCall(instance, 'resume')
  }

  next () {
    for (let q of this._queue) {
      if (q.isRunning) {
        return undefined
      }
      else if (q.isStopped) {
        q.start()
        return q
      }
    }
    return undefined
  }

}

module.exports = {
  ActionGroup,
}
