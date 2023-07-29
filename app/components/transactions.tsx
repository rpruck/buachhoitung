import { useEffect, useState } from "react";
import { getAllTransactions, transaction } from "../services/database";
import Image from "next/image"
import upload from "../../public/upload.svg"
import TransactionWidget from "./transactionWidget";

export default function Transactions() {
    const [transactions, setTransactions] = useState<transaction[] | null>(null)

    useEffect(() => {
        getAllTransactions().then((res) => {
            setTransactions(res)
        })
    }, [transactions])

    return (
        <>
            <div className="header">
                <h1>Transaktionen</h1>
                <Image src={upload} alt="export transactions" onClick={() => { return }} />
            </div>

            <div className="transactions-list">
                {transactions ?
                    (transactions.map(transaction => <TransactionWidget transaction={transaction} key={transaction.id} />))
                    :
                    (<span>Loading Transactions</span>)
                }
            </div>
        </>
    )
}