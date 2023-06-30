'use client'

import { useEffect, useRef } from 'react'

const NUM_STRINGS = 6
const NUM_FRET_WIRES = 14

const STRING_WIDTH = 2
const FRET_WIRE_WIDTH = 6
const NUT_WIDTH = 10

const X_PADDING = 50
const TOP_PADDING = 50
const BOTTOM_PADDING = 30

type CanvasDimensions = {
  width: number
  height: number
}

type CanvasContext = CanvasDimensions & { ctx: CanvasRenderingContext2D }

let fretSpacing = 0
let stringSpacing = 0

function drawFrets({ ctx, height, width }: CanvasContext) {
  fretSpacing = (height - TOP_PADDING - BOTTOM_PADDING) / NUM_FRET_WIRES
  ctx.lineWidth = NUT_WIDTH
  ctx.strokeStyle = '#000000'
  ctx.beginPath()
  ctx.moveTo(X_PADDING - STRING_WIDTH / 2, TOP_PADDING)
  ctx.lineTo(width - X_PADDING + STRING_WIDTH / 2, TOP_PADDING)
  ctx.stroke()

  ctx.lineWidth = FRET_WIRE_WIDTH
  ctx.strokeStyle = '#000000'
  for (let i = 0; i <= NUM_FRET_WIRES; i++) {
    const y = TOP_PADDING + i * fretSpacing
    ctx.beginPath()
    ctx.moveTo(X_PADDING - STRING_WIDTH / 2, y)
    ctx.lineTo(width - X_PADDING + STRING_WIDTH / 2, y)
    ctx.stroke()
  }
}

function drawStrings({ ctx, height, width }: CanvasContext) {
  stringSpacing = (width - 2 * X_PADDING) / (NUM_STRINGS - 1)
  ctx.lineWidth = STRING_WIDTH
  ctx.strokeStyle = '#000000'

  for (let i = 0; i < NUM_STRINGS; i++) {
    const x = X_PADDING + i * stringSpacing
    ctx.beginPath()
    ctx.moveTo(x, TOP_PADDING)
    ctx.lineTo(x, height - BOTTOM_PADDING)
    ctx.stroke()
  }
}

function paintCanvas({ ctx, height, width }: CanvasContext) {
  ctx.clearRect(0, 0, width, height)
  drawStrings({ ctx, width, height })
  drawFrets({ ctx, width, height })
}

function drawNote() {
  console.log('drawNote')
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
      className='border-box w-7/12 bg-white'
      onMouseDown={drawNote}
    />
  )
}
