import Seo from '../components/Seo';

export default function About() {
  return (
    <>
      <Seo title="Sobre — BRASA" description="Conheça a história e a filosofia do restaurante BRASA." />

      <section className="container section--tight">
        <span className="eyebrow">Sobre</span>
        <h1 style={{ marginTop: 12, maxWidth: '18ch' }}>Um restaurante construído ao redor do fogo</h1>
        <p className="lede" style={{ marginTop: 24 }}>
          O BRASA nasceu da vontade de fazer menos coisas, mas fazer cada uma delas até o fim.
          Isso significa um cardápio curto, ingredientes escolhidos com cuidado e uma grelha
          que nunca apaga durante o serviço.
        </p>
      </section>

      <section className="section--dark">
        <div className="container grid-2">
          <div>
            <h2>A grelha como centro da casa</h2>
          </div>
          <p style={{ opacity: 0.85 }}>
            A cozinha foi desenhada ao redor de uma grelha aberta, visível a partir do salão.
            Não é decoração: é onde a maior parte do cardápio é preparada, do início ao fim do serviço.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container info-grid">
          <div className="info-block">
            <h3>Ingredientes</h3>
            <p style={{ marginTop: 12 }}>Trabalhamos com produtores locais sempre que possível, priorizando sazonalidade.</p>
          </div>
          <div className="info-block">
            <h3>Equipe</h3>
            <p style={{ marginTop: 12 }}>Um time pequeno e fixo, que conhece cada prato do cardápio de cor.</p>
          </div>
          <div className="info-block">
            <h3>Espaço</h3>
            <p style={{ marginTop: 12 }}>Salão para até 60 pessoas, com uma área externa coberta.</p>
          </div>
        </div>
      </section>
    </>
  );
}
