-- ########## CATEGORIAS (IDs: 1, 2, 3) ##########
INSERT INTO tb_category (name) VALUES 
('Jogos de Tabuleiro'), -- ID 1
('Card Games'),         -- ID 2
('Acessórios');         -- ID 3

-- ########## USUÁRIOS (IDs: 1, 2, 3, 4) ##########
-- Senha para todos: 'P4ssword' (já criptografada com BCrypt)
INSERT INTO tb_user (id, username, display_name, password, phone) VALUES
(1, 'joao.silva', 'João Silva', '$2a$10$/cLFiA7e2tlMvcz/bcMKke0vBdcSwhUml7jogKP2MZiE1c/m1hc6i', '46999998888'),
(2, 'ana.souza', 'Ana Souza', '$2a$10$/cLFiA7e2tlMvcz/bcMKke0vBdcSwhUml7jogKP2MZiE1c/m1hc6i', '46988887777'),
(3, 'carlos.santos', 'Carlos Santos', '$2a$10$/cLFiA7e2tlMvcz/bcMKke0vBdcSwhUml7jogKP2MZiE1c/m1hc6i', '46977776666'),
(4, 'maria.lima', 'Maria Lima', '$2a$10$/cLFiA7e2tlMvcz/bcMKke0vBdcSwhUml7jogKP2MZiE1c/m1hc6i', '46966665555');

-- ########## ENDEREÇOS ##########
INSERT INTO tb_address (street, city, state, zip, complement, user_id) VALUES
('Rua das Flores, 123', 'Pato Branco', 'PR', '85501-100', 'Apto 101', 1),
('Rua Principal, 789', 'Pato Branco', 'PR', '85501-200', 'Casa', 1),
('Avenida Brasil, 2024', 'Pato Branco', 'PR', '85502-200', 'Casa', 2),
('Rua da Paz, 456', 'Pato Branco', 'PR', '85503-300', 'Fundos', 3),
('Avenida Tupi, 1000', 'Pato Branco', 'PR', '85504-400', 'Comercial', 4);

-- ########## MÉTODOS DE PAGAMENTO ##########
INSERT INTO tb_payment_method (type, description, user_id) VALUES
('Cartão de Crédito', 'Visa final 4242', 1),
('PIX', 'Chave (46) 99999-8888', 1),
('PIX', 'Chave aleatória', 2),
('Cartão de Crédito', 'Mastercard final 5555', 3),
('Boleto', 'Boleto Bancário', 4);

-- ########## PRODUTOS (IDs: 1-30) (AGORA COM IMAGE_URL) ##########
INSERT INTO tb_product (name, description, price, promo, stock, mechanics, players, editor, category_id, image_url) VALUES
('Terra Mystica', 'Terra Mystica é um jogo de tabuleiro estratégico...', 299.90, true, 50, 'Controle de área, Desenvolvimento, Negociação', '2-5', 'Feuerland Spiele', 1, '/images/jogos/terramystica-main.jpg'),
('Catan', 'Catan é um jogo de construção de estradas e cidades...', 249.90, false, 50, 'Gestão de recursos, Colocação de trabalhadores, Negociação', '3-4', 'KOSMOS', 1, '/images/jogos/catan_main.jpg'),
('Pandemic', 'Pandemic é um jogo cooperativo onde os jogadores...', 189.90, true, 50, 'Cooperativo, Gestão de mão, Ação em tempo real', '2-4', 'Z-Man Games', 1, '/images/jogos/pandemic_main.jpg'),
('Ticket to Ride', 'Ticket to Ride é um jogo de estratégia em que os jogadores...', 199.90, false, 50, 'Gestão de mão, Construção de rotas, Controle de área', '2-5', 'Days of Wonder', 1, '/images/jogos/tickettoride_main.webp'),
('Gloomhaven', 'Gloomhaven é um jogo de combate tático...', 499.90, true, 50, 'Combate tático, Exploração, Narrativa dirigida por cartas', '1-4', 'Cephalofair Games', 1, '/images/jogos/gloomhaven_main.webp'),
('Azul', 'Azul é um jogo de tabuleiro abstrato onde os jogadores...', 149.90, false, 50, 'Colecionar conjuntos, Colocação de peças, Gestão de recursos', '2-4', 'Next Move Games', 1, '/images/jogos/azul_main.jpeg'),
('Carcassonne', 'Carcassonne é um jogo de colocação de peças...', 129.90, true, 50, 'Controle de área, Colocação de peças, Colecionar pontos', '2-5', 'Z-Man Games', 1, '/images/jogos/carcassonne_main.jpg'),
('7 Wonders', '7 Wonders é um jogo de cartas onde os jogadores...', 219.90, false, 50, 'Construção de cidades, Gestão de recursos, Gestão de mão', '2-7', 'Repos Production', 1, '/images/jogos/7wonders_main.jpg'),
('Distilled', 'Distilled é um jogo de tabuleiro estratégico sobre destilação...', 349.90, false, 50, 'Gestão de mão, Construção de baralho, Colocação de trabalhadores', '1-5', 'Paverson Games', 1, '/images/jogos/distilled_main.webp'),
('Splendor', 'Splendor é um jogo de coleção de recursos...', 179.90, true, 50, 'Colecionar recursos, Gestão de mão, Desenvolvimento econômico', '2-4', 'Space Cowboys', 1, '/images/jogos/splendor_main.jpg'),
('Magic: The Gathering', 'Magic: The Gathering é um jogo de cartas colecionáveis...', 129.90, false, 50, 'Construção de Deck, Gestão de Recursos, Colecionável', '2+', 'Wizards of the Coast', 2, '/images/jogos/magic_the_gathering_main.jpg'),
('UNO', 'UNO é um jogo de cartas popular onde os jogadores...', 29.90, true, 50, 'Jogo de Descarte, Gestão de Mão, Ação em Tempo Real', '2-10', 'Mattel', 2, '/images/jogos/uno_main.jpg'),
('Exploding Kittens', 'Exploding Kittens é um jogo de cartas de sorte...', 69.90, false, 50, 'Gestão de Mão, Eliminação de Jogadores, Ação em Tempo Real', '2-5', 'Exploding Kittens, LLC', 2, '/images/jogos/exploding_kittens_main.jpg'),
('Cards Against Humanity', 'Cards Against Humanity é um jogo de cartas de humor negro...', 99.90, true, 50, 'Associação de Palavras, Jogo de Festa, Gestão de Mão', '4-20', 'Cards Against Humanity, LLC', 2, '/images/jogos/cards_main.jpg'),
('The Game', 'The Game é um jogo de cartas cooperativo...', 49.90, false, 50, 'Cooperativo, Gestão de Mão, Estratégia', '1-5', 'NSV', 2, '/images/jogos/game_main.webp'),
('Dominion', 'Dominion é um jogo de construção de deck...', 179.90, true, 50, 'Construção de Deck, Gestão de Mão, Estratégia', '2-4', 'Rio Grande Games', 2, '/images/jogos/dominion_main.png'),
('Love Letter', 'Love Letter é um jogo de cartas simples e estratégico...', 39.90, false, 50, 'Eliminação de Jogadores, Gestão de Mão, Ação em Tempo Real', '2-6', 'Z-Man Games', 2, '/images/jogos/love_letter_main.jpg'),
('Race for the Galaxy', 'Race for the Galaxy é um jogo de construção de impérios...', 149.90, false, 50, 'Construção de Deck, Gestão de Mão, Gestão de Recursos', '2-4', 'Rio Grande Games', 2, '/images/jogos/race_main.jpg'),
('Codenames', 'Codenames é um jogo de associação de palavras...', 89.90, true, 50, 'Associação de Palavras, Jogo de Equipe, Ação em Tempo Real', '2-8', 'Czech Games Edition', 2, '/images/jogos/codenames_main.webp'),
('The Mind', 'The Mind é um jogo cooperativo onde os jogadores...', 49.90, false, 50, 'Cooperativo, Gestão de Mão, Ação em Tempo Real', '2-4', 'Pandasaurus Games', 2, '/images/jogos/mind_main.webp'),
('Organizer para Gloomhaven', 'Organizer personalizado para Gloomhaven...', 149.00, false, 50, null, null, 'Meeple Realty', 3, '/images/acessorios/havenbox1.webp'),
('Playmat Magic: The Gathering - Planeswalker', 'Tapete de jogo para Magic: The Gathering...', 89.00, true, 50, null, null, 'Ultra Pro', 3, '/images/acessorios/playmatmagic1.jpg'),
('Kit de Dados de RPG D&D - Marble Blue', 'Conjunto de 7 dados de RPG para Dungeons & Dragons...', 39.00, false, 50, null, null, 'Chessex', 3, '/images/acessorios/dados1.webp'),
('Sleeves Premium - 100 unidades', 'Protetores de cartas premium, pack com 100 unidades...', 29.00, false, 50, null, null, 'Dragon Shield', 3, '/images/acessorios/sleeve1.webp'),
('Caixa Organizadora para Zombicide', 'Caixa organizadora para Zombicide...', 159.00, false, 50, null, null, 'E-Raptor', 3, '/images/acessorios/zombiebox1.webp'),
('Tokens de Vida - Magic: The Gathering', 'Conjunto de tokens de vida para Magic: The Gathering...', 19.00, false, 50, null, null, 'Wizards of the Coast', 3, '/images/acessorios/tokensvida1.webp'),
('Tapete de Jogo para Catan', 'Tapete de jogo personalizado para Catan...', 99.00, false, 50, null, null, 'Mayfair Games', 3, '/images/acessorios/tapetecatan1.webp'),
('Miniaturas de RPG - Pack Heroes', 'Conjunto de miniaturas de heróis para jogos de RPG...', 59.00, true, 50, null, null, 'WizKids', 3, '/images/acessorios/minirpg1.webp'),
('Deck Box - Magic: The Gathering', 'Caixa para armazenamento de decks de Magic: The Gathering...', 49.00, false, 50, null, null, 'Ultra Pro', 3, '/images/acessorios/magicbox1.jpg'),
('Shield de Mestre - D&D', 'Shield de Mestre para Dungeons & Dragons...', 129.00, false, 50, null, null, 'Gale Force Nine', 3, '/images/acessorios/dnd_shield_1.jpg');


-- ########## IMAGENS SECUNDÁRIAS (tb_product_images) ##########
INSERT INTO tb_product_images (product_id, image_url) VALUES
(1, '/images/jogos/terramystica-1.jpg'), (1, '/images/jogos/terramystica-2.jpg'), (1, '/images/jogos/terramystica-3.jpg'),
(2, '/images/jogos/catan_1.jpg'), (2, '/images/jogos/catan_2.webp'), (2, '/images/jogos/catan_3.jpg'),
(3, '/images/jogos/pandemic_1.webp'), (3, '/images/jogos/pandemic_2.webp'), (3, '/images/jogos/pandemic_3.webp'),
(4, '/images/jogos/tickettoride_1.jpeg'), (4, '/images/jogos/tickettoride_2.webp'), (4, '/images/jogos/tickettoride_3.jpg'),
(5, '/images/jogos/gloomhaven_1.webp'), (5, '/images/jogos/gloomhaven_2.webp'), (5, '/images/jogos/gloomhaven_3.jpeg'),
(6, '/images/jogos/azul_1.jpg'), (6, '/images/jogos/azul_2.webp'), (6, '/images/jogos/azul_3.jpg'),
(7, '/images/jogos/carcassonne_1.jpg'), (7, '/images/jogos/carcassonne_2.webp'), (7, '/images/jogos/carcassonne_3.jpg'),
(8, '/images/jogos/7wonders_1.png'), (8, '/images/jogos/7wonders_2.webp'), (8, '/images/jogos/7wonders_3.jpg'),
(9, '/images/jogos/distilled_1.jpg'), (9, '/images/jogos/distilled_2.jpg'), (9, '/images/jogos/distilled_3.webp'),
(10, '/images/jogos/splendor_1.jpg'), (10, '/images/jogos/splendor_2.webp'), (10, '/images/jogos/splendor_3.webp'),
(11, '/images/jogos/magic_the_gathering_1.jpg'), (11, '/images/jogos/magic_the_gathering_2.jpg'), (11, '/images/jogos/magic_the_gathering_3.jpg'),
(12, '/images/jogos/uno_1.jpg'), (12, '/images/jogos/uno_2.jpg'), (12, '/images/jogos/uno_3.jpg'),
(13, '/images/jogos/exploding_kittens_1.jpg'), (13, '/images/jogos/exploding_kittens_2.jpg'), (13, '/images/jogos/exploding_kittens_3.jpg'),
(14, '/images/jogos/cards1.png'), (14, '/images/jogos/cards2.jpg'),
(15, '/images/jogos/game1.jpg'),
(16, '/images/jogos/dominion_1.jpg'), (16, '/images/jogos/dominion_2.jpg'), (16, '/images/jogos/dominion_3.webp'),
(17, '/images/jogos/love_letter_1.webp'), (17, '/images/jogos/love_letter_2.png'), (17, '/images/jogos/love_letter_3.webp'),
(18, '/images/jogos/race_1.jpg'), (18, '/images/jogos/race_2.jpg'), (18, '/images/jogos/race_3.jpg'),
(19, '/images/jogos/codenames_1.webp'), (19, '/images/jogos/codenames_2.jpg'), (19, '/images/jogos/codenames_3.jpg'),
(20, '/images/jogos/mind_1.webp'), (20, '/images/jogos/mind_2.jpg'), (20, '/images/jogos/mind_3.webp'),
(21, '/images/acessorios/havenbox2.webp'), (21, '/images/acessorios/havenbox3.png'), (21, '/images/acessorios/havenbox4.webp'), (21, '/images/acessorios/havenbox5.webp'),
(22, '/images/acessorios/playmatmagic2.jpg'), (22, '/images/acessorios/playmatmagic3.webp'), (22, '/images/acessorios/playmatmagic4.webp'), (22, '/images/acessorios/playmatmagic5.jpg'),
(23, '/images/acessorios/dados2.jpg'),
(24, '/images/acessorios/sleeve2.webp'), (24, '/images/acessorios/sleeve3.webp'),
(25, '/images/acessorios/zombiebox2.webp'), (25, '/images/acessorios/zombiebox3.webp'), (25, '/images/acessorios/zombiebox4.jpg'),
(26, '/images/acessorios/tokensvida2.webp'), (26, '/images/acessorios/tokensvida3.webp'), (26, '/images/acessorios/tokensvida4.webp'),
(27, '/images/acessorios/tapetecatan2.webp'), (27, '/images/acessorios/tapetecatan3.webp'),
(28, '/images/acessorios/minirpg2.webp'), (28, '/images/acessorios/minirpg3.webp'),
(29, '/images/acessorios/magicbox2.jpg'), (29, '/images/acessorios/magicbox3.jpg'),
(30, '/images/acessorios/dnd_shield_2.jpg'), (30, '/images/acessorios/dnd_shield_3.jpg');