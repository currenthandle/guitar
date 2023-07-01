'use client'

import useMousePosition from '@/utils/hooks/useMousePosition'
import useFretBoard from '@/utils/hooks/useFretboard'
import { useRef } from 'react'

export default function Guitar() {
  const [coords, handleCoords] = useMousePosition(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { addNote } = useFretBoard(canvasRef, coords)
  return (
    <canvas
      onMouseMove={(e) => {
        handleCoords(e as unknown as MouseEvent)
      }}
      onMouseDown={(e) => {
        if (canvasRef.current) {
          const canvas = canvasRef.current
          const ctx = canvas?.getContext('2d')
          addNote()
        }
      }}
      id='guitar'
      ref={canvasRef}
      className='border-box w-7/12 bg-white'
    />
  )
}
