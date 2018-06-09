const { EventsManager } = require('../../mixins/common/events')

let Game = class Game extends mix(Object).with(EventsManager) {

  constructor () {
    super()

    this.reset()
  }

  reset () {
  }

  tick (t, delta) {
  }

}

module.exports = {
  Game,
}
