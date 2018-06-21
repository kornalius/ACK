class Words {

  adjective (words) {
    return _.random(100) > 75 ? _.sample(words) + ' ' : ''
  }

  get adjectives () {
    return ['big', 'colossal', 'fat', 'gigantic', 'great', 'huge', 'immense', 'large', 'little', 'mammoth', 'massive', 'miniature', 'petite', 'puny', 'scrawny', 'short', 'small', 'tall', 'teeny', 'teeny-tiny', 'tiny']
  }

  get colorAdjectives () {
    return ['light', 'pale', 'dark', 'deep']
  }

  get adverbs () {
    return ['very', 'extremely', 'exceedingly', 'exceptionally', 'extraordinarily', 'tremendously', 'immensely', 'intensely', 'abundantly', 'uncommonly', 'particularly', 'highly', 'remarkably', 'really', 'truly']
  }

  adverb () {
    return _.random(100) > 75 ? _.sample(this.adverbs) + ' ' : ''
  }

  namePrefix (male, adult) {
    return adult ? (male ? 'Mr' : 'Mrs') : ''
  }

  subjectivePronoun (male) {
    return male ? 'he' : 'she'
  }

  possesivePronoun (male) {
    return male ? 'his' : 'her'
  }

  objectivePronoun (male) {
    return male ? 'him' : 'her'
  }

  reflexivePronoun (male) {
    return male ? 'himself' : 'herself'
  }

  get ethnicities () {
    return ['african', 'haitian', 'american', 'canadian', 'russian', 'arab', 'albanian', 'armenian', 'bulgarian', 'dutch', 'french', 'german', 'chinese', 'japanese', 'hungarian', 'italian', 'korean', 'cuban', 'norwegian', 'romanian', 'scottish', 'slovakian', 'somalian', 'turk', 'vietnamese']
  }

  get hairColors () {
    return ['black', 'white', 'brown', 'grey', 'auburn', 'blond', 'chestnut']
  }

  get eyeColors () {
    return ['black', 'brown', 'grey', 'blue', 'green', 'hazel']
  }

  get skinColors () {
    return ['black', 'brown', 'white', 'yellow']
  }

  get smallSizes () {
    return ['skinny', 'lean', 'weak', 'little', 'miniature', 'tiny']
  }

  get normalSizes () {
    return ['average', 'typical', 'standard', 'regular', 'usual']
  }

  get largeSizes () {
    return ['fat', 'obese', 'brawny', 'muscular', 'big', 'colossal', 'huge', 'massive']
  }

  get buildSizes () {
    return _.concat(this.smallSizes, this.normalSizes, this.largeSizes)
  }

  get short () {
    return ['small', 'little', 'short']
  }

  get tall () {
    return ['tall', 'high', 'lofty', 'eminent', 'prominent']
  }

  get height () {
    return _.concat(this.short, this.tall)
  }

  get poor () {
    return ['poor', 'needy', 'penniless', 'broke', 'insolvent']
  }

  get adequate () {
    return ['acceptable', 'capable', 'adequate', 'fair', 'decent', 'satisfactory', 'sufficient', 'comfortable', 'passable']
  }

  get rich () {
    return ['upscale', 'wealthy', 'well-off', 'loaded', 'opulent', 'affluent']
  }

  get wealth () {
    return _.concat(this.poor, this.adequate, this.rich)
  }

  get socialInterests () {
    return ['flirting', 'networking', 'people', 'helping', 'listening', 'talking']
  }

  get politicalInterests () {
    return ['government', 'freedom', 'truth', 'leading']
  }

  get workInterests () {
    return ['crafting', 'exploring', 'working', 'building', 'learning', 'exercise']
  }

  get hobbyInterests () {
    return ['nature', 'cities', 'animals', 'food', 'sunshine']
  }

  get badInterests () {
    return ['fighting', 'lying', 'drinking', 'stealing', 'vandalism', 'storms', 'slacking']
  }

  get happyMoods () {
    return ['cheerful', 'content', 'ecstatic', 'happy', 'joyful', 'jubilant', 'pleased', 'gentle', 'good', 'peaceful', 'sympathetic', 'thoughtful']
  }

  get sadMoods () {
    return ['annoyed', 'apathetic', 'ashamed', 'bittersweet', 'bored', 'cynical', 'depressed', 'discontent', 'pessimistic', 'sad']
  }

  get angryMoods () {
    return ['aggravated', 'angry', 'cranky', 'enraged', 'frustrated', 'grumpy', 'infuriated', 'irritated', 'mad']
  }

  get energeticMoods () {
    return ['energetic', 'excited', 'high', 'hyper', 'intense', 'lively']
  }

  get tiredMoods () {
    return ['drained', 'exhausted', 'lazy', 'lethargic', 'morose', 'sleepy']
  }

  get dangerousMoods () {
    return ['chaotic', 'crazy', 'demented', 'predatory', 'psychotic']
  }

  get calmMoods () {
    return ['calm', 'chilled', 'relaxed']
  }

  get stressedMoods () {
    return ['anxious', 'cautious', 'defensive', 'paranoid', 'scared', 'stressed', 'shocked']
  }

  get stateMoods () {
    return ['cold', 'confused', 'curious', 'delusional', 'dorky', 'empathetic', 'envious', 'fearful', 'impatient', 'indifferent', 'melancholic', 'mellow', 'passionate', 'rebellious', 'rejected', 'strange', 'weird']
  }

  get intelligence () {
    return ['smart', 'dumb', 'stupid', 'intelligent', 'average', 'slow', 'fast', 'bright', 'sharp', 'intellectual', 'clever', 'ignorant', 'simple', 'idiot', 'thick']
  }

  get motives () {
    return ['money', 'love', 'fate', 'sickness', 'glory', 'revenge']
  }

  traits (type = 1) {
    switch (type) {
      case 1:
        return ['curious', 'studious', 'mysterious', 'rough', 'silent', 'skeptic', 'immature', 'materialistic', 'dreamy', 'creative', 'romantic', 'frivolous', 'aloof']
      case 2:
        return ['introvert', 'extrovert']
      case 3:
        return ['leader', 'follower']
      case 4:
        return ['emotional', 'emotionless']
      case 5:
        return ['humorous', 'grim']
      case 6:
        return ['selfsufficent', 'dependent']
      case 7:
        return ['logical', 'illogical']
    }
    return ''
  }

}

module.exports = {
  Words,
}
