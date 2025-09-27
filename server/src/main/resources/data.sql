-- ########## CATEGORIAS (IDs: 1, 2, 3) ##########
INSERT INTO tb_category (name) VALUES ('Jogos de Estratégia');
INSERT INTO tb_category (name) VALUES ('Jogos Familiares');
INSERT INTO tb_category (name) VALUES ('Jogos Cooperativos');

-- ########## USUÁRIOS (IDs: 1, 2) ##########
-- Senha para ambos: 'P4ssword' (já criptografada com BCrypt)
INSERT INTO tb_user (username, display_name, password, phone) VALUES ('joao.silva', 'João Silva', '$2a$10$Z3s5S.sR9.gh2unC5s/vL.9K.a2zQd.uHl.24gJ.bT3a/f9jX5.Sm', '46999998888');
INSERT INTO tb_user (username, display_name, password, phone) VALUES ('ana.souza', 'Ana Souza', '$2a$10$Z3s5S.sR9.gh2unC5s/vL.9K.a2zQd.uHl.24gJ.bT3a/f9jX5.Sm', '46988887777');

-- ########## PRODUTOS (IDs: 1, 2, 3, 4) ##########
INSERT INTO tb_product (name, description, price, promo, stock, mechanics, players, editor, category_id) VALUES ('Catan', 'Um jogo clássico de negociação e estratégia.', 299.90, false, 50, 'Negociação, Gestão de Recursos', '3-4', 'Devir', 1);
INSERT INTO tb_product (name, description, price, promo, stock, mechanics, players, editor, category_id) VALUES ('Ticket to Ride', 'Colete cartas de trem para conectar cidades.', 199.90, true, 30, 'Coleção de Componentes, Rotas', '2-5', 'Galápagos', 2);
INSERT INTO tb_product (name, description, price, promo, stock, mechanics, players, editor, category_id) VALUES ('Pandemic', 'Jogadores trabalham juntos para salvar o mundo de doenças.', 249.50, false, 25, 'Cooperativo, Gestão de Mão', '2-4', 'Devir', 3);
INSERT INTO tb_product (name, description, price, promo, stock, mechanics, players, editor, category_id) VALUES ('7 Wonders', 'Desenvolva sua civilização através de eras.', 280.00, false, 40, 'Draft de Cartas', '3-7', 'Galápagos', 1);

-- ########## ENDEREÇOS (IDs: 1, 2) ##########
INSERT INTO tb_address (street, city, state, zip, complement, user_id) VALUES ('Rua das Flores, 123', 'Pato Branco', 'PR', '85501-100', 'Apto 101', 1);
INSERT INTO tb_address (street, city, state, zip, complement, user_id) VALUES ('Avenida Brasil, 2024', 'Pato Branco', 'PR', '85502-200', 'Casa', 2);

-- ########## MÉTODOS DE PAGAMENTO (IDs: 1, 2) ##########
INSERT INTO tb_payment_method (type, description, user_id) VALUES ('Cartão de Crédito', 'Visa final 4242', 1);
INSERT INTO tb_payment_method (type, description, user_id) VALUES ('PIX', 'Chave aleatória', 2);

-- ########## PEDIDOS (INVOICES) E ITENS (IDs: 1, 2, 3, 4) ##########

-- #### Pedido 1 (ID: 1) para João Silva (User 1) - Status: SHIPPED
INSERT INTO tb_invoice (date, status, total, tracking_code, user_id, address_id, payment_method_id) VALUES ('2025-09-20', 'SHIPPED', 299.90, 'BR123456789XX', 1, 1, 1);
INSERT INTO tb_invoice_items (quantity, unit_price, subtotal, invoice_id, product_id) VALUES (1, 299.90, 299.90, 1, 1); -- 1x Catan

-- #### Pedido 2 (ID: 2) para João Silva (User 1) - Status: PAID
INSERT INTO tb_invoice (date, status, total, user_id, address_id, payment_method_id) VALUES ('2025-09-26', 'PAID', 529.50, 1, 1, 1);
INSERT INTO tb_invoice_items (quantity, unit_price, subtotal, invoice_id, product_id) VALUES (1, 249.50, 249.50, 2, 3); -- 1x Pandemic
INSERT INTO tb_invoice_items (quantity, unit_price, subtotal, invoice_id, product_id) VALUES (1, 280.00, 280.00, 2, 4); -- 1x 7 Wonders

-- #### Pedido 3 (ID: 3) para Ana Souza (User 2) - Status: DELIVERED
INSERT INTO tb_invoice (date, status, total, user_id, address_id, payment_method_id) VALUES ('2025-08-15', 'DELIVERED', 399.80, 2, 2, 2);
INSERT INTO tb_invoice_items (quantity, unit_price, subtotal, invoice_id, product_id) VALUES (2, 199.90, 399.80, 3, 2); -- 2x Ticket to Ride

-- #### Pedido 4 (ID: 4) para Ana Souza (User 2) - Status: PENDING
INSERT INTO tb_invoice (date, status, total, user_id, address_id, payment_method_id) VALUES ('2025-09-27', 'PENDING', 299.90, 2, 2, 2);
INSERT INTO tb_invoice_items (quantity, unit_price, subtotal, invoice_id, product_id) VALUES (1, 299.90, 299.90, 4, 1); -- 1x Catan