import { useEffect, useRef } from 'react'

export default function LoadingScreen({ onDone }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = null
    let t0 = null
    const TOTAL = 10000

    function resize() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const W = () => canvas.width
    const H = () => canvas.height

    function ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t }
    function easeOut(t) { return 1 - Math.pow(1-t, 3) }
    function lerp(a, b, t) { return a + (b-a)*t }

    function segLerp(p, segments) {
      for (let i = 0; i < segments.length - 1; i++) {
        const [p0, x0, y0] = segments[i]
        const [p1, x1, y1] = segments[i+1]
        if (p >= p0 && p <= p1) {
          const t = ease((p - p0) / (p1 - p0))
          return { x: lerp(x0, x1, t), y: lerp(y0, y1, t) }
        }
      }
      const last = segments[segments.length-1]
      return { x: last[1], y: last[2] }
    }

    function spotAt(p) {
      const w = W(), h = H(), cx = w/2, cy = h/2
      const segs = [
        [0.00, w*0.08, h*0.12],
        [0.07, w*0.88, h*0.08],
        [0.13, w*0.72, h*0.82],
        [0.19, w*0.05, h*0.65],
        [0.25, w*0.55, h*0.10],
        [0.31, w*0.92, h*0.45],
        [0.37, w*0.18, h*0.30],
        [0.43, w*0.80, h*0.70],
        [0.49, w*0.12, h*0.88],
        [0.55, w*0.65, h*0.20],
        [0.61, w*0.30, h*0.55],
        [0.67, cx,     cy    ],
      ]
      if (p <= 0.67) {
        const { x, y } = segLerp(p, segs)
        return { x, y, r: 72, phase: 'search' }
      } else if (p <= 0.80) {
        const t = easeOut((p - 0.67) / 0.13)
        return { x: cx, y: cy, r: lerp(72, 185, t), phase: 'expand' }
      } else {
        const t = easeOut((p - 0.80) / 0.20)
        return { x: cx, y: cy, r: lerp(185, Math.hypot(w, h), t), phase: 'zoom' }
      }
    }

    function draw(ts) {
      if (!t0) t0 = ts
      const elapsed = ts - t0
      const p = Math.min(elapsed / TOTAL, 1)
      const w = W(), h = H(), cx = w/2, cy = h/2
      const fontSize = Math.min(w * 0.28, 140)

      ctx.clearRect(0, 0, w, h)

      const { x, y, r, phase } = spotAt(p)

      if (phase === 'search' || phase === 'expand') {
        ctx.fillStyle = '#fff'
        ctx.font = `900 ${fontSize}px Arial Black, Arial, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('RAW', cx, cy)

        ctx.fillStyle = 'rgba(0,0,0,1)'
        ctx.beginPath()
        ctx.rect(0, 0, w, h)
        ctx.arc(x, y, r, 0, Math.PI*2, true)
        ctx.fill('evenodd')

        const inner = r * 0.45
        const grad = ctx.createRadialGradient(x, y, inner, x, y, r * 1.1)
        grad.addColorStop(0, 'rgba(0,0,0,0)')
        grad.addColorStop(1, 'rgba(0,0,0,0.85)')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)

        if (phase === 'expand') {
          const ft = (p - 0.67) / 0.13
          ctx.fillStyle = `rgba(255,255,255,${ft * 0.22})`
          ctx.font = `300 ${Math.min(w*0.04, 18)}px Arial, sans-serif`
          ctx.letterSpacing = '7px'
          ctx.fillText('VISION MEDIA CLUB · MPTP SHIRPUR', cx, cy + fontSize * 0.56 + 26)
          ctx.letterSpacing = '0px'
        }

      } else {
        const t = easeOut((p - 0.80) / 0.20)
        const scale = 1 + t * 10
        const alpha = Math.max(0, 1 - t * 1.5)

        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(scale, scale)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.font = `900 ${fontSize}px Arial Black, Arial, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('RAW', 0, 0)
        ctx.restore()

        const subAlpha = Math.max(0, 0.22 - t * 0.5)
        if (subAlpha > 0) {
          ctx.fillStyle = `rgba(255,255,255,${subAlpha})`
          ctx.font = `300 ${Math.min(w*0.04, 18)}px Arial, sans-serif`
          ctx.letterSpacing = '7px'
          ctx.fillText('VISION MEDIA CLUB · MPTP SHIRPUR', cx, cy + fontSize * 0.56 + 26)
          ctx.letterSpacing = '0px'
        }

        if (t > 0.6) {
          const wt = (t - 0.6) / 0.4
          ctx.fillStyle = `rgba(255,255,255,${easeOut(wt)})`
          ctx.fillRect(0, 0, w, h)
        }
      }

      if (p < 1) {
        raf = requestAnimationFrame(draw)
      } else {
        onDone()
      }
    }

    raf = requestAnimationFrame(draw)

    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      zIndex: 9999,
    }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}