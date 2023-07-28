'use client'

import Image from 'next/image'
import home from '../../public/home.svg'
import transactions from '../../public/transactions.svg'
import accounts from '../../public/accounts.svg'

function NavItem({ name, icon, onClick }: { name: string, icon: any, onClick: () => void}) {
    return (
        <button className="nav-item"><Image src={icon} alt={name} onClick={onClick}/></button>
    )
}

export function NavBar({ navHome, navTransactions, navAccounts }
                    : { navHome:() => void, navTransactions:() => void, navAccounts:() => void }) {
    return (
        <footer>
            <div className="nav-bar">
                <NavItem name="home" icon={home} onClick={navHome} />
                <NavItem name="transactions" icon={transactions} onClick={navTransactions} />
                <NavItem name="accounts" icon={accounts} onClick={navAccounts} />
            </div>
        </footer>
    )
}