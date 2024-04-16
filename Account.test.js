const Account = require("./Account")
const FileSystem = require("./FileSystem")

beforeEach(() => {
  jest.restoreAllMocks()
})

describe("#find", () => {
  test("consultar una cuenta inexistente", async () => {
    const accountName = "Fred"
    expect(await Account.find(accountName)).toBeUndefined()
  })

  test("en caso de no existir, crearla", async () => {
    // todo
  })
})

describe("#deposit", () => {
  test("depositar dinero", async () => {
    const startingBalance = 0
    const amount = 10
    const account = await createAccount("Fran", startingBalance)
    const spy = jest
      .spyOn(FileSystem, "write")
      .mockReturnValue(Promise.resolve())

    await account.deposit(amount)
    expect(account.balance).toBe(startingBalance + amount)
    expect(spy).toHaveBeenCalledWith(account.filePath, startingBalance + amount)
  })
})

describe("#withdraw", () => {
  test("extraer dinero en una cuenta con fondos", async () => {
    const startingBalance = 10
    const amount = 5
    const account = await createAccount("Fran", startingBalance)
    const spy = jest
      .spyOn(FileSystem, "write")
      .mockReturnValue(Promise.resolve())

    await account.withdraw(amount)
    expect(account.balance).toBe(startingBalance - amount)
    expect(spy).toHaveBeenCalledWith(account.filePath, startingBalance - amount)
  })

  describe("en una cuenta existente sin fondos suficientes", () => {
    test("debería tirar error", async () => {
      const startingBalance = 5
      const amount = 10
      const account = await createAccount("Fran", startingBalance)
      const spy = jest.spyOn(FileSystem, "write")

      await expect(account.withdraw(amount)).rejects.toThrow()
      expect(account.balance).toBe(startingBalance)
      expect(spy).not.toHaveBeenCalled()
    })
  })
})

/** Devuelve una cuenta para ser usada en la prueba. */
async function createAccount(name, balance) {
  const spy = jest
    .spyOn(FileSystem, "read")
    .mockReturnValue(Promise.resolve(balance))
  const account = await Account.find(name)
  spy.mockRestore()

  return account
}
