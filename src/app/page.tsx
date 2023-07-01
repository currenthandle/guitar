import Image from 'next/image'
import Guitar from './components/Guitar'
import CaptureButton from './components/CaptureButton'

export default function Home() {
  return (
    <main className='flex flex-col items-center bg-green-400 h-screen max-w-screen w-full p-8 '>
      <CaptureButton />
      <Guitar />
    </main>
  )
}
