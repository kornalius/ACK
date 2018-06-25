const { Text } = require('../ui/text')
const { PositionMixin } = require('../../mixins/core/position')

class TextObject extends mix(Text).with(PositionMixin) {

  constructor (x, y, z, map, text, font, color) {
    super(text, font, color)

    this.moveTo(x, y, z, map, false)
  }

}

module.exports = {
  TextObject,
}
