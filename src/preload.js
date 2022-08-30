const { contextBridge } = require('electron')
const WalletApi = require('@iota/wallet');

try {
    console.log('Init logger')
    const loggerOptions = {
        colorEnabled: true,
        name: './wallet.log',
        levelFilter: 'debug',
        targetExclusions: ['h2', 'hyper', 'rustls', 'message_handler'],
    }
    WalletApi.initLogger(loggerOptions)
    console.log('Finished init')
} catch (error) {
    console.error('[Preload Error]: ', error)
}

let profileManagers = {}
try {
    // contextBridge doesn't allow passing custom properties & methods on prototype chain
    // https://www.electronjs.org/docs/latest/api/context-bridge
    // This workaround exposes the classes through factory methods
    // The factory method also copies all the prototype methods to the object so that it gets passed through the bridge
    contextBridge.exposeInMainWorld('__WALLET__API__', {
        createAccountManager(id, options) {
            const protoProps = Object.getOwnPropertyNames(WalletApi.AccountManager.prototype)
            const manager = new WalletApi.AccountManager(options)
            manager.id = id
            profileManagers[id] = manager

            protoProps.forEach((key) => {
                if (key !== 'constructor') {
                    manager[key] = manager[key].bind(manager)
                }
            })

            return manager
        },
        deleteAccountManager(id) {
            if (id && id in profileManagers) {
                delete profileManagers[id]
            }
        },
        async getAccount(id, index) {
            const manager = profileManagers[id]
            const account = await manager.getAccount(index)
            const protoProps = Object.getOwnPropertyNames(WalletApi.Account.prototype)

            protoProps.forEach((key) => {
                if (key !== 'constructor') {
                    account[key] = account[key].bind(account)
                }
            })

            return account
        },
    })
} catch (error) {
    console.error('[Preload Error]:', error)
}