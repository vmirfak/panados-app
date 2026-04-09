"use client";

import { useState } from "react";

const produtos = [
  { id: 1, nome: "Panados de Frango", emoji: "🍗", precoDuzia: 6.50 },
  { id: 2, nome: "Panados de Porco", emoji: "🥩", precoDuzia: 7.00 },
  { id: 3, nome: "Rissóis de Carne", emoji: "🥟", precoDuzia: 3.00 },
  { id: 5, nome: "Rissóis de Frango", emoji: "🍗", precoDuzia: 3.00 },
  { id: 6, nome: "Rissóis Misto", emoji: "🥟", precoDuzia: 3.00 },
  { id: 7, nome: "Rissóis de Cachorro", emoji: "🌭", precoDuzia: 3.20 },
  { id: 4, nome: "Croquetes", emoji: "🟤", precoDuzia: 3.80 },
];

type Carrinho = Record<number, number>;

export default function Page() {
  const [carrinho, setCarrinho] = useState<Carrinho>({});
  const [animating, setAnimating] = useState<number | null>(null);
  const [resumoAberto, setResumoAberto] = useState(false);

  const adicionar = (id: number) => {
    setCarrinho((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setAnimating(id);
    setTimeout(() => setAnimating(null), 120);
  };

  const remover = (id: number) => {
    setCarrinho((prev) => {
      const novo = { ...prev };
      if (novo[id] > 1) novo[id]--;
      else delete novo[id];
      return novo;
    });
  };

  const limpar = () => {
    setCarrinho({});
    setResumoAberto(false);
  };

  const fmt = (n: number) => n.toFixed(2).replace(".", ",") + "€";

  const total = Object.entries(carrinho).reduce((acc, [id, qty]) => {
    const p = produtos.find((x) => x.id === Number(id))!;
    return acc + p.precoDuzia * qty;
  }, 0);

  const totalDuzias = Object.values(carrinho).reduce((a, b) => a + b, 0);
  const itensCarrinho = Object.entries(carrinho).filter(([, qty]) => qty > 0);

  return (
    <div style={{ backgroundColor: "#FFFBF0", minHeight: "100dvh" }}>

      {/* Header */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
        style={{ backgroundColor: "#FFFBF0", borderBottom: "2px solid #FCD34D" }}
      >
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#78350F" }}>
            🍽️ Tasca da Lucília
          </h1>
          <p className="text-base mt-0.5" style={{ color: "#92400E" }}>
            Preços por dúzia
          </p>
        </div>
      </header>

      {/* Grid — altura calculada para nunca precisar de scroll */}
      <main
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          padding: "16px 12px",
          paddingBottom: totalDuzias > 0 ? "140px" : "16px",
          maxWidth: 480,
          margin: "0 auto",
          // Força o grid a caber no ecrã sem scroll:
          height: "calc(100dvh - 80px - (totalDuzias > 0 ? 120px : 0px))",
          alignContent: "start",
        }}
      >
        {produtos.map((p) => {
          const qty = carrinho[p.id] || 0;
          const ativo = qty > 0;
          const isAnim = animating === p.id;

          return (
            <div
              key={p.id}
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: ativo ? "#FEF3C7" : "#ffffff",
                border: ativo ? "3px solid #D97706" : "3px solid #E5E7EB",
                transform: isAnim ? "scale(0.94)" : "scale(1)",
                transition: "transform 0.12s, border-color 0.15s, background-color 0.15s",
              }}
            >
              {/* Topo — toque adiciona */}
              <button
                onClick={() => adicionar(p.id)}
                className="w-full flex flex-col items-center text-center px-2 pt-4 pb-2 active:opacity-70"
              >
                <span style={{ fontSize: 36, lineHeight: 1 }}>{p.emoji}</span>
                <p className="font-bold mt-2 leading-tight" style={{ fontSize: 14, color: "#1C1917" }}>
                  {p.nome}
                </p>
                <p
                  className="font-bold mt-1 px-2 py-0.5 rounded-full"
                  style={{ fontSize: 13, backgroundColor: ativo ? "#FDE68A" : "#FEF3C7", color: "#92400E" }}
                >
                  {fmt(p.precoDuzia)} / dúzia
                </p>
              </button>

              {/* Controlos */}
              <div className="px-2 pb-3 pt-1">
                {ativo ? (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => remover(p.id)}
                      className="flex items-center justify-center rounded-xl font-bold active:opacity-60"
                      style={{ width: 48, height: 48, fontSize: 28, backgroundColor: "#E5E7EB", color: "#374151" }}
                      aria-label={`Remover uma dúzia de ${p.nome}`}
                    >
                      −
                    </button>
                    <span className="font-black" style={{ fontSize: 32, color: "#D97706" }}>
                      {qty}
                    </span>
                    <button
                      onClick={() => adicionar(p.id)}
                      className="flex items-center justify-center rounded-xl font-bold active:opacity-60"
                      style={{ width: 48, height: 48, fontSize: 28, backgroundColor: "#D97706", color: "#fff" }}
                      aria-label={`Adicionar uma dúzia de ${p.nome}`}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => adicionar(p.id)}
                    className="w-full flex items-center justify-center rounded-xl font-bold active:opacity-60"
                    style={{
                      height: 48, fontSize: 15,
                      backgroundColor: "#FEF3C7",
                      border: "2px solid #FCD34D",
                      color: "#92400E",
                    }}
                  >
                    + Adicionar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </main>

      {/* Barra fixa no fundo */}
      {totalDuzias > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 px-3 pb-4">
          <div
            className="max-w-lg mx-auto rounded-3xl overflow-hidden"
            style={{ backgroundColor: "#D97706", boxShadow: "0 -4px 32px #D9770644" }}
          >
            <div className="flex items-center gap-4 px-5 py-4">
              {/* Total — abre drawer ao tocar */}
              <button
                onClick={() => setResumoAberto(true)}
                className="flex-1 text-left active:opacity-80"
              >
                <p className="font-semibold uppercase tracking-widest" style={{ fontSize: 12, color: "#FEF3C7" }}>
                  ▶ Ver resumo
                </p>
                <p className="font-black leading-none mt-1" style={{ fontSize: 48, color: "#fff", letterSpacing: "-2px" }}>
                  {fmt(total)}
                </p>
                <p className="font-semibold mt-1" style={{ fontSize: 14, color: "#FEF3C7" }}>
                  {totalDuzias} {totalDuzias === 1 ? "dúzia" : "dúzias"}
                </p>
              </button>

              {/* Limpar */}
              <button
                onClick={limpar}
                className="flex items-center justify-center rounded-2xl font-bold active:opacity-60 shrink-0"
                style={{ height: 68, paddingLeft: 20, paddingRight: 20, backgroundColor: "#92400E", color: "#FEF3C7", fontSize: 16 }}
                aria-label="Limpar encomenda"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer de resumo — cobre o ecrã por cima */}
      {resumoAberto && (
        <>
          {/* Overlay escuro */}
          <div
            className="fixed inset-0 z-30"
            style={{ backgroundColor: "#00000066" }}
            onClick={() => setResumoAberto(false)}
          />

          {/* Painel */}
          <div
            className="fixed left-0 right-0 bottom-0 z-40 rounded-t-3xl overflow-hidden"
            style={{ backgroundColor: "#fff", maxHeight: "80dvh", display: "flex", flexDirection: "column" }}
          >
            {/* Cabeçalho do drawer */}
            <div
              className="flex items-center justify-between px-6 py-5 shrink-0"
              style={{ borderBottom: "2px solid #FCD34D" }}
            >
              <div>
                <p className="font-bold" style={{ fontSize: 20, color: "#78350F" }}>Resumo</p>
                <p style={{ fontSize: 14, color: "#92400E" }}>
                  {totalDuzias} {totalDuzias === 1 ? "dúzia" : "dúzias"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-black" style={{ fontSize: 36, color: "#D97706", letterSpacing: "-1px" }}>
                  {fmt(total)}
                </p>
              </div>
            </div>

            {/* Lista de itens */}
            <div className="overflow-y-auto flex-1 px-5 py-3">
              {itensCarrinho.map(([id, qty]) => {
                const p = produtos.find((x) => x.id === Number(id))!;
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between py-4"
                    style={{ borderBottom: "1px solid #FEF3C7" }}
                  >
                    <div>
                      <p className="font-bold" style={{ fontSize: 17, color: "#1C1917" }}>
                        {p.emoji} {p.nome}
                      </p>
                      <p style={{ fontSize: 14, color: "#92400E", marginTop: 2 }}>
                        {fmt(p.precoDuzia)}/dúzia × {qty} = <strong>{fmt(p.precoDuzia * qty)}</strong>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <button
                        onClick={() => remover(p.id)}
                        className="flex items-center justify-center rounded-xl font-bold active:opacity-60"
                        style={{ width: 48, height: 48, fontSize: 26, backgroundColor: "#E5E7EB", color: "#374151" }}
                      >
                        −
                      </button>
                      <span className="font-black text-center" style={{ fontSize: 24, color: "#D97706", minWidth: 32 }}>
                        {qty}
                      </span>
                      <button
                        onClick={() => adicionar(p.id)}
                        className="flex items-center justify-center rounded-xl font-bold active:opacity-60"
                        style={{ width: 48, height: 48, fontSize: 26, backgroundColor: "#D97706", color: "#fff" }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fechar */}
            <div className="px-5 py-4 shrink-0" style={{ borderTop: "2px solid #FCD34D" }}>
              <button
                onClick={() => setResumoAberto(false)}
                className="w-full flex items-center justify-center rounded-2xl font-bold active:opacity-70"
                style={{ height: 60, fontSize: 18, backgroundColor: "#D97706", color: "#fff" }}
              >
                Fechar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}