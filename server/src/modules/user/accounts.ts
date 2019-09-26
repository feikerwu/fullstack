import MongoDBInterface from '@accounts/mongo'
import { AccountsModule } from '@accounts/graphql-api'
import { DatabaseManager } from '@accounts/database-manager'
import { AccountsServer } from '@accounts/server'
import { AccountsPassword } from '@accounts/password'
import { ACCOUNTS_SECRET } from '../common/consts'

export const accountsPassword = new AccountsPassword({
  validateNewUser: user => {
    console.log('validateNewUser', user)

    return user
  },
})

export const setUpAccounts = (connection: any) => {
  // 给db创建一个users collection 和 sessionCollection
  const userStorage = new MongoDBInterface(connection)

  const accountsDb = new DatabaseManager({
    sessionStorage: userStorage,
    userStorage,
  })

  // 起一个账户服务
  const accountsServer = new AccountsServer(
    { db: accountsDb, tokenSecret: ACCOUNTS_SECRET },
    {
      password: accountsPassword,
    }
  )

  // 起一个账户的graphql
  const accountsGraphQL = AccountsModule.forRoot({
    accountsServer,
  })

  return { accountsGraphQL, accountsServer }
}
