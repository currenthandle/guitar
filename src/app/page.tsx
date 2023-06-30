import Image from 'next/image'
import Guitar from './components/Guitar'

export default function Home() {
  return (
    <main className='flex justify-center bg-green-400 h-screen max-w-screen w-full '>
      <Guitar />
    </main>
  )
}
