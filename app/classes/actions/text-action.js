const { Action } = require('../core/action')

class TextAction extends Action {

  _setValue (data) {
    let i = this.instance

    for (let key in data) {
      switch (key) {
        case 'value':
          i.text = this.endText.substr(0, Math.trunc(data.value))
          break
      }
    }

    ACK.update()
  }

  get startText () {
    if (!this._startText) {
      let value = _.get(this._options, 'start')
      this._startText = _.isString(value) ? value : _.get(value, 'text', '')
    }
    return this._startText
  }

  get endText () {
    if (!this._endText) {
      let value = _.get(this._options, 'end')
      this._endText = _.isString(value) ? value : _.get(value, 'text', '')
    }
    return this._endText
  }

  get startData () {
    return { value: this.startText.length }
  }

  get endData () {
    return { value: this.endText.length }
  }

  start () {
    if (super.start()) {
      this.instance.text = this.startText
      return true
    }
    return false
  }

  update (data) {
    this._setValue(data)
  }

}

module.exports = {
  TextAction
}
