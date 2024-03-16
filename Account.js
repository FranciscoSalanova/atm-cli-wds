const FileSystem = require('./FileSystem.js')

module.exports = class Account {
  constructor(name) {
    this.#name = name
  }
  #name
  #balance

  get name() {
    return this.#name
  }

  get balance() {
    return this.#balance
  }

  get filePath() {
    return `accounts/${this.name}.txt`
  }

  static async find(accountName) {
    const account = new Account(accountName)

    try {
      await account.#load()
      return account
    } catch (error) {
      return
    }
  }

  async #load() {
    this.#balance = parseFloat(await FileSystem.read(this.filePath))
  }
}
