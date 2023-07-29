import { useState } from "react"
import { account, addAccount } from "../services/database"

export default function NewAccount({ closeCallback }: { closeCallback: () => void }) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    function handleNameChange(event) {
        setName(event.target.value)
    }

    function handleDescriptionChange(event) {
        setDescription(event.target.value)
    }

    function handleAddAccount(event) {
        event.preventDefault()
        const account: account = {
            id: name,
            name: description
        }
        addAccount(account)
        setName("")
        setDescription("")
        closeCallback()
    }

    return (
        <div className="fill-screen">
            <div className="modal">
                <h1>Konto erstellen</h1>
                <form onSubmit={handleAddAccount}>
                    <label htmlFor="name">
                        Name
                    </label>
                    <input type="text" name="name" value={name} onChange={handleNameChange} />
                    <label htmlFor="description">
                        Beschreibung
                    </label>
                    <input type="text" name="description" value={description} onChange={handleDescriptionChange} />
                    <span className="buttons">
                        <button className="primary" type="submit">Speichern</button>
                        <button className="abort" onClick={closeCallback}>Abbrechen</button>
                    </span>
                </form>
            </div>
        </div>
    )
}