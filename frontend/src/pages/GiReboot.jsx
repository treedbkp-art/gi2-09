import { Link } from "react-router-dom";
import Viewer3DCarousel from "../components/Viewer3DCarousel";
import { useReveal, splitWords } from "../lib/useReveal";

const CALCADOS = [
  "Tênis esportivos e casuais de alta performance",
  "Calçados infantis com uso intenso",
  "Linhas premium e de posicionamento tecnológico",
];

const INDUSTRIAL = [
  "Rodas, rodízios e carrinhos que precisam absorver impacto e reduzir ruído",
  "Brinquedos e acessórios esportivos",
  "Outros projetos industriais com impacto controlado e resistência à fadiga",
];

const INDUSTRIAL_IMGS = [
  { img: "/aplicacoes/carrinho.jpg", label: "Rodas & rodízios", text: "Absorção de impacto e redução de ruído em carrinhos, rodas e rodízios." },
  { img: "/aplicacoes/bola.jpg", label: "Esportes & brinquedos", text: "Núcleo em E-TPU dá vida a bolas, brinquedos e acessórios esportivos." },
  { img: "/aplicacoes/bike.jpg", label: "Indústria & mobilidade", text: "Componentes industriais com impacto controlado e alta resistência à fadiga." },
];

const COMBINAR = [
  "Mantém o custo competitivo do EVA na maior parte do produto.",
  "Aplica E-TPU em regiões de maior impacto ou conforto decisivo.",
  "Aumenta a percepção de valor com componente de alta performance.",
  "Permite ajustar o nível de performance por linha ou modelo, sem mudar toda a plataforma.",
];

export default function GiReboot() {
  useReveal("gi-reboot");

  return (
    <main data-testid="gi-reboot-page">
      {/* SEÇÃO 1 — HERO / INTRODUÇÃO */}
      <section className="reboot-hero reboot-hero--runner">
        <div className="reboot-hero-media" aria-hidden="true">
          <video
            className="reboot-hero-video"
            src="/assets/gi-reboot/hero-video.mp4"
            poster="/assets/gi-reboot/hero-runner.jpeg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>
        <div className="reboot-hero-veil" aria-hidden="true" />

        <div className="shell reboot-hero-grid">
          <div>
            <img
              src="/assets/gi-reboot/logo-gi-reboot.png"
              alt="Gi Reboot®"
              className="reboot-hero-logo reveal"
            />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — ONDE O GI REBOOT® FAZ MAIS DIFERENÇA */}
      <section className="section section--video-bg" id="aplicacoes">
        <video
          className="section-video-bg"
          src="/spheres-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="section-video-overlay" aria-hidden="true" />
        <div className="shell" style={{ position: "relative", zIndex: 2 }}>
          <h2 className="h-section text-reveal" style={{ maxWidth: "32ch" }}>
            {splitWords("Onde o Gi Reboot® faz mais diferença")}
          </h2>
          <p className="body-lg reveal mt-lg" style={{ maxWidth: "70ch", color: "var(--cor-texto-muted)" }}>
            Para projetos em que conforto percebido, retorno de energia e
            durabilidade são decisivos.
          </p>

          <div className="stacked-panels mt-xl">
            <div className="panel panel--full panel--split reveal" data-testid="panel-calcados">
              <div className="panel-content">
                <h4>Em calçados</h4>
                <ul>
                  {CALCADOS.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
              <div className="panel-video-wrap">
                <video
                  className="panel-video"
                  src="/take5.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="panel panel--full panel--industrial reveal" data-testid="panel-outros-componentes">
              <h4>Em outros componentes</h4>
              <div className="industrial-grid">
                {INDUSTRIAL_IMGS.map((it, i) => (
                  <figure key={i} className="industrial-card">
                    <div className="industrial-card-media">
                      <img src={it.img} alt={it.label} loading="lazy" />
                    </div>
                    <figcaption>
                      <span className="industrial-card-tag">{it.label}</span>
                      <p>{it.text}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — SOLADOS EM E-TPU Gi Reboot® */}
      <section className="section reboot-solados-section">
        <div className="reboot-solados-bg" aria-hidden="true" />
        <div className="shell" style={{ position: "relative", zIndex: 2 }}>
          <div className="prod-wide-canvas">
            <h2 className="h-section text-reveal prod-wide-title reboot-solados-title">
              {splitWords("Solados em E-TPU Gi Reboot®")}
            </h2>
            <div className="reveal prod-wide-3d reboot-hero-viewer reboot-hero-viewer--dark" data-testid="gi-reboot-3d-carousel">
              <Viewer3DCarousel
                showCatalogLink={false}
                items={[
                  { url: "/assets/3d/GI014.glb", label: "GI014" },
                  { url: "/assets/3d/GI015.glb", label: "GI015" },
                  { url: "/assets/3d/GI019.glb", label: "GI019" },
                  { url: "/assets/3d/GI020.glb", label: "GI020" },
                ]}
              />
            </div>
            <div className="prod-wide-cols">
              <div className="prod-wide-col">
                <p className="body-lg reveal">
                  O Gi Reboot® é o E-TPU da Gi: solados e componentes com alto
                  retorno de energia, estabilidade dimensional e comportamento
                  consistente em produção.
                </p>
                <a href="/contato" className="viewer-catalog-link prod-wide-catalog reveal" data-cursor="Ver catálogo">
                  Ver nosso catálogo completo
                </a>
              </div>
              <div className="prod-wide-col">
                <p className="body-lg reveal">
                  Indicado para linhas que exigem durabilidade, resiliência e
                  conforto em diferentes condições de uso, atendendo marcas que
                  querem elevar o nível de desempenho dos seus produtos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO INTERMEDIÁRIA — Infográfico Versatilidade */}
      <section className="section versatilidade-section" data-testid="versatilidade-section">
        <div className="shell">
          <figure className="versatilidade-figure reveal">
            <img
              src="/versatilidade.jpg"
              alt="Versatilidade que impulsiona inovação — 8 aplicações do Gi Reboot® eTPU"
              className="versatilidade-img"
              loading="lazy"
              data-testid="versatilidade-img"
            />
          </figure>
        </div>
      </section>

      {/* SEÇÃO 4 — Gi Reboot® E EVA TRABALHANDO JUNTOS */}
      <section className="section reboot-together-section">
        <div className="reboot-together-bg" aria-hidden="true">
          <div className="meteor-layer">
            <span className="meteor meteor--1" />
            <span className="meteor meteor--2" />
            <span className="meteor meteor--3" />
            <span className="meteor meteor--4" />
            <span className="meteor meteor--5" />
            <span className="meteor meteor--6" />
            <span className="meteor meteor--7" />
            <span className="meteor meteor--8" />
          </div>
        </div>
        <div className="shell" style={{ position: "relative", zIndex: 2 }}>
          <h2 className="h-section text-reveal reboot-together-title" style={{ maxWidth: "26ch" }}>
            {splitWords("Gi Reboot® e EVA trabalhando juntos")}
          </h2>
          <p className="body-lg reveal mt-lg reboot-together-lead" style={{ maxWidth: "76ch" }}>
            Em muitos projetos, o Gi Reboot® é aplicado em conjunto com o EVA:
            o EVA segue como base versátil e competitiva; o E-TPU entra em
            pontos estratégicos para elevar conforto e performance.
          </p>

          <ul className="manifesto-list reveal mt-xl reboot-together-list" style={{ maxWidth: "78ch" }}>
            {COMBINAR.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      </section>

      {/* SEÇÃO 5 — CHAMADA ESTRATÉGICA */}
      <section className="final-cta section">
        <div className="shell final-cta-inner">
          <h2 className="h-section text-reveal" style={{ maxWidth: "34ch" }}>
            {splitWords("Quer avaliar Gi Reboot® no seu próximo projeto?")}
          </h2>
          <p className="body-lg reveal" style={{ textAlign: "center", maxWidth: "72ch" }}>
            Nossa equipe técnica pode apoiar na definição de aplicação, desenho
            de peça e requisitos de processo para solados em E-TPU e outros
            componentes.
          </p>
          <div className="reveal">
            <Link to="/contato" className="btn-big" data-cursor="Conversar">
              Falar com a equipe técnica <span aria-hidden>→</span>
            </Link>
          </div>
          <p className="body-md reveal" style={{ marginTop: "1.4rem", color: "var(--cor-texto-muted)", textAlign: "center" }}>
            Prefere falar direto com o time?<br />
            E-mail: <a href="mailto:contato@giinovacoes.com.br">contato@giinovacoes.com.br</a> · Telefone: <a href="tel:+555135436151">+55 (51) 3543.6151</a>
          </p>
        </div>
      </section>
    </main>
  );
}
