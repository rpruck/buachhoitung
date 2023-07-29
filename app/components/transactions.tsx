import { useEffect, useState } from "react"
import { getAllTransactions, transaction } from "../services/database"
import Image from "next/image"
import upload from "../../public/upload.svg"
import TransactionWidget from "./transactionWidget"
import search from "../../public/search.svg"

export default function Transactions() {
    const [transactions, setTransactions] = useState<transaction[] | null>(null)
    const [query, setQuery] = useState<string>("")
    const [dateOrder, setDateOrder] = useState<string>("none")
    const [syncFilter, setSyncFilter] = useState<string>("none")

    useEffect(() => {
        getAllTransactions().then((res) => {
            setTransactions(res)
        })
    }, [transactions])

    function handleQueryChange(event: any) {
        setQuery(event.target.value)
    }

    function handleDateOrderChange(event: any) {
        switch (dateOrder) {
            case "none": {
                setDateOrder("new")
                break
            }
            case "new": {
                setDateOrder("old")
                break
            }
            case "old": {
                setDateOrder("none")
                break
            }
            default: {
                setDateOrder("none")
                break
            }
        }
    }

    function handleSyncFilterChange(event: any) {
        switch (syncFilter) {
            case "none": {
                setSyncFilter("unsynced")
                break
            }
            case "unsynced": {
                setSyncFilter("synced")
                break
            }
            case "synced": {
                setSyncFilter("none")
                break
            }
            default: {
                setSyncFilter("none")
                break
            }
        }
    }

    function containsQuery(transaction: transaction) {
        return transaction.from.includes(query) || transaction.to.includes(query) || transaction.note!.toLowerCase().includes(query.toLowerCase())
    }

    function getSyncFilter(): (transaction: transaction) => boolean {
        switch (syncFilter) {
            case "none": {
                return () => true
            }
            case "unsynced": {
                return (transaction: transaction) => !transaction.synced
            }
            case "synced": {
                return (transaction: transaction) => transaction.synced
            }
        }
        return () => true
    }

    function getDateSort() {
        switch (dateOrder) {
            case "none": {
                return () => 0 
            }
            case "new": {
                return (t1: transaction, t2:transaction) => {
                    if (t1.date < t2.date) return 1
                    if (t1.date > t2.date) return -1
                    return 0
                }
            }
            case "old": {
                return (t1: transaction, t2:transaction) => {
                    if (t1.date > t2.date) return 1
                    if (t1.date < t2.date) return -1
                    return 0
                }
            }
        }
    }

    return (
        <>
            <div className="header">
                <h1>Transaktionen</h1>
                <Image src={upload} alt="export transactions" onClick={() => { return }} />
            </div>

            <div className="filter-wrapper">
                <div className="query-wrapper">
                    <Image src={search} alt="search" />
                    <input
                        name="query"
                        type="text"
                        value={query}
                        onChange={handleQueryChange}
                    />
                </div>
                <button className={`filter-button ${dateOrder}`} onClick={handleDateOrderChange}>Datum</button>
                <button className={`filter-button ${syncFilter}`} onClick={handleSyncFilterChange}>Sync</button>
            </div>

            <div className="transactions-list">
                {transactions ?
                    (transactions
                        .filter(containsQuery)
                        .filter(getSyncFilter())
                        .sort(getDateSort())
                        .map(transaction => <TransactionWidget transaction={transaction} key={transaction.id} />))
                    :
                    (<span>Loading Transactions</span>)
                }
            </div>
        </>
    )
}