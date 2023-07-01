'use client'
import { create } from 'zustand'

type ControlsState = {
  capturing: boolean
  toggleCapturing: () => void
  animating: boolean
  toggleAnimating: () => void
}
export const useControls = create<ControlsState>((set) => ({
  capturing: false,
  toggleCapturing: () => set((state) => ({ capturing: !state.capturing })),
  animating: false,
  toggleAnimating: () => set((state) => ({ animating: !state.animating })),
}))

export default function CaptureButton() {
  const { capturing, toggleCapturing } = useControls()
  return (
    <div>
      <button
        onClick={toggleCapturing}
        className={`p-4 rounded-lg w-24 ${
          capturing ? 'bg-red-500' : 'bg-blue-500'
        }`}
      >
        {capturing ? 'Finish' : 'Capture'}
      </button>
      <button className='bg-orange-400 p-4 w-24 rounded-lg'>Animate</button>
    </div>
  )
}
