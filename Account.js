const FileSystem = require("./FileSystem.js")

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

  /** Busca y devuelve una función a partir del nombre de cuenta. */
  static async find(accountName) {
    const account = new Account(accountName)

    try {
      await account.#load()
      return account
    } catch (error) {
      return
    }
  }

  /** Obtiene el balance de la cuenta a partir del archivo correspondiente. */
  async #load() {
    this.#balance = parseFloat(await FileSystem.read(this.filePath))
  }

  /** Devuelve una nueva cuenta creada. */
  static async create(accountName) {
    const account = new Account(accountName)

    await FileSystem.write(account.filePath, 0)
    account.#balance = 0

    return account
  }

  /** Deposita efectivo en la cuenta. */
  async deposit(amount) {
    await FileSystem.write(this.filePath, this.#balance + amount)
    this.#balance = this.#balance + amount
  }

  /** Extrae efectivo en la cuenta. */
  async withdraw(amount) {
    if (amount > this.#balance) throw new Error()
    await FileSystem.write(this.filePath, this.#balance - amount)
    this.#balance = this.#balance - amount
  }

  /** Transfiere efectivo de una cuenta a otra cuenta. */
  async transfer(amount, accountName) {
    if (amount > this.#balance) throw new Error()
    await FileSystem.write(this.filePath, this.#balance - amount)
    this.#balance = this.#balance - amount
    const accountToTransfer = await Account.find(accountName)
    await accountToTransfer.deposit(amount)
  }
}
