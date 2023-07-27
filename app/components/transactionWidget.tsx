import { useState } from "react";
import { transaction, deleteTransaction } from "../services/database";
import ConfirmationModal from "./confirmationModal";
import EditTransaction from "./editTransaction";
import Image from "next/image"
import edit from "../../public/edit.svg"
import trash from "../../public/trash.svg"

export default function TransactionWidget({ transaction }: { transaction: transaction }) {
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
    const [showEditModal, setShowEditModal] = useState<boolean>(false)
    
    function formatDate(date: string) {
        const splits = date.split('-')
        return `${splits[2]}.${splits[1]}.${splits[0]}`
    }

    function openDeleteModal() {
        setShowDeleteModal(true)
    }

    function closeDeleteModal() {
        setShowDeleteModal(false)
    }

    function deleteSelf() {
        deleteTransaction(transaction)
    }

    function openEditModal() {
        setShowEditModal(true)
    }

    function closeEditModal() {
        setShowEditModal(false)
    }

    return (
        <div className="transaction-widget">
            <span className="transaction-box">
            <span className="top-line">
                <span className="transaction-details">
                    <span className="amount">{transaction.amount}</span>
                    <span className="account">{transaction.from}</span>
                    <span className="account">{transaction.to}</span>
                </span>
                <span className="transaction-date">{formatDate(transaction.date)}</span>
            </span>
            <span className="bottom-line">{transaction.note}</span>
            </span>
            <span className="transaction-actions">
                <Image src={edit} alt="edit" onClick={openEditModal} />
                <Image src={trash} alt="delete" onClick={openDeleteModal} />
            </span>


            {showDeleteModal ?
                (<ConfirmationModal actionCallback={deleteSelf} closeCallback={closeDeleteModal} text={`Transaktion vom ${formatDate(transaction.date)} löschen?`} />)
                :
                (<></>)}

            {showEditModal ?
                (<EditTransaction transaction={transaction} closeCallback={closeEditModal} />)
                :
                (<></>)}
        </div>
    )
}