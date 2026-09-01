import { useState, useCallback } from "react";
import Viewer3D from "./Viewer3D";

/**
 * Viewer3DCarousel
 * Setas alinhadas com os dots na barra inferior.
 */
export default function Viewer3DCarousel({ items = [], catalogUrl = "/contato", showCatalogLink = true }) {
  const [idx, setIdx] = useState(0);
  const total = items.length;
  const current = items[idx] || items[0];

  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total]);
  const prev = useCallback(
    () => setIdx((i) => (i - 1 + total) % total),
    [total]
  );

  if (!current) return null;

  return (
    <div className="viewer-carousel-wrap">
      <div className="viewer-carousel-layout">
        <div className="viewer-carousel" data-testid="viewer-carousel">
        <Viewer3D
          key={current.url}
          label={current.label}
          modelUrl={current.url}
        />

      {/* Barra inferior: seta · dots · seta */}
      <div className="viewer-navbar" aria-hidden="false">
        <button
          type="button"
          className="viewer-nav viewer-nav--prev"
          onClick={prev}
          aria-label="Modelo anterior"
          data-testid="viewer-prev"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="viewer-dots" aria-hidden="true">
          {items.map((it, i) => (
            <button
              key={it.url}
              type="button"
              className={`viewer-dot ${i === idx ? "is-active" : ""}`}
              onClick={() => setIdx(i)}
              aria-label={`Ver ${it.label}`}
              data-testid={`viewer-dot-${i}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="viewer-nav viewer-nav--next"
          onClick={next}
          aria-label="Próximo modelo"
          data-testid="viewer-next"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
        </div>

        {/* Lista clicável de modelos ao lado do canvas */}
        <aside className="viewer-model-list" aria-label="Lista de modelos">
          <div className="viewer-model-list__header">
            <span className="viewer-model-list__eyebrow">Modelos</span>
            <span className="viewer-model-list__count">
              {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
          <ul className="viewer-model-list__items" role="listbox">
            {items.map((it, i) => (
              <li key={it.url} role="option" aria-selected={i === idx}>
                <button
                  type="button"
                  className={`viewer-model-item ${i === idx ? "is-active" : ""}`}
                  onClick={() => setIdx(i)}
                  data-cursor={`Ver ${it.label}`}
                  data-testid={`viewer-model-item-${i}`}
                >
                  <span className="viewer-model-item__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="viewer-model-item__name">{it.label}</span>
                  <span className="viewer-model-item__arrow" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* Link para catálogo completo */}
      {showCatalogLink && (
        <a
          href={catalogUrl}
          className="viewer-catalog-link"
          data-cursor="Ver catálogo"
          data-testid="viewer-catalog-link"
        >
          Ver nosso catálogo completo
        </a>
      )}
    </div>
  );
}
