'use client'
import { create } from 'zustand'

type CaptureState = {
  capturing: boolean
  toggleCapturing: () => void
}
const useCapture = create<CaptureState>((set) => ({
  capturing: false,
  toggleCapturing: () => set((state) => ({ capturing: !state.capturing })),
}))

export default function CaptureButton() {
  const { capturing, toggleCapturing } = useCapture()
  return (
    <button
      onClick={toggleCapturing}
      className={`p-4 rounded-lg w-24 ${
        capturing ? 'bg-red-500' : 'bg-blue-500'
      }`}
    >
      {capturing ? 'Finish' : 'Capture'}
    </button>
  )
}
