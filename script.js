const Account = require("./Account.js")
const CommandLine = require("./CommandLine.js")

main()

async function main() {
  try {
    const accountName = await CommandLine.ask(
      "Which account do you like to access?"
    )

    const account = await Account.find(accountName)
    if (account == null) account = await promptCreateAccount(accountName)
    if (account != null) await promptTask(account)
  } catch (error) {
    CommandLine.print("ERROR: please try again")
  }
}

async function promptCreateAccount(accountName) {
  const response = await CommandLine.ask(
    "That account does not exist, would you like to create it? (yes/no)"
  )

  if (response === "yes") {
    return await Account.create(accountName)
  }
}

async function promptTask(account) {
  const response = await CommandLine.ask(
    "What would you like to do? (view/deposit/withdraw/transfer)"
  )

  if (response === "deposit") {
    const amount = parseFloat(await CommandLine.ask("How much?"))
    await account.deposit(amount)
  } else if (response === "withdraw") {
    const amount = parseFloat(await CommandLine.ask("How much?"))
    try {
      await account.withdraw(amount)
    } catch (error) {
      CommandLine.print("Insufficient fonds.")
    }
  } else if (response === "transfer") {
    const amount = parseFloat(await CommandLine.ask("How much?"))
    const accountToTransfer = await CommandLine.ask("To which account?")
    try {
      await account.transfer(amount, accountToTransfer)
    } catch (error) {
      CommandLine.print("Insufficient fonds.")
    }
  }

  CommandLine.print(`Your current balance is $${account.balance}`)
}
