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

describe("#transfer", () => {
  test("transferir dinero", async () => {
    // primero extraemos el dinero de la cuenta desde donde salen los fondos
    const startingBalanceW = 20
    const amount = 5
    const accountW = await createAccount("Fran", startingBalanceW)
    let spy = jest.spyOn(FileSystem, "write").mockReturnValue(Promise.resolve())

    await accountW.withdraw(amount)
    expect(accountW.balance).toBe(startingBalanceW - amount)
    expect(spy).toHaveBeenCalledWith(
      accountW.filePath,
      startingBalanceW - amount
    )
    spy.mockRestore()

    // luego depositamos los fondos en la cuenta receptora
    const startingBalanceD = 0
    const accountD = await createAccount("Fran", startingBalanceD)
    spy = jest.spyOn(FileSystem, "write").mockReturnValue(Promise.resolve())

    await accountD.deposit(amount)
    expect(accountD.balance).toBe(startingBalanceD + amount)
    expect(spy).toHaveBeenCalledWith(
      accountD.filePath,
      startingBalanceD + amount
    )
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
