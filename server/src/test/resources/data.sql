-- ============================================================================
-- DATA.SQL PARA AMBIENTE DE TESTES
-- ============================================================================

-- 1. CATEGORIAS
INSERT INTO tb_category (id, name) VALUES
                                       (1, 'Jogos de Tabuleiro'),
                                       (2, 'Card Games');

-- 2. USUÁRIOS (Senha padrão: 123456)
INSERT INTO tb_user (id, username, display_name, password, phone, cpf) VALUES
    (1, 'teste@email.com', 'Usuario Teste', '$2a$10$/cLFiA7e2tlMvcz/bcMKke0vBdcSwhUml7jogKP2MZiE1c/m1hc6i', '46999998888', '111.111.111-11');

-- 3. ENDEREÇOS
INSERT INTO tb_address (id, street, number, city, state, zip, neighborhood, user_id) VALUES
    (1, 'Rua Teste', '123', 'Pato Branco', 'PR', '85501-000', 'Centro', 1);

-- 4. PRODUTOS
-- Produto 1: Normal, com estoque
INSERT INTO tb_product (id, name, description, price, promo, stock, category_id) VALUES
    (1, 'Catan', 'Jogo de estratégia', 250.00, false, 10, 1);

-- Produto 2: Sem estoque (para testar erros de compra)
INSERT INTO tb_product (id, name, description, price, promo, stock, category_id) VALUES
    (2, 'Gloomhaven', 'Jogo complexo', 500.00, true, 0, 1);

-- 5. CARRINHO
INSERT INTO tb_cart (id, user_id) VALUES (1, 1);

-- 6. CUPONS
INSERT INTO tb_coupon (id, code, discount_value, active, valid_until) VALUES
    (1, 'TESTE10', 10.00, true, '2030-12-31');

-- ============================================================================
-- RESTART DE SEQUENCES (Essencial para testes não falharem ao criar novos dados)
-- ============================================================================
ALTER TABLE tb_user ALTER COLUMN id RESTART WITH 100;
ALTER TABLE tb_address ALTER COLUMN id RESTART WITH 100;
ALTER TABLE tb_category ALTER COLUMN id RESTART WITH 100;
ALTER TABLE tb_product ALTER COLUMN id RESTART WITH 100;
ALTER TABLE tb_cart ALTER COLUMN id RESTART WITH 100;
ALTER TABLE tb_coupon ALTER COLUMN id RESTART WITH 100;