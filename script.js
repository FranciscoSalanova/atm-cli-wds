// execute command
// view
// withdraw
// deposit

const Account = require("./Account.js")
const CommandLine = require("./CommandLine.js")

async function main() {
  const accountName = await CommandLine.ask(
    "Which account do you like to access?"
  )

  const account = await Account.find(accountName)
  if (account == null) account = await promptCreateAccount(accountName)
  if (account != null) await promptTask(account)
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
    "What would you like to do? (view/deposit/withdraw)"
  )

  if (response === "deposit") {
    const amount = parseFloat(await CommandLine.ask("How much?"))
    await account.deposit(amount)
    CommandLine.print(`Your current balance is $${account.balance}`)
  }
  if (response === "withdraw") {
    const amount = parseFloat(await CommandLine.ask("How much?"))
    await account.withdraw(amount)
    CommandLine.print(`Your current balance is $${account.balance}`)
  }
}

main()
