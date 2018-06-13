const { EventsManager } = require('../../../mixins/common/events')
const { ActMixin } = require('../../../mixins/core/act')

class NeutralBehavior extends mix(Object).with(EventsManager, ActMixin) {

  act (t, delta) {
    super.act(t, delta)
  }

}

module.exports = {
  NeutralBehavior,
}
