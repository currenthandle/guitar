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

type NotePosition = {
  fret: number
  string: number
}

const useFretboard = (
  canvasRef: RefObject<HTMLCanvasElement>,
  coords: { x: number; y: number }
) => {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [notes, setNotes] = useState<NotePosition[]>([])

  const fretSpacing = useRef(0)
  const stringSpacing = useRef(0)
  const width = useRef(0)
  const height = useRef(0)

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
      if (!ctx) return
      const { fret, string } = note
      const x = X_PADDING + (string - 1) * stringSpacing.current
      const y =
        TOP_PADDING + (fret - 1) * fretSpacing.current + fretSpacing.current / 2

      ctx.beginPath()
      ctx.arc(x, y, fretSpacing.current / 6, 0, 2 * Math.PI)
      ctx.fillStyle = 'blue'
      ctx.fill()
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
      if (!ctx) return

      ctx.clearRect(0, 0, width.current, height.current)
      drawStrings(ctx, width.current, height.current)
      drawFrets(ctx, width.current, height.current)
      notes.forEach((note) => {
        drawNote({
          fret: note.fret,
          string: note.string,
        })
      })
    }
    const handlePaint = () => {
      if (!canvasRef.current) return
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!ctx) return

      const { width: w, height: h } = canvasRef.current.getBoundingClientRect()

      canvas.width = w
      canvas.height = h

      width.current = w
      height.current = h

      setCtx(ctx)
      paintCanvas()
    }
    handlePaint()

    window.addEventListener('resize', handlePaint)

    return () => {
      window.removeEventListener('resize', handlePaint)
    }
  }, [ctx, drawNote, canvasRef, notes])

  function addNote() {
    if (!ctx) return
    const { x, y } = coords
    const string = Math.round((x - X_PADDING) / stringSpacing.current) + 1
    const fret = Math.floor((y - TOP_PADDING) / fretSpacing.current) + 1
    const newNote = { string, fret }
    drawNote(newNote)
    setNotes([...notes, newNote])
  }

  return addNote
}

export default useFretboard
