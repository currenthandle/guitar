import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import {
  BOTTOM_PADDING,
  FRET_WIRE_WIDTH,
  NUM_FRET_WIRES,
  NUM_STRINGS,
  NUT_WIDTH,
  STRING_WIDTH,
  TOP_PADDING,
  X_PADDING,
} from '../constant'
import { useControls } from '@/app/components/Header'

type NotePosition = {
  fret: number
  string: number
}

const useFretboard = (
  canvasRef: RefObject<HTMLCanvasElement>,
  coords: { x: number; y: number }
) => {
  const ctx = useRef<CanvasRenderingContext2D | null>(null)
  const fretSpacing = useRef(0)
  const stringSpacing = useRef(0)
  const width = useRef(0)
  const height = useRef(0)
  const notes = useRef<NotePosition[]>([])
  const noteIndex = useRef(0)

  const { animating } = useControls()

  function drawLine(
    ctx: CanvasRenderingContext2D,
    [x1, y1]: [number, number],
    [x2, y2]: [number, number],
    [width, color]: [number, string]
  ) {
    if (!ctx) return
    ctx.lineWidth = width
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  const drawNote = useCallback(
    (note: NotePosition) => {
      if (!ctx.current) return
      const { fret, string } = note
      const x = X_PADDING + (string - 1) * stringSpacing.current
      const y =
        TOP_PADDING + (fret - 1) * fretSpacing.current + fretSpacing.current / 2

      ctx.current.beginPath()
      ctx.current.arc(x, y, fretSpacing.current / 6, 0, 2 * Math.PI)
      ctx.current.fillStyle = 'blue'
      ctx.current.fill()
    },
    [ctx]
  )

  useEffect(() => {
    function drawFrets(
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number
    ) {
      if (!ctx) return
      fretSpacing.current =
        (height - TOP_PADDING - BOTTOM_PADDING) / NUM_FRET_WIRES

      drawLine(
        ctx,
        [X_PADDING - STRING_WIDTH / 2, TOP_PADDING],
        [width - X_PADDING + STRING_WIDTH / 2, TOP_PADDING],
        [NUT_WIDTH, '#000000']
      )

      for (let i = 0; i <= NUM_FRET_WIRES; i++) {
        const y = TOP_PADDING + i * fretSpacing.current
        drawLine(
          ctx,
          [X_PADDING - STRING_WIDTH / 2, y],
          [width - X_PADDING + STRING_WIDTH / 2, y],
          [FRET_WIRE_WIDTH, '#000000']
        )
      }
    }

    function drawStrings(
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number
    ) {
      if (!ctx) return
      stringSpacing.current = (width - 2 * X_PADDING) / (NUM_STRINGS - 1)
      ctx.lineWidth = STRING_WIDTH
      ctx.strokeStyle = '#000000'

      for (let i = 0; i < NUM_STRINGS; i++) {
        const x = X_PADDING + i * stringSpacing.current
        drawLine(
          ctx,
          [x, TOP_PADDING],
          [x, height - BOTTOM_PADDING],
          [STRING_WIDTH, '#000000']
        )
      }
    }
    function paintCanvas() {
      if (!ctx.current) return

      ctx.current.clearRect(0, 0, width.current, height.current)
      drawStrings(ctx.current, width.current, height.current)
      drawFrets(ctx.current, width.current, height.current)
      console.log('animating', animating)
      if (animating) {
        if (noteIndex.current >= notes.current.length) {
          noteIndex.current = 0
        }
        const note = notes.current[noteIndex.current]
        drawNote(note)
        setTimeout(paintCanvas, 1000)
        noteIndex.current++
      } else {
        notes.current.forEach((note) => {
          drawNote({
            fret: note.fret,
            string: note.string,
          })
        })
      }
    }
    const handlePaint = () => {
      if (!canvasRef.current) return
      const canvas = canvasRef.current
      ctx.current = canvas?.getContext('2d')
      if (!ctx.current) return

      const { width: w, height: h } = canvasRef.current.getBoundingClientRect()

      canvas.width = w
      canvas.height = h

      width.current = w
      height.current = h

      paintCanvas()
    }
    handlePaint()

    window.addEventListener('resize', handlePaint)

    return () => {
      window.removeEventListener('resize', handlePaint)
    }
  }, [ctx.current, drawNote, canvasRef, notes, animating])

  function addNote() {
    // if (!ctx) return
    const { x, y } = coords
    const string = Math.round((x - X_PADDING) / stringSpacing.current) + 1
    const fret = Math.floor((y - TOP_PADDING) / fretSpacing.current) + 1
    const newNote = { string, fret }
    drawNote(newNote)
    notes.current = [...notes.current, newNote]
  }

  return addNote
}

export default useFretboard
