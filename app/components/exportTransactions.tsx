import { createEmailForDownload, createCopyContent, createCsvForDownload, createCsvForShare, createEmailForShare } from "../services/export"
import { transaction, markAllTransactionsSynced, deleteAllSyncedTransactions } from "../services/database"
import { useState } from "react"
import Image from "next/image"
import ConfirmationModal from "./confirmationModal"
import clipboard from "../../public/clipboard-white.svg"
import mail from "../../public/envelope-white.svg"

export default function ExportTransactions({ transactions, closeCallback }: { transactions: transaction[], closeCallback: () => void }) {
    const [showDeleteAllModal, setShowDeleteAllModal] = useState<boolean>(false)
    const [showMarkSyncedModal, setShowMarkSyncedModal] = useState<boolean>(false)
    const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"))

    function handleOutsideTap(event) {
        if (!event.target.closest(".modal")) closeCallback()
    }

    function handleUserEmailChange(event) {
        setUserEmail(event.target.value)
    }

    const unsyncedTransactions = transactions.filter(t => !t.synced)

    function createEmailFileAllTransactions() {
        localStorage.setItem("userEmail", userEmail!)
        return createEmailForDownload(transactions)
    }

    function copyToClipboardAllTransactions() {
        navigator.clipboard.writeText(createCopyContent(transactions))
    }

    function createEmailFileUnsyncedTransactions() {
        localStorage.setItem("userEmail", userEmail!)
        return createEmailForDownload(unsyncedTransactions)
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

    function CsvExport({ forUnsyncedTransactions }: { forUnsyncedTransactions: boolean }) {
        const transactionsToExport = forUnsyncedTransactions ? unsyncedTransactions : transactions

        const csvFile = createCsvForShare(transactionsToExport);
        const shareData = {
            files: [csvFile],
            title: "CSV Export",
            text: "Buachhoitung Export als CSV Datei"
        }

        const isSharingPossible = navigator.canShare && navigator.canShare(shareData)

        if (isSharingPossible) {
            const share = () => navigator.share(shareData)
            return (
                <button className="export-action csv" onClick={share}>.csv</button>
            )
        } else {
            const [textFile, date] = createCsvForDownload(transactionsToExport)
            return (
                <a className="export-action csv" download={`Buachhoitung_Export_${date}.csv`} href={textFile}>.csv</a>
            )
        }
    }

    function EmailExport({ forUnsyncedTransactions }: { forUnsyncedTransactions: boolean }) {
        const transactionsToExport = forUnsyncedTransactions ? unsyncedTransactions : transactions

        const htmlFile = createEmailForShare(transactionsToExport);
        const shareData = {
            files: [htmlFile],
            title: "Buachhoitung Export",
            text: "Buachhoitung Export als HTML Datei"
        }

        const isSharingPossible = navigator.canShare && navigator.canShare(shareData)

        if (isSharingPossible) {
            const share = () => navigator.share(shareData)
            return (
                <button className="export-action email" onClick={share}><Image src={mail} alt="Email" /></button>
            )
        } else {
            return (
                <a className="export-action email" download={"export.eml"} href={forUnsyncedTransactions ? createEmailFileUnsyncedTransactions() : createEmailFileAllTransactions()}><Image src={mail} alt="Email" /></a>
            )
        }
    }

    return (
        <div className="fill-screen" onClick={handleOutsideTap}>
            <div className="modal">
                <h1>Transaktionen exportieren</h1>
                <div className="export-options">
                    <span className="email-label">Email zum Exportieren</span>
                    <input name="email" type="text" className="email-input" value={userEmail!} onChange={handleUserEmailChange}></input>

                    <div className="export-action-label">Noch nicht synchronisierte</div>
                    <div className="export-action-wrapper">
                        <EmailExport forUnsyncedTransactions={true} />
                        <button className="export-action clipboard" onClick={copyToClipboardUnsyncedTransactions}><Image src={clipboard} alt="clipboard" /></button>
                        <CsvExport forUnsyncedTransactions={true} />
                    </div>

                    <div className="export-action-label">Alle</div>
                    <div className="export-action-wrapper">
                        <EmailExport forUnsyncedTransactions={false} />
                        <button className="export-action clipboard" onClick={copyToClipboardAllTransactions}><Image src={clipboard} alt="clipboard" /></button>
                        <CsvExport forUnsyncedTransactions={false} />
                    </div>

                    <button className="data-action" onClick={openMarkSyncedModal}>Alle Transaktionen als synchronisiert markieren</button>
                    <button className="data-action" onClick={openDeleteAllModal}>Alle synchronisierten Transatkionen löschen</button>
                    <button className="abort" onClick={closeCallback}>Schließen</button>
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