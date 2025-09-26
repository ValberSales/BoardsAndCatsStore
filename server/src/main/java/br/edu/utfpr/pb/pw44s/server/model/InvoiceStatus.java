package br.edu.utfpr.pb.pw44s.server.model;

public enum InvoiceStatus {

    PENDING,    // Pedido criado, aguardando pagamento.

    PAID,       // Pagamento foi confirmado.

    SHIPPED,    // Pedido foi enviado para o endereço de entrega.

    DELIVERED,  // Pedido foi entregue ao cliente.

    CANCELED    // Pedido foi cancelado (pelo usuário ou pelo sistema).
}
