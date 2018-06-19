const RoomsMixin = Mixin(superclass => class RoomsMixin extends superclass {

  get rooms () { return this._rooms }

  reset () {
    super.reset()

    this._rooms = undefined
  }

  randomRoom (z) {
    return this._rooms[z].random()
  }

  randomPositionInRoom (idx, z) {
    return this.randomFloorPosition(z, this.roomBounds(idx, z))
  }

  roomBounds (idx, z) {
    let r = _.isNumber(idx) ? this._rooms[z][idx] : idx
    return new PIXI.Rectangle(r.getLeft(), r.getTop(), r.getRight() - r.getLeft(), r.getBottom() - r.getTop())
  }

  roomAt (x, y, z) {
    for (let room of this._rooms[z]) {
      let r = this.roomBounds(room)
      if (r.contains(x, y)) {
        return r
      }
    }
    return undefined
  }

  roomDoors (idx, z) {
    let r = _.isNumber(idx) ? this._rooms[z][idx] : idx
    return r.getDoors()
  }

  inRoom (idx, z) {
    let tiles = this.tilesInRoom(idx, z)
    let items = this.itemsInRoom(idx, z)
    let npcs = this.npcsInRoom(idx, z)
    return { tiles, items, npcs, player: this.playerInRoom(idx, z) ? this.player : undefined }
  }

  playerInRoom (idx, z) {
    let r = this.roomBounds(idx, z)
    let player = this.player
    return player.z === z && r.contains(player.x, player.y)
  }

})

module.exports = {
  RoomsMixin,
}
