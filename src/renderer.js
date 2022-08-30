const walletApi = window['__WALLET__API__']

const accountManagerOptions = {
    storagePath: './wallet-database',
    clientOptions: {
        nodes: ['https://api.testnet.shimmer.network'],
        localPow: true,
    },
    coinType: 4219,
    secretManager: {
        Stronghold: {
            snapshotPath: `./wallet.stronghold`,
            password: 'hello-iota-1234',
        },
    },
};

let manager
let account

async function run() {
    try {
        manager = await walletApi.createAccountManager(1, accountManagerOptions);

        account = await manager.createAccount({
            alias: 'Alice',
        });
        console.log('Account created:', account);

        const secondAccount = await manager.createAccount({
            alias: 'Bob',
        });
        console.log('Account created:', secondAccount);
    } catch (error) {
        console.log('Error: ', error);
    }
}

run().then(() => {
    console.log("Manager:", manager)
    console.log("Account:", account)
})