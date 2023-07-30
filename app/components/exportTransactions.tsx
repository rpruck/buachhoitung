import { createEmail, createCopyContent } from "../services/export"
import { transaction, markAllTransactionsSynced, deleteAllSyncedTransactions } from "../services/database"
import { useState } from "react"
import ConfirmationModal from "./confirmationModal"

export default function ExportTransactions({ transactions, closeCallback }: { transactions: transaction[], closeCallback: () => void }) {
    const [showDeleteAllModal, setShowDeleteAllModal] = useState<boolean>(false)
    const [showMarkSyncedModal, setShowMarkSyncedModal] = useState<boolean>(false)

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

    function openMarkSyncedModal() {
        setShowMarkSyncedModal(true)
    }

    function closeMarkSyncedModal() {
        setShowMarkSyncedModal(false)
    }

    function openDeleteAllModal() {
        setShowDeleteAllModal(true)
    }

    function closeDeleteAllModal() {
        setShowDeleteAllModal(false)
    }

    return (
        <div className="fill-screen" onClick={handleOutsideTap}>
            <div className="modal">
                <h1>Transaktionen exportieren</h1>
                <div className="export-options">
                    <a className="export-action" download="message.eml" href={createEmailFileAllTransactions()}>Alle downloaden</a>
                    <button className="export-action" onClick={copyToClipboardAllTransactions}>Alle in Zwischenablage kopieren</button>
                    <a className="export-action" download="message.eml" href={createEmailFileUnsyncedTransactions()}>Noch nicht synchronisierte downloaden</a>
                    <button className="export-action" onClick={copyToClipboardUnsyncedTransactions}>Noch nicht synchronisierte in Zwischenablage kopieren</button>
                    <button className="data-action" onClick={openMarkSyncedModal}>Alle Transaktionen als synchronisiert markieren</button>
                    <button className="data-action" onClick={openDeleteAllModal}>Alle synchronisierten Transatkionen löschen</button>
                    <button className="abort" onClick={closeCallback}>Abbrechen</button>
                </div>
            </div>

            {showDeleteAllModal ?
                (<ConfirmationModal actionCallback={deleteAllSyncedTransactions} closeCallback={closeDeleteAllModal} text="Alle synchronisierten Transaktionen löschen?" />)
                :
                (<></>)}

            {showMarkSyncedModal ?
                (<ConfirmationModal actionCallback={markAllTransactionsSynced} closeCallback={closeMarkSyncedModal} text="Alle Transaktionen als synchronisiert markieren?" />)
                :
                (<></>)}
        </div>
    )
}