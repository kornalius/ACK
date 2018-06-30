const { Text } = require('../ui/text')
const { PositionMixin } = require('../../mixins/core/position')

class TextObject extends mix(Text).with(PositionMixin) {

  constructor (x, y, room, text, font, color) {
    super(text, font, color)

    this.moveTo(x, y, room, false)
  }

}

module.exports = {
  TextObject,
}
