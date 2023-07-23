import Image from 'next/image'
import styles from './page.module.css'

export default function Home({ params }: { params: { state: any; } }) {
  return (
    <>
      <h1>Hello, World!</h1>
      <span>{params.state}</span>
    </>
  )
}
