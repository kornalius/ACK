const QuestsMixin = Mixin(superclass => class QuestsMixin extends superclass {

  constructor () {
    super(...arguments)

    _.addProp(this, 'quests', [], true)
  }

  get hasQuests () { return true }

  get activeQuest () {
    for (let quest of this._quests) {
      if (quest.isRunning) {
        return quest
      }
    }
    return undefined
  }

  addQuest (quest) {
    this._quests.push(quest)
    this.emit('add-quest', { quest })
  }

  removeQuest (quest) {
    _.pull(this._quests, quest)
    this.emit('remove-quest', { quest })
  }

})

module.exports = {
  QuestsMixin,
}
