// ask for account
// if account doesn't exist, ask to create an account
// ask what they want to do
// execute command
// view
// withdraw
// deposit

const Account = require('./Account.js')
const CommandLine = require('./CommandLine.js')

async function main() {
  const accountName = await CommandLine.ask(
    'Which account do you like to access?'
  )

  const account = await Account.find(accountName)
  if (account) {
    console.log('Found account')
  } else {
    console.error('Cannot find account')
  }
}

main()
