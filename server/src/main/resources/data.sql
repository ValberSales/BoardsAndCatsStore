-- ============================================================================
-- SCRIPT DE POPULAÇÃO DE DADOS (DATA.SQL)
-- Apenas INSERTs. A criação das tabelas é gerenciada pelo JPA/Hibernate.
-- ============================================================================

-- ########## CATEGORIAS ##########
INSERT INTO tb_category (id, name) VALUES
                                       (1, 'Jogos de Tabuleiro'),
                                       (2, 'Card Games'),
                                       (3, 'Acessórios');

-- ########## USUÁRIOS ##########
INSERT INTO tb_user (id, username, display_name, password, phone, cpf) VALUES
                                                                           (1, 'joao.silva@email.com', 'João Silva', '$2a$10$/cLFiA7e2tlMvcz/bcMKke0vBdcSwhUml7jogKP2MZiE1c/m1hc6i', '46999998888', '111.111.111-11'),
                                                                           (2, 'ana.souza@email.com', 'Ana Souza', '$2a$10$/cLFiA7e2tlMvcz/bcMKke0vBdcSwhUml7jogKP2MZiE1c/m1hc6i', '46988887777', '222.222.222-22'),
                                                                           (3, 'carlos.santos@email.com', 'Carlos Santos', '$2a$10$/cLFiA7e2tlMvcz/bcMKke0vBdcSwhUml7jogKP2MZiE1c/m1hc6i', '46977776666', '333.333.333-33'),
                                                                           (4, 'maria.lima@email.com', 'Maria Lima', '$2a$10$/cLFiA7e2tlMvcz/bcMKke0vBdcSwhUml7jogKP2MZiE1c/m1hc6i', '46966665555', '444.444.444-44');

-- ########## ENDEREÇOS ##########
INSERT INTO tb_address (id, street, number, city, state, zip, complement, neighborhood, user_id) VALUES
                                                                                                     (1, 'Rua das Flores', '123', 'Pato Branco', 'PR', '85501-100', 'Apto 101', 'Centro', 1),
                                                                                                     (2, 'Rua Principal', '789', 'Pato Branco', 'PR', '85501-200', 'Casa', 'Bortot', 1),
                                                                                                     (3, 'Avenida Brasil', '2024', 'Pato Branco', 'PR', '85502-200', 'Casa', 'La Salle', 2),
                                                                                                     (4, 'Rua da Paz', '456', 'Pato Branco', 'PR', '85503-300', 'Fundos', 'Industrial', 3),
                                                                                                     (5, 'Avenida Tupi', '1000', 'Pato Branco', 'PR', '85504-400', 'Comercial', 'Centro', 4);

-- ########## MÉTODOS DE PAGAMENTO ##########
INSERT INTO tb_payment_method (id, type, description, user_id) VALUES
                                                                   (1, 'CREDIT_CARD', 'Visa final 4242', 1),
                                                                   (2, 'PIX', 'Chave (46) 99999-8888', 1),
                                                                   (3, 'PIX', 'Chave aleatória', 2),
                                                                   (4, 'CREDIT_CARD', 'Mastercard final 5555', 3),
                                                                   (5, 'BOLETO', 'Boleto Bancário', 4);

-- ########## PRODUTOS ##########
-- IDs 2, 5, 13 e 24 sem estoque (stock = 0)
INSERT INTO tb_product (id, name, description, price, promo, stock, mechanics, players, editor, category_id, image_url, duracao, idade_recomendada) VALUES
                                                                                                                                                        (1, 'Terra Mystica', 'Mude o destino de sua facção! Em Terra Mystica, a sorte não tem vez: apenas a estratégia pura reina. Governe uma das 14 raças únicas, terraforme o cenário para expandir seu domínio e construa fortalezas imponentes.', 299.90, true, 50, 'Controle de área, Desenvolvimento', '2-5', 'Feuerland Spiele', 1, '/images/jogos/terramystica-main.jpg', '60-150 minutos', '12+'),
                                                                                                                                                        (2, 'Catan', 'O jogo que redefiniu os jogos de tabuleiro modernos. Negocie, construa e colonize a ilha de Catan. Colete recursos, faça trocas astutas com outros jogadores e expanda seus caminhos rumo à vitória.', 249.90, false, 0, 'Gestão de recursos, Negociação', '3-4', 'KOSMOS', 1, '/images/jogos/catan_main.jpg', '60-120 minutos', '10+'),
                                                                                                                                                        (3, 'Pandemic', 'O destino da humanidade está em suas mãos. Como membros de uma equipe de elite de controle de doenças, vocês devem trabalhar juntos para manter o mundo a salvo de quatro pragas mortais.', 189.90, true, 50, 'Cooperativo, Gestão de mão', '2-4', 'Z-Man Games', 1, '/images/jogos/pandemic_main.jpg', '45-60 minutos', '8+'),
                                                                                                                                                        (4, 'Ticket to Ride', 'Todos a bordo para uma aventura ferroviária! Colete cartas de vagão e reivindique rotas de trem conectando cidades icônicas. Simples, elegante e viciante.', 199.90, false, 50, 'Construção de rotas', '2-5', 'Days of Wonder', 1, '/images/jogos/tickettoride_main.webp', '30-60 minutos', '8+'),
                                                                                                                                                        (5, 'Gloomhaven', 'Prepare-se para a experiência definitiva de Dungeon Crawler. Um mundo vasto e evolutivo espera por você e seu grupo de mercenários. Com combates táticos baseados em cartas (sem dados!).', 499.90, true, 0, 'Combate tático, RPG', '1-4', 'Cephalofair Games', 1, '/images/jogos/gloomhaven_main.webp', '60-120 minutos', '14+'),
                                                                                                                                                        (6, 'Azul', 'Torne-se um mestre artesão e decore as paredes do Palácio Real de Évora. Um jogo de beleza abstrata onde você deve selecionar azulejos coloridos e organizá-los estrategicamente.', 149.90, false, 50, 'Abstrato, Estratégia', '2-4', 'Next Move Games', 1, '/images/jogos/azul_main.jpeg', '30-45 minutos', '8+'),
                                                                                                                                                        (7, 'Carcassonne', 'Construa a paisagem medieval da França, peça por peça. Crie cidades fortificadas, campos vastos e estradas sinuosas. Use seus seguidores (meeples) com sabedoria para pontuar e bloquear os oponentes.', 129.90, true, 50, 'Colocação de peças', '2-5', 'Z-Man Games', 1, '/images/jogos/carcassonne_main.jpg', '35 minutos', '7+'),
                                                                                                                                                        (8, '7 Wonders', 'Lidere uma das sete grandes cidades do mundo antigo. Em apenas três eras, desenvolva sua civilização militar, científica e culturalmente. Com uma mecânica de draft de cartas ágil.', 219.90, false, 50, 'Draft de cartas', '2-7', 'Repos Production', 1, '/images/jogos/7wonders_main.jpg', '30 minutos', '10+'),
                                                                                                                                                        (9, 'Distilled', 'Herde a destilaria da família e busque o título de Mestre Destilador. Gerencie recursos, compre ingredientes de qualidade e envelheça suas bebidas em barris.', 349.90, false, 50, 'Gestão de recursos', '1-5', 'Paverson Games', 1, '/images/jogos/distilled_main.webp', '60-120 minutos', '14+'),
                                                                                                                                                        (10, 'Splendor', 'Entre na pele de um rico mercador da Renascença. Use suas fichas de pedras preciosas para adquirir minas, meios de transporte e artesãos, transformando pedras brutas em joias magníficas.', 179.90, true, 50, 'Coleção de componentes', '2-4', 'Space Cowboys', 1, '/images/jogos/splendor_main.jpg', '30 minutos', '10+'),
                                                                                                                                                        (11, 'Magic: The Gathering', 'O avô dos Trading Card Games. Assuma o papel de um Planeswalker e conjure magias poderosas, criaturas lendárias e artefatos ancestrais.', 129.90, false, 50, 'Card Game, Estratégia', '2+', 'Wizards', 2, '/images/jogos/magic_the_gathering_main.jpg', '20-60 minutos', '13+'),
                                                                                                                                                        (12, 'UNO', 'O rei da diversão em família! Combine cores e números, use cartas de ação para atrapalhar seus amigos e seja o primeiro a ficar sem cartas.', 29.90, true, 50, 'Familiar', '2-10', 'Mattel', 2, '/images/jogos/uno_main.jpg', '30 minutos', '7+'),
                                                                                                                                                        (13, 'Exploding Kittens', 'Uma versão de Roleta Russa, mas com gatinhos... e explosões! Compre cartas até alguém explodir e perder o jogo. Use cartas de desarmar, pular e atacar para passar a bomba.', 69.90, false, 0, 'Sorte, Estratégia', '2-5', 'Exploding Kittens', 2, '/images/jogos/exploding_kittens_main.jpg', '15 minutos', '7+'),
                                                                                                                                                        (14, 'Cards Against Humanity', 'Um jogo de festa para pessoas horríveis. Complete frases com as respostas mais absurdas, ofensivas e hilárias possíveis.', 99.90, true, 50, 'Humor, Adulto', '4-20', 'CAH', 2, '/images/jogos/cards_main.jpg', '30-90 minutos', '17+'),
                                                                                                                                                        (15, 'The Game', 'Vocês são uma equipe contra o jogo. O objetivo é simples: descartar todas as 98 cartas em quatro pilhas. O problema? Vocês não podem dizer quais números têm na mão.', 49.90, false, 50, 'Cooperativo', '1-5', 'NSV', 2, '/images/jogos/game_main.webp', '20 minutos', '8+'),
                                                                                                                                                        (16, 'Dominion', 'O jogo que inventou o gênero de Deck Building. Você começa com um pequeno baralho de propriedades e cobres, e deve adquirir cartas melhores para tornar seu reino o mais próspero.', 179.90, true, 50, 'Deck Building', '2-4', 'Rio Grande', 2, '/images/jogos/dominion_main.png', '30 minutos', '13+'),
                                                                                                                                                        (17, 'Love Letter', 'Conquiste o coração da Princesa Annette... ou seja eliminado tentando. Um jogo de risco, dedução e sorte com apenas 16 cartas.', 39.90, false, 50, 'Dedução, Rápido', '2-6', 'Z-Man Games', 2, '/images/jogos/love_letter_main.jpg', '20 minutos', '10+'),
                                                                                                                                                        (18, 'Race for the Galaxy', 'Construa uma civilização galáctica usando cartas que representam mundos e desenvolvimentos técnicos. Um jogo de engine building profundo e rápido.', 149.90, false, 50, 'Estratégia, Cartas', '2-4', 'Rio Grande', 2, '/images/jogos/race_main.jpg', '30-60 minutos', '12+'),
                                                                                                                                                        (19, 'Codenames', 'O jogo definitivo de espiões e palavras. Dois mestres de espionagem dão pistas de uma palavra para que seus times encontrem seus agentes no campo.', 89.90, true, 50, 'Party Game', '2-8', 'CGE', 2, '/images/jogos/codenames_main.webp', '15-20 minutos', '10+'),
                                                                                                                                                        (20, 'The Mind', 'Mais que um jogo, uma experiência. Joguem cartas em ordem crescente (1-100) sem falar, sem sinais, sem comunicação. Apenas olhem nos olhos uns dos outros.', 49.90, false, 50, 'Cooperativo', '2-4', 'Pandasaurus', 2, '/images/jogos/mind_main.webp', '20 minutos', '8+'),
                                                                                                                                                        (21, 'Organizer Gloomhaven', 'Domine o caos da caixa do Gloomhaven! Este organizer de madeira de alta qualidade agiliza o setup do jogo.', 149.00, false, 50, NULL, NULL, 'Meeple Realty', 3, '/images/acessorios/havenbox1.webp', NULL, NULL),
                                                                                                                                                        (22, 'Playmat Magic', 'Proteja suas cartas e jogue com estilo. Este playmat oficial da Ultra Pro apresenta arte vibrante de Planeswalker.', 89.00, true, 50, NULL, NULL, 'Ultra Pro', 3, '/images/acessorios/playmatmagic1.jpg', NULL, NULL),
                                                                                                                                                        (23, 'Dados RPG D&D', 'Role com classe. Este conjunto completo de 7 dados da Chessex apresenta um acabamento marmorizado azul profundo.', 39.00, false, 50, NULL, NULL, 'Chessex', 3, '/images/acessorios/dados1.webp', NULL, NULL),
                                                                                                                                                        (24, 'Sleeves Premium', 'A armadura que suas cartas merecem. Sleeves Dragon Shield Matte são a referência do mercado: resistência superior e embaralhamento suave.', 29.00, false, 0, NULL, NULL, 'Dragon Shield', 3, '/images/acessorios/sleeve1.webp', NULL, NULL),
                                                                                                                                                        (25, 'Caixa Zombicide', 'Sobreviva ao apocalipse, não à bagunça. Inserto de MDF da E-Raptor projetado especificamente para Zombicide.', 159.00, false, 50, NULL, NULL, 'E-Raptor', 3, '/images/acessorios/zombiebox1.webp', NULL, NULL),
                                                                                                                                                        (26, 'Tokens Vida Magic', 'Mantenha o controle do jogo com clareza. Estes tokens de vida oficiais em acrílico são robustos e fáceis de ler.', 19.00, false, 50, NULL, NULL, 'Wizards', 3, '/images/acessorios/tokensvida1.webp', NULL, NULL),
                                                                                                                                                        (27, 'Tapete Catan', 'A ilha de Catan, agora estável! Este tapete de neoprene da Mayfair Games segura os hexágonos do tabuleiro no lugar.', 99.00, false, 50, NULL, NULL, 'Mayfair', 3, '/images/acessorios/tapetecatan1.webp', NULL, NULL),
                                                                                                                                                        (28, 'Miniaturas RPG', 'Dê vida à sua campanha. Este pack da WizKids traz 5 heróis clássicos de fantasia com esculturas detalhadas.', 59.00, true, 50, NULL, NULL, 'WizKids', 3, '/images/acessorios/minirpg1.webp', NULL, NULL),
                                                                                                                                                        (29, 'Deck Box Magic', 'A casa do seu deck favorito. Deck Box sólida da Ultra Pro com arte temática, comporta até 100 cartas com sleeves.', 49.00, false, 50, NULL, NULL, 'Ultra Pro', 3, '/images/acessorios/magicbox1.jpg', NULL, NULL),
                                                                                                                                                        (30, 'Shield Mestre D&D', 'O segredo do Mestre está seguro. Este escudo de 4 painéis é feito de material rígido e durável.', 129.00, false, 50, NULL, NULL, 'Gale Force Nine', 3, '/images/acessorios/dnd_shield_1.jpg', NULL, NULL);

-- ########## IMAGENS SECUNDÁRIAS ##########
INSERT INTO tb_product_images (product_id, image_url) VALUES
                                                          (1, '/images/jogos/terramystica-1.jpg'), (1, '/images/jogos/terramystica-2.jpg'),
                                                          (2, '/images/jogos/catan_1.jpg'), (2, '/images/jogos/catan_2.webp'),
                                                          (3, '/images/jogos/pandemic_1.webp'), (3, '/images/jogos/pandemic_2.webp'),
                                                          (4, '/images/jogos/tickettoride_1.jpeg'), (4, '/images/jogos/tickettoride_2.webp'),
                                                          (5, '/images/jogos/gloomhaven_1.webp'), (5, '/images/jogos/gloomhaven_2.webp'),
                                                          (6, '/images/jogos/azul_1.jpg'), (6, '/images/jogos/azul_2.webp'),
                                                          (7, '/images/jogos/carcassonne_1.jpg'), (7, '/images/jogos/carcassonne_2.webp'),
                                                          (8, '/images/jogos/7wonders_1.png'), (8, '/images/jogos/7wonders_2.webp'),
                                                          (9, '/images/jogos/distilled_1.jpg'), (9, '/images/jogos/distilled_2.jpg'),
                                                          (10, '/images/jogos/splendor_1.jpg'), (10, '/images/jogos/splendor_2.webp'),
                                                          (11, '/images/jogos/magic_the_gathering_1.jpg'), (11, '/images/jogos/magic_the_gathering_2.jpg'),
                                                          (12, '/images/jogos/uno_1.jpg'), (12, '/images/jogos/uno_2.jpg'),
                                                          (13, '/images/jogos/exploding_kittens_1.jpg'), (13, '/images/jogos/exploding_kittens_2.jpg'),
                                                          (14, '/images/jogos/cards1.png'), (14, '/images/jogos/cards2.jpg'),
                                                          (15, '/images/jogos/game1.jpg'),
                                                          (16, '/images/jogos/dominion_1.jpg'), (16, '/images/jogos/dominion_2.jpg'),
                                                          (17, '/images/jogos/love_letter_1.webp'), (17, '/images/jogos/love_letter_2.png'),
                                                          (18, '/images/jogos/race_1.jpg'), (18, '/images/jogos/race_2.jpg'),
                                                          (19, '/images/jogos/codenames_1.webp'), (19, '/images/jogos/codenames_2.jpg'),
                                                          (20, '/images/jogos/mind_1.webp'), (20, '/images/jogos/mind_2.jpg'),
                                                          (21, '/images/acessorios/havenbox2.webp'), (21, '/images/acessorios/havenbox3.png'),
                                                          (22, '/images/acessorios/playmatmagic2.jpg'), (22, '/images/acessorios/playmatmagic3.webp'),
                                                          (23, '/images/acessorios/dados2.jpg'),
                                                          (24, '/images/acessorios/sleeve2.webp'), (24, '/images/acessorios/sleeve3.webp'),
                                                          (25, '/images/acessorios/zombiebox2.webp'), (25, '/images/acessorios/zombiebox3.webp'),
                                                          (26, '/images/acessorios/tokensvida2.webp'), (26, '/images/acessorios/tokensvida3.webp'),
                                                          (27, '/images/acessorios/tapetecatan2.webp'), (27, '/images/acessorios/tapetecatan3.webp'),
                                                          (28, '/images/acessorios/minirpg2.webp'), (28, '/images/acessorios/minirpg3.webp'),
                                                          (29, '/images/acessorios/magicbox2.jpg'), (29, '/images/acessorios/magicbox3.jpg'),
                                                          (30, '/images/acessorios/dnd_shield_2.jpg'), (30, '/images/acessorios/dnd_shield_3.jpg');

-- ########## CUPONS ##########
INSERT INTO tb_coupon (id, code, discount_value, active, valid_until) VALUES
    (1, 'BOARDS10', 10.00, true, '2030-12-31');

-- ########## CARRINHO (MARIA LIMA) ##########
INSERT INTO tb_cart (id, user_id) VALUES (1, 4);
INSERT INTO tb_cart_item (id, cart_id, product_id, quantity, price_at_save) VALUES
                                                                                (1, 1, 6, 1, 149.90),  -- Azul
                                                                                (2, 1, 19, 1, 89.90);  -- Codenames

-- ########## PEDIDOS (TB_ORDER) ##########
-- 1. Pedido JOÃO (PENDING)
INSERT INTO tb_order (id, date, total, shipping, discount, status, client_name, client_email, client_cpf, client_phone, city, street, number, neighborhood, state, zip, description, user_id) VALUES
    (1, '2025-11-27', 104.90, 15.00, 0.00, 'PENDING', 'João Silva', 'joao.silva@email.com', '111.111.111-11', '46999998888', 'Pato Branco', 'Rua das Flores', '123', 'Centro', 'PR', '85501-100', 'Cartão de Crédito', 1);

-- 2. Pedido ANA (DELIVERED)
INSERT INTO tb_order (id, date, total, shipping, discount, status, client_name, client_email, client_cpf, client_phone, city, street, number, neighborhood, state, zip, description, tracking_code, user_id) VALUES
    (2, '2025-10-10', 159.90, 20.00, 10.00, 'DELIVERED', 'Ana Souza', 'ana.souza@email.com', '222.222.222-22', '46988887777', 'Pato Branco', 'Avenida Brasil', '2024', 'La Salle', 'PR', '85502-200', 'PIX', 'BR123456789', 2);

-- 3. Pedido CARLOS (SHIPPED)
INSERT INTO tb_order (id, date, total, shipping, discount, status, client_name, client_email, client_cpf, client_phone, city, street, number, neighborhood, state, zip, description, tracking_code, user_id) VALUES
    (3, '2025-11-20', 217.90, 18.00, 0.00, 'SHIPPED', 'Carlos Santos', 'carlos.santos@email.com', '333.333.333-33', '46977776666', 'Pato Branco', 'Rua da Paz', '456', 'Industrial', 'PR', '85503-300', 'Cartão de Crédito', 'BR987654321', 3);

-- 4. Pedido MARIA (PENDING)
INSERT INTO tb_order (id, date, total, shipping, discount, status, client_name, client_email, client_cpf, client_phone, city, street, number, neighborhood, state, zip, description, user_id) VALUES
    (4, '2025-11-28', 41.90, 12.00, 0.00, 'PENDING', 'Maria Lima', 'maria.lima@email.com', '444.444.444-44', '46966665555', 'Pato Branco', 'Avenida Tupi', '1000', 'Centro', 'PR', '85504-400', 'Boleto', 4);

-- 5. Pedido MARIA (PAID)
INSERT INTO tb_order (id, date, total, shipping, discount, status, client_name, client_email, client_cpf, client_phone, city, street, number, neighborhood, state, zip, description, user_id) VALUES
    (5, '2025-11-27', 136.90, 12.00, 5.00, 'PAID', 'Maria Lima', 'maria.lima@email.com', '444.444.444-44', '46966665555', 'Pato Branco', 'Avenida Tupi', '1000', 'Centro', 'PR', '85504-400', 'Boleto', 4);

-- 6. Pedido MARIA (SHIPPED)
INSERT INTO tb_order (id, date, total, shipping, discount, status, client_name, client_email, client_cpf, client_phone, city, street, number, neighborhood, state, zip, description, tracking_code, user_id) VALUES
    (6, '2025-11-25', 314.90, 15.00, 0.00, 'SHIPPED', 'Maria Lima', 'maria.lima@email.com', '444.444.444-44', '46966665555', 'Pato Branco', 'Avenida Tupi', '1000', 'Centro', 'PR', '85504-400', 'Boleto', 'TRK11223344', 4);

-- 7. Pedido MARIA (DELIVERED)
INSERT INTO tb_order (id, date, total, shipping, discount, status, client_name, client_email, client_cpf, client_phone, city, street, number, neighborhood, state, zip, description, tracking_code, user_id) VALUES
    (7, '2025-10-01', 479.90, 0.00, 20.00, 'DELIVERED', 'Maria Lima', 'maria.lima@email.com', '444.444.444-44', '46966665555', 'Pato Branco', 'Avenida Tupi', '1000', 'Centro', 'PR', '85504-400', 'Boleto', 'TRK55667788', 4);

-- 8. Pedido MARIA (CANCELED)
INSERT INTO tb_order (id, date, total, shipping, discount, status, client_name, client_email, client_cpf, client_phone, city, street, number, neighborhood, state, zip, description, user_id) VALUES
    (8, '2025-09-15', 139.90, 10.00, 0.00, 'CANCELED', 'Maria Lima', 'maria.lima@email.com', '444.444.444-44', '46966665555', 'Pato Branco', 'Avenida Tupi', '1000', 'Centro', 'PR', '85504-400', 'Boleto', 4);


-- ########## ITENS DOS PEDIDOS (TB_ORDER_ITEMS) ##########
INSERT INTO tb_order_items (id, order_id, product_id, quantity, unit_price, subtotal) VALUES
                                                                                          (1, 1, 19, 1, 89.90, 89.90),
                                                                                          (2, 2, 6, 1, 149.90, 149.90),
                                                                                          (3, 3, 4, 1, 199.90, 199.90),
                                                                                          (4, 4, 12, 1, 29.90, 29.90),
                                                                                          (5, 5, 7, 1, 129.90, 129.90),
                                                                                          (6, 6, 1, 1, 299.90, 299.90),
                                                                                          (7, 7, 5, 1, 499.90, 499.90),
                                                                                          (8, 8, 11, 1, 129.90, 129.90);

-- ########## RESTART SEQUENCE ##########
ALTER TABLE tb_user ALTER COLUMN id RESTART WITH 10;
ALTER TABLE tb_address ALTER COLUMN id RESTART WITH 10;
ALTER TABLE tb_category ALTER COLUMN id RESTART WITH 10;
ALTER TABLE tb_product ALTER COLUMN id RESTART WITH 100;
ALTER TABLE tb_order ALTER COLUMN id RESTART WITH 100;
ALTER TABLE tb_order_items ALTER COLUMN id RESTART WITH 100;
ALTER TABLE tb_payment_method ALTER COLUMN id RESTART WITH 10;
ALTER TABLE tb_cart ALTER COLUMN id RESTART WITH 10;
ALTER TABLE tb_cart_item ALTER COLUMN id RESTART WITH 10;
ALTER TABLE tb_coupon ALTER COLUMN id RESTART WITH 10;