const RelationMixin = Mixin(superclass => class RelationMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'friends', [], true)
    _.addProp(this, 'enemies', [], true)
  }

  get hasRelations () { return true }

  clearFriends () {
    this._friends = []
  }

  addFriend (npc) {
    if (!this.isFriendWith(npc)) {
      this._friends.push(npc)
      this.emit('add-friend', { npc })
    }
  }

  removeFriend (npc) {
    if (this.isFriendWith(npc)) {
      _.pull(this._friends, npc)
      this.emit('remove-friend', { npc })
    }
  }

  clearEnemies () {
    this._enemies = []
  }

  addEnemy (npc) {
    if (!this.isEnemyOf(npc)) {
      this._enemies.push(npc)
      this.emit('add-enemy', { npc })
    }
  }

  removeEnemy (npc) {
    if (this.isEnemyOf(npc)) {
      _.pull(this._enemies, npc)
      this.emit('remove-enemy', { npc })
    }
  }

  isFriendWith (npc) {
    return _.includes(this._friends, npc)
  }

  isEnemyOf (npc) {
    return _.includes(this._enemies, npc)
  }

})

module.exports = {
  RelationMixin,
}
