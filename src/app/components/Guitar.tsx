'use client'

import { use, useCallback, useEffect, useRef, useState } from 'react'

import useMousePosition from '@/utils/useMousePosition'
import useFretBoard from '@/utils/useFretboard'

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

type NotePosition = {
  fret: number
  string: number
}

type CanvasContext = CanvasDimensions & { ctx: CanvasRenderingContext2D }

// let fretSpacing = 0
// let stringSpacing = 0

// async function drawNote(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {

export default function Guitar() {
  const [coords, handleCoords] = useMousePosition(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  // const [width, setWidth] = useState(0)
  // const [height, setHeight] = useState(0)
  // const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

  // const drawNote = useCallback(
  //   (note: NotePosition) => {
  //     if (!ctx) return
  //     const { fret, string } = note
  //     const x = X_PADDING + (string - 1) * stringSpacing.current
  //     const y =
  //       TOP_PADDING + (fret - 1) * fretSpacing.current + fretSpacing.current / 2

  //     ctx.beginPath()
  //     ctx.arc(x, y, 10, 0, 2 * Math.PI)
  //     ctx.fillStyle = 'blue'
  //     ctx.fill()
  //   },
  //   [ctx]
  // )

  // function drawFrets(
  //   ctx: CanvasRenderingContext2D,
  //   width: number,
  //   height: number
  // ) {
  //   if (!ctx) return
  //   fretSpacing.current =
  //     (height - TOP_PADDING - BOTTOM_PADDING) / NUM_FRET_WIRES
  //   ctx.lineWidth = NUT_WIDTH
  //   ctx.strokeStyle = '#000000'
  //   ctx.beginPath()
  //   ctx.moveTo(X_PADDING - STRING_WIDTH / 2, TOP_PADDING)
  //   ctx.lineTo(width - X_PADDING + STRING_WIDTH / 2, TOP_PADDING)
  //   ctx.stroke()

  //   ctx.lineWidth = FRET_WIRE_WIDTH
  //   ctx.strokeStyle = '#000000'
  //   for (let i = 0; i <= NUM_FRET_WIRES; i++) {
  //     const y = TOP_PADDING + i * fretSpacing.current
  //     ctx.beginPath()
  //     ctx.moveTo(X_PADDING - STRING_WIDTH / 2, y)
  //     ctx.lineTo(width - X_PADDING + STRING_WIDTH / 2, y)
  //     ctx.stroke()
  //   }
  // }

  // function drawStrings(
  //   ctx: CanvasRenderingContext2D,
  //   width: number,
  //   height: number
  // ) {
  //   if (!ctx) return
  //   stringSpacing.current = (width - 2 * X_PADDING) / (NUM_STRINGS - 1)
  //   ctx.lineWidth = STRING_WIDTH
  //   ctx.strokeStyle = '#000000'

  //   for (let i = 0; i < NUM_STRINGS; i++) {
  //     const x = X_PADDING + i * stringSpacing.current
  //     ctx.beginPath()
  //     ctx.moveTo(x, TOP_PADDING)
  //     ctx.lineTo(x, height - BOTTOM_PADDING)
  //     ctx.stroke()
  //   }
  // }
  // useEffect(() => {
  //   function paintCanvas() {
  //     if (!ctx) return

  //     ctx.clearRect(0, 0, width, height)
  //     drawStrings(ctx, width, height)
  //     drawFrets(ctx, width, height)
  //     notes.forEach((note) => {
  //       drawNote({
  //         fret: note.fret,
  //         string: note.string,
  //       })
  //     })
  //   }
  //   const handlePaint = () => {
  //     if (!canvasRef.current) return
  //     const canvas = canvasRef.current
  //     const ctx = canvas?.getContext('2d')
  //     if (!ctx) return

  //     const { width, height } = canvas?.getBoundingClientRect()
  //     canvas.width = width
  //     canvas.height = height
  //     const cvs: CanvasContext = { width, height, ctx }
  //     setWidth(width)
  //     setHeight(height)
  //     setCtx(ctx)

  //     paintCanvas()
  //   }
  //   handlePaint()

  //   window.addEventListener('resize', handlePaint)

  //   return () => {
  //     window.removeEventListener('resize', handlePaint)
  //   }
  // }, [width, height, ctx, notes, drawNote])

  // function addNote() {
  //   if (!ctx) return
  //   const { x, y } = coords
  //   const string = Math.round((x - X_PADDING) / stringSpacing.current) + 1
  //   const fret = Math.floor((y - TOP_PADDING) / fretSpacing.current) + 1
  //   const newNote = { string, fret }
  //   // console.log('new note', newNote)
  //   // drawNote(newNote)
  //   setNotes([...notes, newNote])
  // }
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
