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
    }

    return (
        <>
            <h1>Konto erstellen</h1>
            <form onSubmit={handleAddAccount}>
                <label>
                    Name
                    <input type="text" value={name} onChange={handleNameChange}></input>
                </label>
                <label>
                    Beschreibung
                    <input type="text" value={description} onChange={handleDescriptionChange}></input>
                </label>
                <button type="submit">Speichern</button>
                <button className="abort" onClick={closeCallback}>Abbrechen</button>
            </form>
        </>
    )
}