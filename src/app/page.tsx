import Image from 'next/image'
import Guitar from './components/Guitar'
import Header from './components/Header'

export default function Home() {
  return (
    <main className='flex flex-col items-center bg-green-400 h-screen max-w-screen w-full p-8 '>
      <Header />
      <Guitar />
    </main>
  )
}
