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
    //date formatted as YYYY-MM-DD string
    date: string
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
            accountStore.createIndex("from", "from", { unique: false })
            accountStore.createIndex("to", "to", { unique: false })
            accountStore.createIndex("date", "date", { unique: false })
            accountStore.createIndex("synced", "synced", { unique: false })

            accountStore.put({ id: "000", name: "Default" })

            const date = new Date(Date.now())

            const transactionStore = db.createObjectStore("transactions", { keyPath: "id", autoIncrement: true })
            transactionStore.put({ id: 1, amount: 69, from: "000", to: "001", date: date.toISOString().split('T')[0], note: "Test", synced: true })
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

export function deleteAccount(account: account) {
    return new Promise((resolve) => {
        let request = indexedDB.open(DB_NAME, VERSION)

        request.onsuccess = () => {
            const db = request.result
            db
                .transaction("accounts", "readwrite")
                .objectStore("accounts")
                .delete(account.id).onsuccess = (event) => {
                    resolve(event.target.result)
                }
        }
    })
}

export function updateAccount(account: account) {
    return new Promise((resolve) => {
        let request = indexedDB.open(DB_NAME, VERSION)

        request.onsuccess = () => {
            const db = request.result
            db
                .transaction("accounts", "readwrite")
                .objectStore("accounts")
                .put(account).onsuccess = (event) => {
                    resolve(event.target.result)
                }
        }
    })
}

export function getAllTransactions(): Promise<Array<transaction>> {
    return new Promise((resolve) => {
        let request = indexedDB.open(DB_NAME, VERSION)

        request.onsuccess = () => {
            const db = request.result
            db
                .transaction("transactions")
                .objectStore("transactions")
                .getAll().onsuccess = (event) => {
                    resolve(event.target.result)
                }
        }
    })
}

export function deleteTransaction(transaction: transaction) {
    return new Promise((resolve) => {
        let request = indexedDB.open(DB_NAME, VERSION)

        request.onsuccess = () => {
            const db = request.result
            db
                .transaction("transactions", "readwrite")
                .objectStore("transactions")
                .delete(transaction.id!).onsuccess = (event) => {
                    resolve(event.target.result)
                }
        }
    })
}

export function updateTransaction(transaction: transaction) {
    return new Promise((resolve) => {
        let request = indexedDB.open(DB_NAME, VERSION)

        request.onsuccess = () => {
            const db = request.result
            db
                .transaction("transactions", "readwrite")
                .objectStore("transactions")
                .put(transaction).onsuccess = (event) => {
                    resolve(event.target.result)
                }
        }
    })
}

export function markAllTransactionsSynced() {
    return new Promise((resolve) => {
        let request = indexedDB.open(DB_NAME, VERSION)

        request.onsuccess = () => {
            const db = request.result
            db
                .transaction("transactions", "readwrite")
                .objectStore("transactions")
                .openCursor().onsuccess = (event) => {
                    const cursor = event.target.result
                    if (cursor) {
                        if (!cursor.value.synced) {
                            const updateTransaction = cursor.value
                            updateTransaction.synced = true

                            const request = cursor.update(updateTransaction)
                            request.onsuccess = () => {
                                return
                            }
                        }
                        cursor.continue()
                    }
                }
                resolve(true)
        }
    })
}

export function deleteAllSyncedTransactions() {
    return new Promise((resolve) => {
        let request = indexedDB.open(DB_NAME, VERSION)

        request.onsuccess = () => {
            const db = request.result
            db
                .transaction("transactions", "readwrite")
                .objectStore("transactions")
                .openCursor().onsuccess = (event) => {
                    const cursor = event.target.result
                    if (cursor) {
                        if (cursor.value.synced) {
                            const request = cursor.delete()
                            request.onsuccess = () => {
                                return
                            }
                        }
                        cursor.continue()
                    }
                }
                resolve(true)
        }
    })
}