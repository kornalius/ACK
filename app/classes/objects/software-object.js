const { ItemObject } = require('./item-object')

class SoftwareObject extends ItemObject {

  constructor (x, y, z, map, type) {
    super(x, y, z, map, type)
  }

}

module.exports = {
  SoftwareObject,
}
