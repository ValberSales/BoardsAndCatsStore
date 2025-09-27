package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Invoice;
import br.edu.utfpr.pb.pw44s.server.model.InvoiceStatus;

import java.util.List;

public interface IInvoiceService extends ICrudService<Invoice, Long> {

    List<Invoice> findByUserId(Long userId);

    List<Invoice> findByStatus(InvoiceStatus status);

    Invoice cancel(Long invoiceId);

    Invoice confirmPayment(Long invoiceId);

    Invoice markAsShipped(Long invoiceId, String trackingCode);

    Invoice markAsDelivered(Long invoiceId);
}