-- =============================================================================
-- Farmácia do Povo — Seed Data (nomes em português)
-- Execute APÓS a migration 001_schema.sql
-- =============================================================================

-- =============================================================================
-- CATEGORIAS
-- =============================================================================
INSERT INTO categorias (slug, titulo, descricao, descricao_longa, icone, ordem) VALUES
  ('emagrecimento', 'Emagrecimento', 'Acelere o metabolismo',
   'Fórmulas manipuladas para auxiliar na perda de peso com segurança, acelerando o metabolismo e controlando o apetite.',
   'Flame', 1),
  ('desempenho', 'Desempenho', 'Energia e força',
   'Suplementos personalizados para maximizar seu rendimento nos treinos, ganho de massa muscular e recuperação.',
   'Dumbbell', 2),
  ('saude', 'Saúde', 'Bem-estar diário',
   'Vitaminas, minerais e compostos para fortalecer a imunidade e manter o equilíbrio do organismo todos os dias.',
   'HeartPulse', 3),
  ('queda-capilar', 'Queda Capilar', 'Cabelos mais fortes',
   'Tratamentos manipulados com ativos específicos para combater a queda, estimular o crescimento e fortalecer os fios.',
   'Scissors', 4),
  ('libido', 'Libido', 'Vitalidade e desejo',
   'Fórmulas naturais para potencializar a vitalidade, o desejo e o bem-estar íntimo com segurança e eficácia.',
   'Sparkles', 5),
  ('beleza', 'Beleza', 'Pele, unhas e cabelos',
   'Compostos de colágeno, vitaminas e ativos dermatológicos para realçar sua beleza de dentro para fora.',
   'Star', 6)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- PRODUTOS
-- =============================================================================

-- 1. Termo Slim Fórmula
INSERT INTO produtos (
  slug, nome, tag, categoria_id, url_imagem,
  descricao, beneficios, ingredientes, modo_de_uso,
  preco_original, preco_base, estoque, ativo, ordem
) VALUES (
  'termo-slim', 'Termo Slim Fórmula', 'Emagrecimento',
  (SELECT id FROM categorias WHERE slug = 'emagrecimento'),
  '/images/produto-emagrecimento.png',
  'Fórmula termogênica de alta performance desenvolvida para acelerar o metabolismo e potencializar a queima de gordura. Manipulada com ativos selecionados e controlada pelo farmacêutico responsável.',
  ARRAY[
    'Acelera o metabolismo basal',
    'Reduz o apetite e a compulsão alimentar',
    'Aumenta a disposição e energia',
    'Auxilia na queima de gordura localizada'
  ],
  'Cafeína anidra 200 mg, Extrato de chá verde (EGCG) 300 mg, Pimenta Cayenne (capsaicina 8%) 100 mg, Cromo picolinato 200 mcg, Vitamina B6 10 mg',
  'Tomar 1 cápsula pela manhã e 1 cápsula no horário do almoço, com copo cheio de água. Não utilizar após as 18h. Não exceder 2 cápsulas ao dia.',
  119.90, 89.90, 48, true, 1
) ON CONFLICT (slug) DO NOTHING;

-- 2. Detox Fit Complex
INSERT INTO produtos (
  slug, nome, tag, categoria_id, url_imagem,
  descricao, beneficios, ingredientes, modo_de_uso,
  preco_original, preco_base, estoque, ativo, ordem
) VALUES (
  'detox-fit', 'Detox Fit Complex', 'Emagrecimento',
  (SELECT id FROM categorias WHERE slug = 'emagrecimento'),
  '/images/produto-emagrecimento.png',
  'Complexo detox multifuncional que combina antioxidantes potentes, fibras e ativos depurativos para eliminar toxinas, desinchar e apoiar o emagrecimento saudável.',
  ARRAY[
    'Elimina toxinas do organismo',
    'Reduz inchaço e retenção de líquidos',
    'Rica em antioxidantes',
    'Melhora o funcionamento intestinal'
  ],
  'Alcachofra 300 mg, Cardo mariano 200 mg, Dente-de-leão 150 mg, Clorella 200 mg, Inulina 500 mg, Vitamina C 100 mg',
  'Tomar 2 cápsulas ao dia, preferencialmente 30 minutos antes do café da manhã, com um copo grande de água.',
  99.90, 79.90, 32, true, 2
) ON CONFLICT (slug) DO NOTHING;

-- 3. Capilar Force Complex
INSERT INTO produtos (
  slug, nome, tag, categoria_id, url_imagem,
  descricao, beneficios, ingredientes, modo_de_uso,
  preco_original, preco_base, estoque, ativo, ordem
) VALUES (
  'capilar-force', 'Capilar Force Complex', 'Queda Capilar',
  (SELECT id FROM categorias WHERE slug = 'queda-capilar'),
  '/images/produto-capilar.png',
  'Tratamento capilar de alta concentração com ativos específicos para combater a queda e estimular o crescimento dos fios de dentro para fora.',
  ARRAY[
    'Reduz a queda de cabelo em até 60%',
    'Estimula o crescimento dos fios',
    'Fortalece a raiz capilar',
    'Melhora a textura e o brilho dos cabelos'
  ],
  'Biotina (vitamina B7) 10 mg, Zinco quelato 30 mg, L-Cisteína 500 mg, Pantotenato de cálcio 50 mg, Extrato de saw palmetto 300 mg, Ferro quelato 14 mg',
  'Tomar 1 cápsula ao dia, preferencialmente com a refeição principal. Uso contínuo por no mínimo 90 dias.',
  139.90, 109.90, 17, true, 3
) ON CONFLICT (slug) DO NOTHING;

-- 4. Hair Grow Fórmula
INSERT INTO produtos (
  slug, nome, tag, categoria_id, url_imagem,
  descricao, beneficios, ingredientes, modo_de_uso,
  preco_original, preco_base, estoque, ativo, ordem
) VALUES (
  'hair-grow', 'Hair Grow Fórmula', 'Queda Capilar',
  (SELECT id FROM categorias WHERE slug = 'queda-capilar'),
  '/images/produto-capilar.png',
  'Fórmula regeneradora com complexo de aminoácidos e minerais essenciais para o crescimento acelerado dos fios e saúde do couro cabeludo.',
  ARRAY[
    'Acelera o crescimento capilar',
    'Nutre o couro cabeludo em profundidade',
    'Aumenta a densidade dos fios',
    'Previne o enfraquecimento capilar'
  ],
  'L-Metionina 500 mg, L-Cisteína 300 mg, Biotina 5 mg, Silício orgânico 100 mg, Extrato de cavalinha 200 mg, Selênio 55 mcg, Cobre 2 mg',
  'Tomar 2 cápsulas ao dia, 1 pela manhã e 1 à noite, durante as refeições. Manter por no mínimo 60 dias.',
  149.90, 119.90, 25, true, 4
) ON CONFLICT (slug) DO NOTHING;

-- 5. Imuni Vita D3 + Zinco
INSERT INTO produtos (
  slug, nome, tag, categoria_id, url_imagem,
  descricao, beneficios, ingredientes, modo_de_uso,
  preco_original, preco_base, estoque, ativo, ordem
) VALUES (
  'imuni-vita', 'Imuni Vita D3 + Zinco', 'Saúde',
  (SELECT id FROM categorias WHERE slug = 'saude'),
  '/images/produto-imunidade.png',
  'Suplemento imunológico completo com vitamina D3 de alta potência e zinco quelato para fortalecer as defesas do organismo e manter o bem-estar ao longo do ano.',
  ARRAY[
    'Fortalece o sistema imunológico',
    'Combate a deficiência de vitamina D3',
    'Auxilia na saúde óssea e muscular',
    'Melhora o humor e os níveis de energia'
  ],
  'Vitamina D3 (colecalciferol) 10.000 UI, Zinco quelato 30 mg, Vitamina K2 (MK-7) 100 mcg, Vitamina C 200 mg, Magnésio dimalato 150 mg',
  'Tomar 1 cápsula ao dia junto à refeição principal. Não exceder a dose recomendada.',
  84.90, 69.90, 63, true, 5
) ON CONFLICT (slug) DO NOTHING;

-- 6. Ômega 3 Ultra DHA
INSERT INTO produtos (
  slug, nome, tag, categoria_id, url_imagem,
  descricao, beneficios, ingredientes, modo_de_uso,
  preco_original, preco_base, estoque, ativo, ordem
) VALUES (
  'omega-ultra', 'Ômega 3 Ultra DHA', 'Saúde',
  (SELECT id FROM categorias WHERE slug = 'saude'),
  '/images/produto-imunidade.png',
  'Ômega 3 ultra concentrado com alta proporção de DHA para saúde cardiovascular, cerebral e anti-inflamatória. Óleo de peixe purificado e livre de metais pesados.',
  ARRAY[
    'Saúde cardiovascular',
    'Melhora a função cognitiva e memória',
    'Efeito anti-inflamatório natural',
    'Auxilia na redução dos triglicerídeos'
  ],
  'Óleo de peixe concentrado 1000 mg (DHA 500 mg, EPA 250 mg), Vitamina E (tocoferol) 10 mg como antioxidante natural',
  'Tomar 1 a 2 cápsulas ao dia durante as refeições.',
  94.90, 74.90, 41, true, 6
) ON CONFLICT (slug) DO NOTHING;

-- 7. Colágeno Skin Glow
INSERT INTO produtos (
  slug, nome, tag, categoria_id, url_imagem,
  descricao, beneficios, ingredientes, modo_de_uso,
  preco_original, preco_base, estoque, ativo, ordem
) VALUES (
  'colageno-skin', 'Colágeno Skin Glow', 'Beleza',
  (SELECT id FROM categorias WHERE slug = 'beleza'),
  '/images/produto-pele.png',
  'Colágeno hidrolisado de alta biodisponibilidade enriquecido com vitamina C, ácido hialurônico e biotina para pele luminosa, firme e jovem de dentro para fora.',
  ARRAY[
    'Reduz linhas de expressão e rugas finas',
    'Aumenta a firmeza e elasticidade da pele',
    'Hidratação profunda e duradoura',
    'Fortalece unhas e cabelos'
  ],
  'Colágeno hidrolisado tipo I e III 5 g, Ácido hialurônico 100 mg, Vitamina C 200 mg, Biotina 5 mg, Coenzima Q10 50 mg',
  'Tomar 2 cápsulas ao dia, preferencialmente pela manhã em jejum ou à noite antes de dormir. Uso mínimo de 90 dias.',
  129.90, 99.90, 28, true, 7
) ON CONFLICT (slug) DO NOTHING;

-- 8. Beauty Complex Pro
INSERT INTO produtos (
  slug, nome, tag, categoria_id, url_imagem,
  descricao, beneficios, ingredientes, modo_de_uso,
  preco_original, preco_base, estoque, ativo, ordem
) VALUES (
  'beauty-complex', 'Beauty Complex Pro', 'Beleza',
  (SELECT id FROM categorias WHERE slug = 'beleza'),
  '/images/produto-pele.png',
  'Complexo de beleza com nutrientes essenciais para pele, cabelo e unhas. Combinação inteligente de vitaminas, minerais e ativos botânicos para realçar sua beleza natural.',
  ARRAY[
    'Pele mais luminosa e uniforme',
    'Unhas mais fortes e resistentes',
    'Cabelos brilhantes e saudáveis',
    'Rico em antioxidantes protetores'
  ],
  'Biotina 10 mg, Vitamina E 400 UI, Vitamina C 500 mg, Selênio 100 mcg, Zinco quelato 15 mg, Extrato de semente de uva (resveratrol) 150 mg, Licopeno 10 mg',
  'Tomar 1 cápsula ao dia com a refeição principal.',
  109.90, 89.90, 19, true, 8
) ON CONFLICT (slug) DO NOTHING;

-- 9. Pré-Treino Explosivo
INSERT INTO produtos (
  slug, nome, tag, categoria_id, url_imagem,
  descricao, beneficios, ingredientes, modo_de_uso,
  preco_original, preco_base, estoque, ativo, ordem
) VALUES (
  'pre-treino', 'Pré-Treino Explosivo', 'Desempenho',
  (SELECT id FROM categorias WHERE slug = 'desempenho'),
  '/images/produto-emagrecimento.png',
  'Pré-treino de alta performance manipulado sob medida para dar energia máxima, força e resistência nos treinos mais intensos. Sem corantes artificiais e com dosagens clínicas.',
  ARRAY[
    'Energia e disposição máxima no treino',
    'Aumento de força e resistência muscular',
    'Foco e concentração mental elevados',
    'Reduz a fadiga e o tempo de recuperação'
  ],
  'Cafeína anidra 300 mg, Beta-alanina 3200 mg, Citrulina malato 6000 mg, Creatina monoidrato 3000 mg, L-Arginina 2000 mg, Vitamina B12 1000 mcg',
  'Dissolver 1 dose em 300 ml de água fria e consumir 20 a 30 minutos antes do treino. Não utilizar após as 18h.',
  119.90, 94.90, 55, true, 9
) ON CONFLICT (slug) DO NOTHING;

-- 10. Massa Max Fórmula
INSERT INTO produtos (
  slug, nome, tag, categoria_id, url_imagem,
  descricao, beneficios, ingredientes, modo_de_uso,
  preco_original, preco_base, estoque, ativo, ordem
) VALUES (
  'massa-max', 'Massa Max Fórmula', 'Desempenho',
  (SELECT id FROM categorias WHERE slug = 'desempenho'),
  '/images/produto-emagrecimento.png',
  'Fórmula anabólica para ganho de massa muscular magra com combinação de proteínas de alto valor biológico, carboidratos complexos e micronutrientes essenciais para a hipertrofia.',
  ARRAY[
    'Ganho de massa muscular magra',
    'Recuperação muscular acelerada',
    'Aumento da síntese proteica',
    'Fornece energia sustentada para treinos longos'
  ],
  'Proteína do soro do leite (whey) 25 g, Caseína 10 g, Maltodextrina 20 g, Creatina monoidrato 3 g, L-Glutamina 2 g, Complexo de vitaminas do complexo B',
  'Dissolver 1 dose em 300 a 400 ml de água ou leite e consumir após o treino.',
  139.90, 109.90, 34, true, 10
) ON CONFLICT (slug) DO NOTHING;

-- 11. Libido Plus Fórmula
INSERT INTO produtos (
  slug, nome, tag, categoria_id, url_imagem,
  descricao, beneficios, ingredientes, modo_de_uso,
  preco_original, preco_base, estoque, ativo, ordem
) VALUES (
  'libido-plus', 'Libido Plus Fórmula', 'Libido',
  (SELECT id FROM categorias WHERE slug = 'libido'),
  '/images/produto-imunidade.png',
  'Fórmula afrodisíaca natural com ativos clinicamente testados para estimular o desejo, melhorar o desempenho e restaurar a vitalidade sexual de forma segura e eficaz.',
  ARRAY[
    'Aumenta o desejo e a libido',
    'Melhora o desempenho e a resistência',
    'Reduz o estresse e a ansiedade',
    'Equilíbrio hormonal natural'
  ],
  'Tribulus terrestris 500 mg, Maca peruana 1000 mg, Ashwagandha (KSM-66) 300 mg, L-Arginina 1000 mg, Zinco quelato 30 mg, Vitamina D3 2000 UI',
  'Tomar 2 cápsulas ao dia, 1 pela manhã e 1 à tarde, preferencialmente com as refeições. Manter por no mínimo 30 dias.',
  149.90, 119.90, 22, true, 11
) ON CONFLICT (slug) DO NOTHING;

-- 12. Vitalidade Max
INSERT INTO produtos (
  slug, nome, tag, categoria_id, url_imagem,
  descricao, beneficios, ingredientes, modo_de_uso,
  preco_original, preco_base, estoque, ativo, ordem
) VALUES (
  'vitalidade-max', 'Vitalidade Max', 'Libido',
  (SELECT id FROM categorias WHERE slug = 'libido'),
  '/images/produto-imunidade.png',
  'Suplemento revitalizante completo com adaptógenos naturais para restaurar a energia, equilibrar os hormônios e melhorar o bem-estar íntimo de forma progressiva.',
  ARRAY[
    'Restaura a energia e a vitalidade',
    'Equilíbrio hormonal natural',
    'Reduz o estresse e o cansaço crônico',
    'Melhora o humor e a disposição diária'
  ],
  'Ginseng coreano 400 mg, Ashwagandha 300 mg, Maca andina 500 mg, Vitamina B6 10 mg, Vitamina B12 500 mcg, Magnésio dimalato 200 mg, Zinco quelato 15 mg',
  'Tomar 1 cápsula ao dia, preferencialmente pela manhã com o café da manhã. Uso contínuo por 30 a 90 dias.',
  129.90, 99.90, 38, true, 12
) ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- AVALIAÇÕES DOS PRODUTOS
-- =============================================================================

-- Termo Slim
INSERT INTO avaliacoes (produto_id, nome_autor, nota, comentario, compra_verificada, aprovado) VALUES
  ((SELECT id FROM produtos WHERE slug = 'termo-slim'), 'Ana R.', 5, 'Perdi 6 kg em 2 meses com dieta e exercício. O controle do apetite foi notável desde a primeira semana.', true, true),
  ((SELECT id FROM produtos WHERE slug = 'termo-slim'), 'Fernanda S.', 5, 'Produto excelente! Minha energia aumentou muito e a balança finalmente começou a andar.', true, true),
  ((SELECT id FROM produtos WHERE slug = 'termo-slim'), 'Juliana M.', 4, 'Funciona bem, principalmente no controle da fome. Recomendo associar com exercícios para resultados mais rápidos.', true, true);

-- Detox Fit
INSERT INTO avaliacoes (produto_id, nome_autor, nota, comentario, compra_verificada, aprovado) VALUES
  ((SELECT id FROM produtos WHERE slug = 'detox-fit'), 'Carla M.', 5, 'Desinchei muito nas primeiras semanas. Meu abdômen ficou notavelmente mais liso.', true, true),
  ((SELECT id FROM produtos WHERE slug = 'detox-fit'), 'Patricia L.', 4, 'Ajudou bastante na digestão e no intestino preso que eu tinha. Recomendo!', true, true);

-- Capilar Force
INSERT INTO avaliacoes (produto_id, nome_autor, nota, comentario, compra_verificada, aprovado) VALUES
  ((SELECT id FROM produtos WHERE slug = 'capilar-force'), 'Bianca T.', 5, 'Em 3 meses de uso minha queda reduziu drasticamente. Cabelos muito mais fortes e com muito mais brilho.', true, true),
  ((SELECT id FROM produtos WHERE slug = 'capilar-force'), 'Renata F.', 5, 'Nunca vi resultado tão rápido. Depois de 45 dias já percebi diferença na escova.', true, true),
  ((SELECT id FROM produtos WHERE slug = 'capilar-force'), 'Marcos A.', 4, 'Usei por recomendação do dermatologista. A queda na têmpora diminuiu consideravelmente.', true, true);

-- Hair Grow
INSERT INTO avaliacoes (produto_id, nome_autor, nota, comentario, compra_verificada, aprovado) VALUES
  ((SELECT id FROM produtos WHERE slug = 'hair-grow'), 'Larissa P.', 5, 'Meu cabelo cresceu quase 3 cm em 6 semanas! Totalmente impressionada com o resultado.', true, true),
  ((SELECT id FROM produtos WHERE slug = 'hair-grow'), 'Sofia N.', 4, 'Cabelo mais grosso e resistente. Queda diminuiu bastante após o primeiro mês.', true, true);

-- Imuni Vita
INSERT INTO avaliacoes (produto_id, nome_autor, nota, comentario, compra_verificada, aprovado) VALUES
  ((SELECT id FROM produtos WHERE slug = 'imuni-vita'), 'Roberto C.', 5, 'Resolvi o problema de deficiência de vitamina D sem precisar de receita cara. Exames mostraram melhora em 60 dias.', true, true),
  ((SELECT id FROM produtos WHERE slug = 'imuni-vita'), 'Helena V.', 5, 'Não fico mais gripada toda semana. A imunidade melhorou visivelmente no inverno.', true, true),
  ((SELECT id FROM produtos WHERE slug = 'imuni-vita'), 'Diego S.', 5, 'Melhor custo-benefício do mercado. Qualidade de manipulação impecável.', true, true);

-- Ômega Ultra
INSERT INTO avaliacoes (produto_id, nome_autor, nota, comentario, compra_verificada, aprovado) VALUES
  ((SELECT id FROM produtos WHERE slug = 'omega-ultra'), 'Eduardo B.', 5, 'Meu cardiologista aprovou e os triglicerídeos caíram 40 pontos em 3 meses de uso.', true, true),
  ((SELECT id FROM produtos WHERE slug = 'omega-ultra'), 'Claudia A.', 4, 'Sem gosto de peixe, cápsula fácil de engolir. Resultado nos exames foi ótimo.', true, true);

-- Colágeno Skin
INSERT INTO avaliacoes (produto_id, nome_autor, nota, comentario, compra_verificada, aprovado) VALUES
  ((SELECT id FROM produtos WHERE slug = 'colageno-skin'), 'Aline G.', 5, 'Minha pele ficou muito mais hidratada e firme. As linhas ao redor dos olhos diminuíram visivelmente.', true, true),
  ((SELECT id FROM produtos WHERE slug = 'colageno-skin'), 'Tatiana R.', 5, 'Resultado surpreendente! Em 2 meses as pessoas perguntando o que eu tinha feito na pele.', true, true),
  ((SELECT id FROM produtos WHERE slug = 'colageno-skin'), 'Vanessa M.', 5, 'As unhas pararam de quebrar e crescem muito mais rápido. Produto incrível.', true, true);

-- Beauty Complex
INSERT INTO avaliacoes (produto_id, nome_autor, nota, comentario, compra_verificada, aprovado) VALUES
  ((SELECT id FROM produtos WHERE slug = 'beauty-complex'), 'Isabela C.', 5, 'Pele mais bonita, unhas crescendo e cabelo brilhoso. Tudo junto em um produto só. Amei!', true, true),
  ((SELECT id FROM produtos WHERE slug = 'beauty-complex'), 'Mariana B.', 4, 'Ótimo custo-benefício para quem quer cuidar de tudo de uma vez. Recomendo!', true, true);

-- Pré-Treino
INSERT INTO avaliacoes (produto_id, nome_autor, nota, comentario, compra_verificada, aprovado) VALUES
  ((SELECT id FROM produtos WHERE slug = 'pre-treino'), 'Rafael O.', 5, 'Melhor pré-treino que já usei. Energia duradoura e sem aquela queda brusca no final.', true, true),
  ((SELECT id FROM produtos WHERE slug = 'pre-treino'), 'Lucas F.', 5, 'Quebrei PR no agachamento depois de 2 semanas usando. Muito bom mesmo!', true, true),
  ((SELECT id FROM produtos WHERE slug = 'pre-treino'), 'Thiago N.', 4, 'Foco excelente durante o treino. A formiga (beta-alanina) é forte no começo, mas passa rápido.', true, true);

-- Massa Max
INSERT INTO avaliacoes (produto_id, nome_autor, nota, comentario, compra_verificada, aprovado) VALUES
  ((SELECT id FROM produtos WHERE slug = 'massa-max'), 'Gustavo P.', 5, 'Ganhei 4 kg de massa em 3 meses. A recuperação muscular melhorou muito.', true, true),
  ((SELECT id FROM produtos WHERE slug = 'massa-max'), 'Vinicius A.', 4, 'Sem estomago pesado como outros gainers. Fácil de digerir e gostoso com leite.', true, true);

-- Libido Plus
INSERT INTO avaliacoes (produto_id, nome_autor, nota, comentario, compra_verificada, aprovado) VALUES
  ((SELECT id FROM produtos WHERE slug = 'libido-plus'), 'Carlos E.', 5, 'Resultado notável após 3 semanas. Voltei a me sentir como há 10 anos. Produto incrível.', true, true),
  ((SELECT id FROM produtos WHERE slug = 'libido-plus'), 'Alexandre M.', 4, 'Funciona de verdade. Energia e disposição melhoraram bastante também.', true, true);

-- Vitalidade Max
INSERT INTO avaliacoes (produto_id, nome_autor, nota, comentario, compra_verificada, aprovado) VALUES
  ((SELECT id FROM produtos WHERE slug = 'vitalidade-max'), 'Paulo R.', 5, 'Cansaço crônico que eu tinha desapareceu em 30 dias. Energia de manhã até a noite.', true, true),
  ((SELECT id FROM produtos WHERE slug = 'vitalidade-max'), 'Nelson G.', 4, 'Produto discreto, boa embalagem e resultado efetivo. Vou continuar usando.', true, true);

-- =============================================================================
-- RBAC — Perfis e Permissões padrão
-- =============================================================================
INSERT INTO perfis (nome, descricao) VALUES
  ('admin',         'Acesso total ao sistema'),
  ('farmaceutico',  'Farmacêutico: gerencia pedidos, receitas e estoque'),
  ('suporte',       'Suporte ao cliente: visualiza pedidos e clientes'),
  ('cliente',       'Cliente da farmácia')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO permissoes (nome, descricao, recurso, acao) VALUES
  ('produtos.ler',          'Visualizar produtos',            'produtos',     'ler'),
  ('produtos.escrever',     'Criar e editar produtos',        'produtos',     'escrever'),
  ('produtos.excluir',      'Excluir produtos',               'produtos',     'excluir'),
  ('produtos.gerenciar',    'Gerenciar estoque e campanhas',  'produtos',     'gerenciar'),
  ('pedidos.ler',           'Visualizar pedidos',             'pedidos',      'ler'),
  ('pedidos.escrever',      'Criar e editar pedidos',         'pedidos',      'escrever'),
  ('pedidos.gerenciar',     'Gerenciar status dos pedidos',   'pedidos',      'gerenciar'),
  ('clientes.ler',          'Visualizar clientes',            'clientes',     'ler'),
  ('clientes.gerenciar',    'Gerenciar clientes',             'clientes',     'gerenciar'),
  ('receitas.ler',          'Visualizar receitas',            'receitas',     'ler'),
  ('receitas.gerenciar',    'Aprovar ou rejeitar receitas',   'receitas',     'gerenciar'),
  ('relatorios.ler',        'Visualizar relatórios',          'relatorios',   'ler'),
  ('configuracoes.gerenciar','Gerenciar configurações',       'configuracoes','gerenciar')
ON CONFLICT (nome) DO NOTHING;

-- Permissões para admin (tudo)
INSERT INTO perfis_permissoes (perfil_id, permissao_id)
SELECT p.id, pm.id FROM perfis p, permissoes pm
WHERE p.nome = 'admin'
ON CONFLICT DO NOTHING;

-- Permissões para farmacêutico
INSERT INTO perfis_permissoes (perfil_id, permissao_id)
SELECT p.id, pm.id FROM perfis p
JOIN permissoes pm ON pm.nome IN (
  'produtos.ler', 'produtos.escrever', 'produtos.gerenciar',
  'pedidos.ler', 'pedidos.gerenciar',
  'receitas.ler', 'receitas.gerenciar',
  'clientes.ler', 'relatorios.ler'
)
WHERE p.nome = 'farmaceutico'
ON CONFLICT DO NOTHING;

-- Permissões para suporte
INSERT INTO perfis_permissoes (perfil_id, permissao_id)
SELECT p.id, pm.id FROM perfis p
JOIN permissoes pm ON pm.nome IN (
  'produtos.ler', 'pedidos.ler', 'clientes.ler', 'receitas.ler'
)
WHERE p.nome = 'suporte'
ON CONFLICT DO NOTHING;
