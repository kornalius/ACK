const { StairsUp, StairsDown } = require('../../../game/items/stairs')

const StairsGeneratorMixin = Mixin(superclass => class StairsGeneratorMixin extends superclass {

  generateStairs () {
    for (let z = 0; z < this._depth - 1; z++) {
      let idx = this.randomRoom(z)
      let pos = this.randomPositionInRoom(idx, z, (x, y, z) => this.blockedAt(x, y, z) && this.blockedAt(x, y, z + 1))
      if (pos) {
        this.addItemAt(new StairsUp(), pos.x, pos.y, z)
        this.addItemAt(new StairsDown(), pos.x, pos.y, z + 1)
      }
    }
  }

})

module.exports = {
  StairsGeneratorMixin,
}
