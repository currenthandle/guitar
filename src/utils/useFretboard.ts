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
} from './constant'

type NotePosition = {
  fret: number
  string: number
}

const useFretboard = (
  canvasRef: RefObject<HTMLCanvasElement>,
  coords: { x: number; y: number }
) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [notes, setNotes] = useState<NotePosition[]>([])

  const fretSpacing = useRef(0)
  const stringSpacing = useRef(0)

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

  function drawFrets(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    if (!ctx) return
    fretSpacing.current =
      (height - TOP_PADDING - BOTTOM_PADDING) / NUM_FRET_WIRES
    ctx.lineWidth = NUT_WIDTH
    ctx.strokeStyle = '#000000'
    ctx.beginPath()
    ctx.moveTo(X_PADDING - STRING_WIDTH / 2, TOP_PADDING)
    ctx.lineTo(width - X_PADDING + STRING_WIDTH / 2, TOP_PADDING)
    ctx.stroke()

    ctx.lineWidth = FRET_WIRE_WIDTH
    ctx.strokeStyle = '#000000'
    for (let i = 0; i <= NUM_FRET_WIRES; i++) {
      const y = TOP_PADDING + i * fretSpacing.current
      ctx.beginPath()
      ctx.moveTo(X_PADDING - STRING_WIDTH / 2, y)
      ctx.lineTo(width - X_PADDING + STRING_WIDTH / 2, y)
      ctx.stroke()
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
      ctx.beginPath()
      ctx.moveTo(x, TOP_PADDING)
      ctx.lineTo(x, height - BOTTOM_PADDING)
      ctx.stroke()
    }
  }
  useEffect(() => {
    function paintCanvas() {
      if (!ctx) return

      ctx.clearRect(0, 0, width, height)
      drawStrings(ctx, width, height)
      drawFrets(ctx, width, height)
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

      const { width, height } = canvas?.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
      //   const cvs: CanvasContext = { width, height, ctx }
      setWidth(width)
      setHeight(height)
      setCtx(ctx)

      paintCanvas()
    }
    handlePaint()

    window.addEventListener('resize', handlePaint)

    return () => {
      window.removeEventListener('resize', handlePaint)
    }
  }, [width, height, ctx, drawNote, canvasRef, notes])

  function addNote() {
    console.log('add note')
    if (!ctx) return
    const { x, y } = coords
    const string = Math.round((x - X_PADDING) / stringSpacing.current) + 1
    const fret = Math.floor((y - TOP_PADDING) / fretSpacing.current) + 1
    const newNote = { string, fret }
    // console.log('new note', newNote)
    drawNote(newNote)
    setNotes([...notes, newNote])
  }

  return { addNote }
}

export default useFretboard
