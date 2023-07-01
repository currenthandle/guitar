import {
  BOTTOM_PADDING,
  FRET_WIRE_WIDTH,
  NUM_FRET_WIRES,
  NUM_STRINGS,
  NUT_WIDTH,
  STRING_WIDTH,
  TOP_PADDING,
  X_PADDING,
} from '@/utils/constant'

export type NotePosition = {
  fret: number
  string: number
}

export function drawFrets(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fretSpacing: React.MutableRefObject<number>
) {
  console.log('drawFrets')
  if (!ctx) return
  fretSpacing.current = (height - TOP_PADDING - BOTTOM_PADDING) / NUM_FRET_WIRES
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

export function drawStrings(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stringSpacing: React.MutableRefObject<number>
) {
  console.log('drawStrings')
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

export function paintCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stringSpacing: React.MutableRefObject<number>,
  fretSpacing: React.MutableRefObject<number>,
  notes: { fret: number; string: number }[]
) {
  console.log('paintCanvas')
  if (!ctx) return

  ctx.clearRect(0, 0, width, height)
  drawStrings(ctx, width, height, stringSpacing)
  drawFrets(ctx, width, height, fretSpacing)
  notes.forEach((note) => {
    drawNote(ctx, stringSpacing, fretSpacing, {
      fret: note.fret,
      string: note.string,
    })
  })
}

export function drawNote(
  ctx: CanvasRenderingContext2D,
  stringSpacing: React.MutableRefObject<number>,
  fretSpacing: React.MutableRefObject<number>,
  note: NotePosition
) {
  console.log('drawNote')
  if (!ctx) return
  const { fret, string } = note
  const x = X_PADDING + (string - 1) * stringSpacing.current
  const y =
    TOP_PADDING + (fret - 1) * fretSpacing.current + fretSpacing.current / 2

  ctx.beginPath()
  ctx.arc(x, y, 10, 0, 2 * Math.PI)
  ctx.fillStyle = 'blue'
  ctx.fill()
}
