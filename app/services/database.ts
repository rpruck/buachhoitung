const VERSION = 3
const DB_NAME = "bookkeeping"

export interface account {
    id: string
    name: string
}

export interface transaction {
    id?: number
    amount: number
    from: string
    to: string
    date: Date
    note?: string
    synced: boolean
}

export function setupDB() {
    return new Promise((resolve) => {
        let request = indexedDB.open(DB_NAME, VERSION)

        request.onerror = (event) => {
            console.error(`Database error: ${event.target?.errorCode}`)
            resolve(false)
        }

        request.onupgradeneeded = (event) => {
            const db = request.result
            const accountStore = db.createObjectStore("accounts", { keyPath: "id" })
            accountStore.put({ id: "000", name: "Default" })

            const transactionStore = db.createObjectStore("transactions", { keyPath: "id", autoIncrement: true })
            transactionStore.put({ id: 1, date: Date.now(), note: "Test" })
        }

        request.onsuccess = (event) => {
            resolve(request.result)
        }
    })
}

export function getAllAccounts(): Promise<Array<account>> {
    return new Promise((resolve) => {
        let request = indexedDB.open(DB_NAME, VERSION)

        request.onsuccess = () => {
            const db = request.result
            db
                .transaction("accounts")
                .objectStore("accounts")
                .getAll().onsuccess = (event) => {
                    resolve(event.target.result)
                }
        }
    })
}

export function addTransaction(transaction: transaction) {
    return new Promise((resolve) => {
        let request = indexedDB.open(DB_NAME, VERSION)

        request.onsuccess = () => {
            const db = request.result
            db
                .transaction("transactions", "readwrite")
                .objectStore("transactions")
                .add(transaction).onsuccess = (event) => {
                    resolve(event.target.result)
                }
        }
    }) 
}

export function addAccount(account: account) {
    return new Promise((resolve) => {
        let request = indexedDB.open(DB_NAME, VERSION)

        request.onsuccess = () => {
            const db = request.result
            db
                .transaction("accounts", "readwrite")
                .objectStore("accounts")
                .add(account).onsuccess = (event) => {
                    resolve(event.target.result)
                }
        }
    }) 
}