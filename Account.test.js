const Account = require("./Account")
const FileSystem = require("./FileSystem")

beforeEach(() => {
  jest.restoreAllMocks()
})

describe("#deposit", () => {
  test("realizar una depósito en una cuenta existente", async () => {
    const startingBalance = 0
    const amount = 10
    const account = await createAccount("Fran", startingBalance)
    const spy = jest
      .spyOn(FileSystem, "write")
      .mockReturnValue(Promise.resolve())

    await account.deposit(amount)
    expect(account.balance).toBe(startingBalance + amount)
    expect(spy).toHaveBeenCalledWith(account.filePath, amount)
  })
})

describe("#withdraw", () => {
  test("realizar una extracción en una cuenta existente", async () => {
    // todo
  })
})

async function createAccount(name, balance) {
  const spy = jest
    .spyOn(FileSystem, "read")
    .mockReturnValue(Promise.resolve(balance))
  const account = await Account.find(name)
  spy.mockRestore()

  return account
}
