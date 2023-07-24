export class databaseAccess {
    db: IDBDatabase

    constructor() {
        const request = indexedDB.open("bookkeeping", 3)
        request.onerror = (event) => {
            console.error(`Database error: ${event.target?.errorCode}`)
        }
        request.onupgradeneeded = (event) => {
            const db = request.result
            const accountStore = db.createObjectStore("accounts", { keyPath: "id"})
            accountStore.put({id: "000", name: "Default"})

            const transactionStore = db.createObjectStore("transactions", { keyPath: "id", autoIncrement: true})
            transactionStore.put({id: 1, date: Date.now(), note: "Test"})
        }

        request.onsuccess = (event) => {
            this.db = request.result
        }
    }

    getAllAccounts() {
        const request = this.db
        .transaction(["accounts"], "readonly")
        .objectStore("accounts")
        .getAll()

        request.onerror = this.handleError

        request.onsuccess = (event) => {
            return request.result
        }

    } 

    getAllTransactions() {
        const request = this.db
        .transaction(["transactions"], "readonly")
        .objectStore("transactions")
        .getAll()

        request.onerror = this.handleError

        request.onsuccess = (event) => {
            return request.result
        } 
    }

    handleError(event: any) {
        console.error(`Database error: ${event.target?.errorCode}`)
    }
}