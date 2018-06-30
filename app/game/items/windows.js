const { WindowItem } = require('../../classes/item/window-item')


class WoodWindow extends WindowItem {

  get material () { return 'wood' }

}


module.exports = {
  WoodWindow,
}
