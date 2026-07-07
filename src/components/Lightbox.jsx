import { useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * Full-screen image lightbox — the image fills the entire viewport (contained,
 * never cropped); all controls float on top.
 * - click backdrop or ✕ to close
 * - ← / → (buttons, arrow keys, or swipe) to scroll through images
 * - thumbnail strip to jump to any image
 * Controlled: parent owns `index` and open state (open when index !== null).
 */
export default function Lightbox({ images = [], index, caption, accent = '#6c5ce7', onClose, onChange }) {
  const open = index !== null && index !== undefined
  const touchX = useRef(null)

  const go = useCallback(
    (dir) => {
      if (!open) return
      const next = (index + dir + images.length) % images.length
      onChange(next)
    },
    [open, index, images.length, onChange],
  )

  // Keyboard controls + body scroll lock while open
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, go, onClose])

  if (!open) return null

  const onTouchStart = (e) => (touchX.current = e.touches[0].clientX)
  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  const multiple = images.length > 1

  // Portal to <body> so a transformed ancestor (e.g. the Reveal wrapper) can't
  // trap `position: fixed` — the overlay must cover the whole browser window.
  return createPortal(
    <div
      className="fixed inset-0 z-[200] bg-black/95"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Image fills the whole screen (contained, no crop) */}
      <img
        src={images[index]}
        alt={`${caption ? caption + ' ' : ''}screenshot ${index + 1}`}
        className="absolute inset-0 h-full w-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Top bar (floats over image) */}
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-between bg-linear-to-b from-black/70 to-transparent px-5 py-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sm font-medium text-white/80">
          {caption && <span className="text-white">{caption} · </span>}
          {index + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-xl leading-none transition-colors hover:bg-white/30"
        >
          ✕
        </button>
      </div>

      {/* Prev / next arrows */}
      {multiple && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); go(-1) }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-3xl text-white transition-colors hover:bg-white/30 sm:left-6"
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); go(1) }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-3xl text-white transition-colors hover:bg-white/30 sm:right-6"
          >
            ›
          </button>
        </>
      )}

      {/* Thumbnail strip (floats over image bottom) */}
      {multiple && (
        <div
          className="absolute inset-x-0 bottom-0 flex justify-center gap-2.5 overflow-x-auto bg-linear-to-t from-black/70 to-transparent px-5 pb-4 pt-10"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => onChange(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`h-14 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                i === index ? '' : 'border-transparent opacity-50 hover:opacity-90'
              }`}
              style={i === index ? { borderColor: accent } : undefined}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  )
}
