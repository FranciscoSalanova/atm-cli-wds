const fs = require("fs")
const Account = require("./Account")

beforeEach(() => {
  try {
    fs.mkdirSync("accounts")
  } catch {
    // Ignore error since folder already exists
  }
})

afterEach(() => {
  fs.rmSync("accounts", { recursive: true, force: true })
})

describe(".create", () => {
  test("it creates a new account and file", async () => {
    const name = "Fran"
    const account = await Account.create(name)
    expect(account.name).toBe("Fran")
    expect(account.balance).toBe(0)
    expect(fs.readFileSync(account.filePath).toString()).toBe("0")
  })
})

describe(".find", () => {
  test("it returns the account", async () => {
    const name = "Fran"
    const balance = 10
    fs.writeFileSync(`accounts/${name}.txt`, balance.toString())
    const account = await Account.find(name)
    expect(account.name).toBe("Fran")
    expect(account.balance).toBe(balance)
  })

  describe("when there is no existing account", () => {
    test("it returns undefined", async () => {
      const name = "Fran"
      const account = await Account.find(name)
      expect(account).toBeUndefined()
    })
  })
})
