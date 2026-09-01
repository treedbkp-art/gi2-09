import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const SOLUCOES_LINKS = [
  { label: "Solados em EVA",        to: "/eva#solados-em-eva" },
  { label: "Chinelos em EVA",       to: "/eva#chinelos-em-eva" },
  { label: "Gi Reboot® (E-TPU)",    to: "/gi-reboot" },
  { label: "Compostos em EVA",      to: "/eva#compostos-em-eva" },
  { label: "Matrizes",              to: "/matrizes" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solucoesOpen, setSolucoesOpen] = useState(false);
  const solucoesRef = useRef(null);
  const closeTimer = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isHome = location.pathname === "/";
    const onScroll = () => {
      if (isHome) {
        // No home, o nav só vira "scrolled" depois do pin do hero ser liberado
        // (controlado pela classe body.hero-immersive — vide Home.jsx)
        const heroPinned = document.body.classList.contains("hero-immersive");
        setScrolled(!heroPinned && window.scrollY > 40);
      } else {
        setScrolled(window.scrollY > 40);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    // observa mudanças na classe do body (hero-immersive entra/sai)
    const mo = new MutationObserver(onScroll);
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => {
      window.removeEventListener("scroll", onScroll);
      mo.disconnect();
    };
  }, [location.pathname]);

  // Close menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setSolucoesOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    if (!solucoesOpen) return;
    const onDocClick = (e) => {
      if (solucoesRef.current && !solucoesRef.current.contains(e.target)) {
        setSolucoesOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [solucoesOpen]);

  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setSolucoesOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setSolucoesOpen(false), 180);
  };

  return (
    <>
      <header
        className={`gi-nav ${scrolled ? "scrolled" : ""} ${
          location.pathname === "/gi-reboot" && !scrolled ? "gi-nav--hero-dark" : ""
        }`}
        data-testid="gi-nav"
      >
        <Link
          to="/"
          className="gi-logo"
          data-cursor="Início"
          data-testid="nav-logo"
        >
          <span className="gi-logo-stack">
            <img
              src="/brand/logo-mark.png"
              alt="Gi Inovações"
              className="gi-logo-mark gi-logo-mark--default"
            />
            <img
              src="/brand/logo-mark.png"
              alt=""
              aria-hidden="true"
              className="gi-logo-mark gi-logo-mark--white"
            />
          </span>
        </Link>

        <nav>
          <ul className="gi-nav-links">
            <li><NavLink to="/empresa" data-testid="nav-empresa">Empresa</NavLink></li>
            <li><NavLink to="/gi-reboot" data-testid="nav-reboot">Gi Reboot<sup>®</sup></NavLink></li>
            <li
              className={`has-dropdown ${solucoesOpen ? "open" : ""}`}
              ref={solucoesRef}
              onMouseEnter={openDropdown}
              onMouseLeave={scheduleClose}
              data-testid="nav-solucoes-wrap"
            >
              <button
                type="button"
                className="nav-dropdown-trigger"
                aria-haspopup="true"
                aria-expanded={solucoesOpen}
                onClick={() => {
                  setSolucoesOpen(false);
                  navigate("/eva");
                }}
                data-testid="nav-solucoes-trigger"
              >
                Soluções
                <svg
                  className="caret"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  aria-hidden="true"
                >
                  <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div
                className="nav-dropdown"
                role="menu"
                aria-hidden={!solucoesOpen}
                onMouseEnter={openDropdown}
                onMouseLeave={scheduleClose}
              >
                <ul>
                  {SOLUCOES_LINKS.map((item, i) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        onClick={() => setSolucoesOpen(false)}
                        data-testid={`nav-solucao-${i + 1}`}
                      >
                        <span className="num">0{i + 1}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </nav>

        <div className="gi-nav-right">
          <Link to="/contato" className="btn-outline btn-outline-compact" data-testid="nav-cta">
            Fale conosco
          </Link>
          <button
            className={`hamburger ${mobileOpen ? "open" : ""}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            data-testid="hamburger"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div
        className={`mobile-menu ${mobileOpen ? "open" : ""}`}
        data-testid="mobile-menu"
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-menu-inner">
          <span className="mobile-menu-label">Menu · Gi Inovações</span>
          <nav>
            <NavLink to="/" end onClick={() => setMobileOpen(false)}>
              <span className="num">01</span> Home
            </NavLink>
            <NavLink to="/empresa" onClick={() => setMobileOpen(false)}>
              <span className="num">02</span> Empresa
            </NavLink>
            <NavLink to="/gi-reboot" onClick={() => setMobileOpen(false)}>
              <span className="num">03</span> Gi Reboot<sup>®</sup>
            </NavLink>
            <span className="mobile-section-label">Soluções</span>
            {SOLUCOES_LINKS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="mobile-sub"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/contato"
            className="btn-big mobile-menu-cta"
            onClick={() => setMobileOpen(false)}
          >
            Fale com a Gi <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </>
  );
}
