import { Link } from "react-router-dom";
import { useReveal, splitWords } from "../lib/useReveal";

// Cópia 100% fiel ao .txt aprovado pelo cliente — página "Nossas Matrizes"

export default function Matrizes() {
  useReveal("matrizes");

  return (
    <main data-testid="matrizes-page" className="prod-page">
      {/* HERO */}
      <section className="prod-hero">
        <div className="shell prod-hero-grid">
          <div className="prod-hero-text">
            <span className="label-mini reveal">Soluções · Matrizaria</span>
            <h1 className="h-hero text-reveal">
              {splitWords(
                "Matrizes para solados e componentes com foco em encaixe e repetibilidade"
              )}
            </h1>
            <p className="body-lg reveal prod-lead">
              Matrizes para solados e componentes de calçados, projetadas para
              garantir encaixe, repetibilidade e estabilidade de processo em
              escala industrial.
            </p>
          </div>
          <div className="prod-hero-feature reveal">
            <img src="/assets/solucoes/Fabrica-Matriz.webp" alt="Matrizes da Gi" loading="lazy" decoding="async" />
            <span className="prod-split-tag">Matrizaria</span>
          </div>
        </div>
      </section>

      {/* BLOCO 1 · ENCAIXE */}
      <section className="section prod-block matrizes-encaixe-hero-bg">
        <div className="shell shell-narrow">
          <h2 className="h-section text-reveal">
            {splitWords("Onde as matrizes da Gi se encaixam melhor")}
          </h2>
          <p className="body-lg reveal mt-md">
            Atendemos diferentes tipos de projetos no setor calçadista e em
            aplicações correlatas.
          </p>
          <ul className="prod-bullets reveal mt-md">
            <li>Solados em EVA e E-TPU (Gi Reboot®).</li>
            <li>Bases e solados de chinelos em EVA.</li>
            <li>Componentes técnicos ligados ao calçado e projetos especiais com maior exigência dimensional.</li>
          </ul>
        </div>
      </section>

      {/* BLOCO 2 · COMO TRABALHAMOS */}
      <section className="section prod-block prod-block--alt">
        <div className="shell shell-narrow">
          <h2 className="h-section text-reveal">
            {splitWords("Como trabalhamos o desenvolvimento de matrizes")}
          </h2>
          <p className="body-lg reveal mt-md">
            O desenvolvimento é conduzido de forma integrada, do desenho
            inicial ao teste em produção, em diálogo com a equipe técnica do
            cliente.
          </p>
          <ul className="prod-bullets reveal mt-md">
            <li>Análise do projeto e das exigências de uso do produto final.</li>
            <li>Modelagem 3D e validação de medidas e encaixes.</li>
            <li>Usinagem com controle de tolerâncias e acabamento para facilitar o processo.</li>
            <li>Ajustes finos e acompanhamento técnico em testes e início de produção.</li>
          </ul>
        </div>
      </section>

      {/* BLOCO 3 · MATRIZ ALINHADA AO SOLADO E AO PROCESSO */}
      <section className="section prod-block matrizes-encaixe-hero-bg matrizes-alinhada-bg">
        <div className="shell shell-narrow">
          <h2 className="h-section text-reveal">
            {splitWords("Matriz alinhada ao solado e ao processo")}
          </h2>
          <p className="body-lg reveal mt-md">
            A matrizaria da Gi está integrada à injeção de solados e ao
            desenvolvimento de compostos, o que reduz retrabalho e aumenta a
            previsibilidade em desenvolvimento.
          </p>
          <ul className="prod-bullets reveal mt-md">
            <li>A mesma equipe que projeta a matriz acompanha o comportamento do solado em produção.</li>
            <li>Ajustes de desenho são feitos com base em dados reais de processo.</li>
            <li>Menos “jogo de empurra” entre fornecedor de matriz, injetora e composto.</li>
          </ul>
        </div>
      </section>

      {/* BLOCO FINAL · CHAMADA ESTRATÉGICA */}
      <section className="section prod-cta">
        <div className="shell shell-narrow text-center">
          <h2 className="h-section text-reveal">
            {splitWords("Quer discutir um novo projeto de matriz?")}
          </h2>
          <p className="body-lg reveal mt-md" style={{ maxWidth: "68ch", margin: "1.2rem auto 2rem" }}>
            Se você está avaliando um novo solado ou componente e precisa
            discutir desenho de matriz, encaixe e requisitos de processo, a
            equipe técnica da Gi pode apoiar da fase de conceito ao início de
            produção.
          </p>
          <Link to="/contato" className="btn-outline reveal" data-testid="matrizes-cta-contato">
            Falar com a equipe técnica
          </Link>
        </div>
      </section>
    </main>
  );
}
