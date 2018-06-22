const { EventsManager } = require('../../mixins/common/events')
const { StateMixin } = require('../../mixins/common/state')
const { ActMixin } = require('../../mixins/core/act')

class ActionGroup extends mix(Object).with(EventsManager, StateMixin, ActMixin) {

  constructor () {
    super()

    this.reset()
  }

  get parent () { return this._parent }
  get actions () { return this._actions }
  get groups () { return this._groups }

  get current () { return this._current }
  get currentIndex () { return _.indexOf(this._actions, this._current) }
  get currentGroup () { return this.getActionGroup(this._current) }

  get time () {
    let t = 0
    if (!this.isPaused) {
      for (let g of this._groups) {
        t += g.duration + g.delay
      }
      for (let a of this._actions) {
        t += a.duration * a.repeat
      }
    }
    return t
  }

  get duration () {
    let t = 0
    if (!this.isPaused) {
      for (let g of this._groups) {
        t += g.duration
      }
      for (let a of this._actions) {
        t += (a.duration + a.delay) * a.repeat
      }
    }
    return t
  }

  reset () {
    super.reset()

    this._parent = undefined
    this._actions = []
    this._groups = []
    this._current = undefined
  }

  act (t, delta) {
    super.act(t, delta)
    if (this._duration > 0) {
      this.duration -= delta
      if (this._duration <= 0) {
        this.stop()
      }
    }
  }

  hasAction (action) {
    return _.includes(this._actions, action)
  }

  add (actionClass, options) {
    let action = _.isFunction(actionClass) ? new actionClass(options) : actionClass
    action._parent = this
    if (!this.hasAction(action)) {
      this._actions.push(action)
    }
    return action
  }

  remove (action) {
    action.stop()
    _.remove(this._actions, action)
  }

  hasGroup (group) {
    return _.includes(this._groups, group)
  }

  addGroup (groupClass) {
    let group = _.isFunction(groupClass) ? new groupClass() : groupClass
    group._parent = this
    if (!this.hasGroup(group)) {
      this._groups.push(group)
    }
    return group
  }

  removeGroup (group) {
    group.stop()
    _.remove(this._groups, group)
  }

  group (...actions) {
    let group = new ActionGroup()
    group._parent = this

    for (let act of actions) {
      if (_.isArray(act)) {
        for (let a of act) {
          this._actions.push(a)
        }
      }
      else if (act.isAction) {
        this._actions.push(act)
      }
    }

    return group
  }

  getActionGroup (action) {
    for (let g of this._groups) {
      if (_.includes(g.groups, action)) {
        return g
      }
    }
    return undefined
  }

  pauseAll (instance) {
    for (let g of this._groups) {
      g.pauseAll(instance)
    }
    for (let a of this._actions) {
      if (!instance || a.instance === instance) {
        a.pause()
      }
    }
  }

  stopAll (instance) {
    for (let g of this._groups) {
      g.stopAll(instance)
    }
    for (let a of this._actions) {
      if (!instance || a.instance === instance) {
        a.stop()
      }
    }
  }

  start () {
    super.start()

    if (!this._current) {
      this.next()
    }
  }

  stop () {
    super.stop()

    if (this._current && this._current.isPlaying) {
      this._current.stop()
    }
  }

  pause () {
    super.pause()
    if (this._current && this._current.isPlaying) {
      this._current.pause()
    }
  }

  resume () {
    super.resume()
    if (this._current && this._current.isPaused) {
      this._current.resume()
    }
  }

  actionIndex (action) {
    return _.indexOf(this._actions, action)
  }

  isLastAction (action) {
    return this.actionIndex(action) === this._actions.length - 1
  }

  canNext (action) {
    return !_.isEmpty(this._actions) && !this.isLastAction(action)
  }

  next () {
    if (this.canNext(this._current)) {
      let action = this._actions[this.action]
      this._current = action
    }
    else {
      this._current = undefined
    }
    return this._current
  }

}

module.exports = {
  ActionGroup,
}
