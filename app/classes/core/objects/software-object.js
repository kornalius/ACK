const { EventsManager } = require('../../mixins/common/events')
const { StatsMixin } = require('../../mixins/core/stats')

let SoftwareObject = class SoftwareObject extends mix(Object).with(EventsManager, StatsMixin) {

  constructor () {
    super()
  }

}

module.exports = {
  SoftwareObject,
}
