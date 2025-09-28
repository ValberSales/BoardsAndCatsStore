package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.dto.InvoiceCreateDTO;
import br.edu.utfpr.pb.pw44s.server.model.*;
import br.edu.utfpr.pb.pw44s.server.repository.AddressRepository;
import br.edu.utfpr.pb.pw44s.server.repository.InvoiceRepository;
import br.edu.utfpr.pb.pw44s.server.repository.PaymentMethodRepository;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.service.IInvoiceService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvoiceServiceImpl extends CrudServiceImpl<Invoice, Long>
        implements IInvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    public InvoiceServiceImpl(InvoiceRepository invoiceRepository,
                              ProductRepository productRepository,
                              AddressRepository addressRepository,
                              PaymentMethodRepository paymentMethodRepository) {
        this.invoiceRepository = invoiceRepository;
        this.productRepository = productRepository;
        this.addressRepository = addressRepository;
        this.paymentMethodRepository = paymentMethodRepository;
    }

    @Override
    protected JpaRepository<Invoice, Long> getRepository() {
        return this.invoiceRepository;
    }

    @Override
    @Transactional
    public Invoice createOrder(InvoiceCreateDTO invoiceCreateDTO, User user) {
        Address address = addressRepository.findById(invoiceCreateDTO.getAddressId())
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado!"));
        PaymentMethod paymentMethod = paymentMethodRepository.findById(invoiceCreateDTO.getPaymentMethodId())
                .orElseThrow(() -> new RuntimeException("Método de Pagamento não encontrado!"));

        if (!address.getUser().getId().equals(user.getId()) || !paymentMethod.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Endereço ou Método de Pagamento inválido.");
        }

        Invoice invoice = new Invoice();
        invoice.setUser(user);

        InvoiceAddressEmbeddable embeddableAddress = new InvoiceAddressEmbeddable();
        embeddableAddress.setStreet(address.getStreet());
        embeddableAddress.setCity(address.getCity());
        embeddableAddress.setState(address.getState());
        embeddableAddress.setZip(address.getZip());
        invoice.setShippingAddress(embeddableAddress);


        InvoicePaymentEmbeddable embeddablePayment = new InvoicePaymentEmbeddable();
        embeddablePayment.setDescription(
                String.format("%s - %s", paymentMethod.getType(), paymentMethod.getDescription())
        );
        invoice.setPaymentMethod(embeddablePayment);


        List<InvoiceItems> items = invoiceCreateDTO.getItems().stream().map(itemDto -> {
            InvoiceItems item = new InvoiceItems();
            Product product = new Product();
            product.setId(itemDto.getProductId());
            item.setProduct(product);
            item.setQuantity(itemDto.getQuantity());
            return item;
        }).collect(Collectors.toList());

        invoice.setItems(items);
        return this.save(invoice);
    }

    @Override
    @Transactional
    public Invoice save(Invoice invoice) {
        if (invoice.getId() == null) {
            invoice.setDate(LocalDate.now());
            invoice.setStatus(InvoiceStatus.PENDING);
            BigDecimal total = BigDecimal.ZERO;
            for (var item : invoice.getItems()) {
                Product product = productRepository.findById(item.getProduct().getId())
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));
                if (product.getStock() < item.getQuantity()) {
                    throw new RuntimeException("Estoque insuficiente para o produto: " + product.getName());
                }
                product.setStock(product.getStock() - item.getQuantity());
                productRepository.save(product);
                item.setUnitPrice(product.getPrice());
                item.setSubtotal(product.getPrice().multiply(new BigDecimal(item.getQuantity())));
                item.setInvoice(invoice);
                total = total.add(item.getSubtotal());
            }
            invoice.setTotal(total);
        }
        return super.save(invoice);
    }

    @Override
    @Transactional
    public Invoice cancel(Long invoiceId) {
        // 3. USANDO O MÉTODO DE APOIO PARA CONSISTÊNCIA
        Invoice invoice = findByIdOrThrow(invoiceId);

        if (!invoice.getStatus().equals(InvoiceStatus.PENDING) &&
                !invoice.getStatus().equals(InvoiceStatus.PAID)) {
            throw new RuntimeException("Não é possível cancelar um pedido com status " + invoice.getStatus());
        }

        for (var item : invoice.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }
        invoice.setStatus(InvoiceStatus.CANCELED);
        return super.save(invoice);
    }

    @Override
    @Transactional
    public Invoice confirmPayment(Long invoiceId) {
        Invoice invoice = findByIdOrThrow(invoiceId);
        if (!invoice.getStatus().equals(InvoiceStatus.PENDING)) {
            throw new RuntimeException("Apenas pedidos com status PENDING podem ser pagos.");
        }
        invoice.setStatus(InvoiceStatus.PAID);
        return super.save(invoice);
    }

    @Override
    @Transactional
    public Invoice markAsShipped(Long invoiceId, String trackingCode) {
        Invoice invoice = findByIdOrThrow(invoiceId);
        if (!invoice.getStatus().equals(InvoiceStatus.PAID)) {
            throw new RuntimeException("Apenas pedidos com status PAID podem ser enviados.");
        }
        invoice.setStatus(InvoiceStatus.SHIPPED);
        invoice.setTrackingCode(trackingCode);
        return super.save(invoice);
    }

    @Override
    @Transactional
    public Invoice markAsDelivered(Long invoiceId) {
        Invoice invoice = findByIdOrThrow(invoiceId);
        if (!invoice.getStatus().equals(InvoiceStatus.SHIPPED)) {
            throw new RuntimeException("Apenas pedidos com status SHIPPED podem ser marcados como entregues.");
        }
        invoice.setStatus(InvoiceStatus.DELIVERED);
        return super.save(invoice);
    }

    private Invoice findByIdOrThrow(Long invoiceId) {
        return invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado!"));
    }

    @Override
    @Transactional(readOnly = true) // 4. OTIMIZAÇÃO
    public List<Invoice> findByUserId(Long userId) {
        return invoiceRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true) // 4. OTIMIZAÇÃO
    public List<Invoice> findByStatus(InvoiceStatus status) {
        return invoiceRepository.findByStatus(status);
    }
}