import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getArticle, listArticles, resolveMediaUrl } from "../lib/api";
import { renderMarkdown } from "../lib/markdown";
import { useReveal, splitWords } from "../lib/useReveal";

function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

export default function ArtigoDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Re-run reveal after article loads (dynamic content)
  useReveal(article?.id || slug || "artigo-load");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const [a, all] = await Promise.all([getArticle(slug), listArticles()]);
        if (!alive) return;
        setArticle(a);
        setRelated((all || []).filter((x) => x.slug !== slug).slice(0, 3));
      } catch (err) {
        if (alive) setNotFound(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [slug]);

  const html = useMemo(() => renderMarkdown(article?.content || ""), [article]);

  if (loading) {
    return (
      <main className="page page-artigo">
        <section className="section"><div className="shell"><p className="body-md" style={{ color: "var(--cor-texto-muted)" }}>Carregando…</p></div></section>
      </main>
    );
  }
  if (notFound || !article) {
    return (
      <main className="page page-artigo">
        <section className="section">
          <div className="shell">
            <h1 className="h-section">Artigo não encontrado</h1>
            <p className="body-md" style={{ color: "var(--cor-texto-muted)" }}>
              O artigo que você tentou acessar não está disponível.
            </p>
            <div className="reveal mt-lg">
              <button onClick={() => navigate("/artigos")} className="btn-big" data-cursor="Voltar">
                Ver todos os artigos <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page page-artigo">
      <article className="artigo-post">
        <header className="section artigo-post-header">
          <div className="shell shell-narrow">
            <div className="artigo-post-breadcrumbs reveal">
              <Link to="/">Início</Link>
              <span aria-hidden> / </span>
              <Link to="/artigos">Artigos</Link>
            </div>
            {article.category ? (
              <span className="eyebrow reveal" style={{ marginTop: ".8rem" }}>{article.category}</span>
            ) : null}
            <h1 className="h-hero text-reveal" style={{ maxWidth: "28ch" }}>
              {splitWords(article.title)}
            </h1>
            {article.excerpt ? (
              <p className="body-lg reveal" style={{ maxWidth: "70ch", color: "var(--cor-texto-muted)" }}>
                {article.excerpt}
              </p>
            ) : null}
            <div className="artigo-post-meta reveal">
              <span>{article.author || "Equipe Gi Inovações"}</span>
              <span aria-hidden>·</span>
              <span>{formatDate(article.created_at)}</span>
              {article.read_time ? (<><span aria-hidden>·</span><span>{article.read_time} de leitura</span></>) : null}
            </div>
          </div>
        </header>

        {article.cover_image ? (
          <div className="artigo-post-cover reveal">
            <div className="shell shell-narrow">
              <div className="artigo-post-cover-frame">
                <img src={resolveMediaUrl(article.cover_image)} alt={article.title} loading="lazy" />
              </div>
            </div>
          </div>
        ) : null}

        <div className="section artigo-post-body">
          <div className="shell shell-narrow">
            <div
              className="artigo-prose reveal"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section artigo-related">
          <div className="shell">
            <h2 className="h-section text-reveal" style={{ maxWidth: "22ch" }}>
              {splitWords("Outros artigos")}
            </h2>
            <div className="artigos-grid mt-xl">
              {related.map((r, i) => (
                <Link
                  to={`/artigos/${r.slug}`}
                  key={r.slug}
                  className="artigo-card artigo-card-appear"
                  style={{ animationDelay: `${i * 80}ms` }}
                  data-cursor="Ler"
                >
                  <div className="artigo-card-media">
                    {r.cover_image ? (
                      <img src={resolveMediaUrl(r.cover_image)} alt={r.title} loading="lazy" />
                    ) : (
                      <div className="artigo-card-media-empty" aria-hidden />
                    )}
                    <span className="artigo-card-index">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="artigo-card-body">
                    {r.category ? <span className="artigo-card-cat">{r.category}</span> : null}
                    <h3 className="artigo-card-title">{r.title}</h3>
                    <p className="artigo-card-excerpt">{r.excerpt}</p>
                    <span className="link-arrow">Ler artigo <span className="arrow">→</span></span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="reveal mt-xl">
              <Link to="/artigos" className="link-arrow" data-cursor="Ver">
                Ver todos os artigos <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
