import { useEffect, useState } from "react"
import { account, transaction, updateTransaction, getAllAccounts } from "../services/database"
import Image from "next/image"
import arrowDark from "../../public/arrow-dark.svg"

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

    function handleOutsideTap(event) {
        if (!event.target.closest(".modal")) closeCallback()
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
        <div className="fill-screen" onClick={handleOutsideTap}>
            <div className="modal">
                <h1>Transaktion bearbeiten</h1>
                <form onSubmit={handleUpdateTransaction}>
                    <label htmlFor="edit-amount">
                        Betrag
                    </label>
                    <input type="number" name="edit-amount" inputMode="decimal" value={amount} onChange={handleAmountChange} />
                    <label>
                        Notiz
                    </label>
                    <input type="text" value={note} onChange={handleNoteChange} />

                    <span className="from-to">
                        <span className="selection">
                            <label htmlFor="from">
                                Soll
                            </label>
                            <select value={from} name="from" onChange={handleFromChange}>
                                {accounts?.map(account => createOption(account.id))}
                            </select>
                        </span>

                        <Image src={arrowDark} alt="to" />

                        <span className="selection">
                            <label htmlFor="to">
                                Haben
                            </label>
                            <select value={to} name="to" onChange={handleToChange}>
                                {accounts?.map(account => createOption(account.id))}
                            </select>
                        </span>
                    </span>

                    <label htmlFor="date">Datum</label>

                    <input type="date" name="date" value={date} onChange={handleDateChange}></input>

                    <span className="buttons">
                        <button type="submit" className="primary">Speichern</button>
                        <button className="abort" onClick={closeCallback}>Abbrechen</button>
                    </span>
                </form>
            </div>
        </div>
    )

}