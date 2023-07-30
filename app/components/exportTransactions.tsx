import { createEmail, createCopyContent } from "../services/export"
import { transaction } from "../services/database"

export default function ExportTransactions({ transactions, closeCallback }: { transactions: transaction[], closeCallback: () => void }) {
    function handleOutsideTap(event) {
        if (!event.target.closest(".modal")) closeCallback()
    }

    const unsyncedTransactions = transactions.filter(t => !t.synced)

    function createEmailFileAllTransactions() {
        localStorage.setItem("userEmail", "rapru.rp@gmail.com")
        return createEmail(transactions)
    }

    function copyToClipboardAllTransactions() {
        navigator.clipboard.writeText(createCopyContent(transactions))
    }

    function createEmailFileUnsyncedTransactions() {
        localStorage.setItem("userEmail", "rapru.rp@gmail.com")
        return createEmail(unsyncedTransactions)
    }

    function copyToClipboardUnsyncedTransactions() {
        navigator.clipboard.writeText(createCopyContent(unsyncedTransactions))
    }

    return (
        <div className="fill-screen" onClick={handleOutsideTap}>
            <div className="modal">
                <h1>Transaktionen exportieren</h1>
                <a download="message.eml" href={createEmailFileAllTransactions()}>Alle downloaden</a>
                <button onClick={copyToClipboardAllTransactions}>Alle in Zwischenablage kopieren</button>
                <a download="message.eml" href={createEmailFileUnsyncedTransactions()}> downloaden</a>
                <button onClick={copyToClipboardUnsyncedTransactions}>Alle in Zwischenablage kopieren</button>
            </div>
        </div>
    )
}