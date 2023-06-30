'use client'

import { useEffect, useRef } from 'react'

const NUM_STRINGS = 6
const STRING_WIDTH = 2

type CanvasDimensions = {
  width: number
  height: number
}

type CanvasContext = CanvasDimensions & { ctx: CanvasRenderingContext2D }

function drawStrings({ ctx, height, width }: CanvasContext) {
  const stringSpacing = width / (NUM_STRINGS - 1)
  ctx.lineWidth = STRING_WIDTH
  ctx.strokeStyle = '#000000'

  for (let i = 0; i < NUM_STRINGS; i++) {
    const x = i * stringSpacing

    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
}

function paintCanvas({ ctx, height, width }: CanvasContext) {
  ctx.clearRect(0, 0, width, height)
  drawStrings({ ctx, width, height })
}

export default function Guitar() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const handlePaint = () => {
      if (!canvasRef.current) return
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!ctx) return

      const { width, height } = canvas?.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
      const cvs: CanvasContext = { width, height, ctx }
      paintCanvas(cvs)
    }
    handlePaint()

    window.addEventListener('resize', handlePaint)

    return () => {
      window.removeEventListener('resize', handlePaint)
    }
  }, [])
  return (
    <canvas
      id='guitar'
      ref={canvasRef}
      className='border-box w-full bg-white'
    />
  )
}
