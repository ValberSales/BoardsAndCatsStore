-- ########## CATEGORIAS (IDs: 1, 2, 3, 4) ##########
INSERT INTO tb_category (name) VALUES ('Estratégia'), ('Familiar'), ('Cooperativo'), ('Party Game');

-- ########## USUÁRIOS (IDs: 1, 2, 3, 4) ##########
-- Senha para todos: 'P4ssword' (já criptografada com BCrypt)
INSERT INTO tb_user (username, display_name, password, phone) VALUES
                                                                  ('joao.silva', 'João Silva', '$2a$10$/cLFiA7e2tlMvcz/bcMKke0vBdcSwhUml7jogKP2MZiE1c/m1hc6i', '46999998888'),
                                                                  ('ana.souza', 'Ana Souza', '$2a$10$/cLFiA7e2tlMvcz/bcMKke0vBdcSwhUml7jogKP2MZiE1c/m1hc6i', '46988887777'),
                                                                  ('carlos.santos', 'Carlos Santos', '$2a$10$/cLFiA7e2tlMvcz/bcMKke0vBdcSwhUml7jogKP2MZiE1c/m1hc6i', '46977776666'),
                                                                  ('maria.lima', 'Maria Lima', '$2a$10$/cLFiA7e2tlMvcz/bcMKke0vBdcSwhUml7jogKP2MZiE1c/m1hc6i', '46966665555');

-- ########## PRODUTOS (IDs: 1, 2, 3, 4, 5) ##########
INSERT INTO tb_product (name, description, price, promo, stock, mechanics, players, editor, category_id) VALUES
                                                                                                             ('Catan', 'Um jogo clássico de negociação e estratégia.', 299.90, false, 50, 'Negociação, Gestão de Recursos', '3-4', 'Devir', 1),
                                                                                                             ('Ticket to Ride', 'Colete cartas de trem para conectar cidades.', 199.90, true, 30, 'Coleção de Componentes, Rotas', '2-5', 'Galápagos', 2),
                                                                                                             ('Pandemic', 'Trabalhem juntos para salvar o mundo de doenças.', 249.50, false, 25, 'Cooperativo, Gestão de Mão', '2-4', 'Devir', 3),
                                                                                                             ('7 Wonders', 'Desenvolva sua civilização através de eras.', 280.00, false, 40, 'Draft de Cartas', '3-7', 'Galápagos', 1),
                                                                                                             ('Codenames', 'Dê pistas de uma só palavra para seus companheiros.', 120.00, true, 100, 'Dedução, Jogo em Equipe', '2-8+', 'Devir', 4);

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

-- ########## PEDIDOS (ORDERS) E ITENS ##########

-- #### Pedidos de João Silva (User 1) ####
-- Pedido 1 (ID: 1) - Status: DELIVERED
INSERT INTO tb_order (date, status, total, user_id, street, city, state, zip, description) VALUES
    ('2025-08-10', 'DELIVERED', 499.80, 1, 'Rua das Flores, 123', 'Pato Branco', 'PR', '85501-100', 'Cartão de Crédito - Visa final 4242');
INSERT INTO tb_order_items (quantity, unit_price, subtotal, order_id, product_id) VALUES
                                                                                      (1, 299.90, 299.90, 1, 1), -- 1x Catan
                                                                                      (1, 199.90, 199.90, 1, 2); -- 1x Ticket to Ride

-- Pedido 2 (ID: 2) - Status: SHIPPED
INSERT INTO tb_order (date, status, total, tracking_code, user_id, street, city, state, zip, description) VALUES
    ('2025-09-22', 'SHIPPED', 529.50, 'BR123XYZ', 1, 'Rua Principal, 789', 'Pato Branco', 'PR', '85501-200', 'PIX - Chave (46) 99999-8888');
INSERT INTO tb_order_items (quantity, unit_price, subtotal, order_id, product_id) VALUES
                                                                                      (1, 249.50, 249.50, 2, 3), -- 1x Pandemic
                                                                                      (1, 280.00, 280.00, 2, 4); -- 1x 7 Wonders

-- #### Pedidos de Ana Souza (User 2) ####
-- Pedido 3 (ID: 3) - Status: CANCELED
INSERT INTO tb_order (date, status, total, user_id, street, city, state, zip, description) VALUES
    ('2025-09-01', 'CANCELED', 120.00, 2, 'Avenida Brasil, 2024', 'Pato Branco', 'PR', '85502-200', 'PIX - Chave aleatória');
INSERT INTO tb_order_items (quantity, unit_price, subtotal, order_id, product_id) VALUES
    (1, 120.00, 120.00, 3, 5); -- 1x Codenames

-- #### Pedidos de Carlos Santos (User 3) ####
-- Pedido 4 (ID: 4) - Status: PAID
INSERT INTO tb_order (date, status, total, user_id, street, city, state, zip, description) VALUES
    ('2025-09-28', 'PAID', 499.00, 3, 'Rua da Paz, 456', 'Pato Branco', 'PR', '85503-300', 'Cartão de Crédito - Mastercard final 5555');
INSERT INTO tb_order_items (quantity, unit_price, subtotal, order_id, product_id) VALUES
    (2, 249.50, 499.00, 4, 3); -- 2x Pandemic

-- #### Carrinho Ativo de Maria Lima (User 4) ####
-- Pedido 5 (ID: 5) - Status: CART
INSERT INTO tb_order (date, status, total, user_id) VALUES
    (CURRENT_DATE, 'CART', 419.90, 4); -- Endereço e pagamento são nulos no carrinho
INSERT INTO tb_order_items (quantity, unit_price, subtotal, order_id, product_id) VALUES
                                                                                      (1, 299.90, 299.90, 5, 1), -- 1x Catan
                                                                                      (1, 120.00, 120.00, 5, 5); -- 1x Codenames