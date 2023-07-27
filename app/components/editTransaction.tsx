import { useEffect, useState } from "react"
import { account, transaction, updateTransaction, getAllAccounts } from "../services/database"
import Image from "next/image"
import arrow from "../../public/arrow.svg"

export default function EditTransaction({ transaction, closeCallback }: { transaction: transaction, closeCallback: () => void }) {
    const [amount, setAmount] = useState(transaction.amount)
    const [note, setNote] = useState(transaction.note)
    const [from, setFrom] = useState(transaction.from)
    const [to, setTo] = useState(transaction.to)
    const [date, setDate] = useState(transaction.date)
    const [accounts, setAccounts] = useState<account[] | null>(null)

    function handleAmountChange(event) {
        setAmount(event.target.value)
    }

    function handleNoteChange(event) {
        setNote(event.target.value)
    }

    function handleFromChange(event) {
        setFrom(event.target.value)
    }

    function handleToChange(event) {
        setTo(event.target.value)
    }

    function handleDateChange(event) {
        setDate(event.target.value)
    }

    function handleUpdateTransaction(event) {
        event.preventDefault()
        const update: transaction = {
            id: transaction.id!,
            amount: amount,
            from: from,
            to: to,
            note: note,
            date: date,
            synced: transaction.synced
        }
        updateTransaction(update)
        closeCallback()
    }

    useEffect(() => {
        getAllAccounts().then((res) => {
            setAccounts(res)
        })
    }, [accounts])

    function createOption(element: string) {
        return (<option value={element} key={element}>{element}</option>)
    }

    return (
        <div className="fill-screen">
            <div className="modal">
                <h1>Transaktion bearbeiten</h1>
                <form onSubmit={handleUpdateTransaction}>
                    <label>
                        Betrag
                        <input type="number" inputMode="decimal" value={amount} onChange={handleAmountChange}></input>
                    </label>
                    <label>
                        Notiz
                        <input type="text" value={note} onChange={handleNoteChange}></input>
                    </label>

                    <span className="from-to">
                        <label>
                            Soll
                            <select value={from} onChange={handleFromChange}>
                                {accounts?.map(account => createOption(account.id))}
                            </select>
                        </label>

                        <Image src={arrow} alt="to" />

                        <label>
                            Haben
                            <select value={to} onChange={handleToChange}>
                                {accounts?.map(account => createOption(account.id))}
                            </select>
                        </label>
                    </span>

                    <input type="date" value={date} onChange={handleDateChange}></input>

                    <button type="submit">Speichern</button>
                    <button className="abort" onClick={closeCallback}>Abbrechen</button>
                </form>
            </div>
        </div>
    )

}