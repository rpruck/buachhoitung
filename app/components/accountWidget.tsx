import { useState } from "react"
import accounts from "../../public/accounts.svg"
import edit from "../../public/edit.svg"
import trash from "../../public/trash.svg"
import { account, deleteAccount } from "../services/database"
import Image from "next/image"
import ConfirmationModal from "./confirmationModal"
import EditAccount from "./editAccount"

export default function AccountWidget({ account }: { account: account }) {
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
    const [showEditModal, setShowEditModal] = useState<boolean>(false)

    function openDeleteModal() {
        setShowDeleteModal(true)
    }

    function closeDeleteModal() {
        setShowDeleteModal(false)
    }

    function deleteSelf() {
        deleteAccount(account)
    }

    function openEditModal() {
        setShowEditModal(true)
    }

    function closeEditModal() {
        setShowEditModal(false)
    }

    return (
        <div className="account-widget">
            <div className="account-widget-id">
                <span className="top-line">
                    <Image src={accounts} alt={account.id} />
                    <span>{account.id}</span>
                </span>
                <span className="bottom-line">{account.name}</span>
            </div>
            <div className="account-widget-actions">
                <Image src={edit} alt="edit" onClick={openEditModal} />
                <Image src={trash} alt="delete" onClick={openDeleteModal} />
            </div>

            {showDeleteModal ?
                (<ConfirmationModal actionCallback={deleteSelf} closeCallback={closeDeleteModal} text={`Konto ${account.id} löschen?`} />)
                :
                (<></>)}

            {showEditModal ?
                (<EditAccount account={account} closeCallback={closeEditModal} />)
                :
                (<></>)}
        </div>

    )
}