package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.InvoiceCreateDTO;
import br.edu.utfpr.pb.pw44s.server.dto.InvoiceDTO;
import br.edu.utfpr.pb.pw44s.server.model.Invoice;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.IInvoiceService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper; // Import correto
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("invoices")
public class InvoiceController {

    private final IInvoiceService invoiceService;
    private final ModelMapper modelMapper; // Usando o ModelMapper genérico

    public InvoiceController(IInvoiceService invoiceService, ModelMapper modelMapper) {
        this.invoiceService = invoiceService;
        this.modelMapper = modelMapper;
    }

    @PostMapping
    public ResponseEntity<InvoiceDTO> create(@RequestBody @Valid InvoiceCreateDTO invoiceCreateDTO,
                                             @AuthenticationPrincipal User user) {
        Invoice savedInvoice = invoiceService.createOrder(invoiceCreateDTO, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(modelMapper.map(savedInvoice, InvoiceDTO.class));
    }

    @GetMapping
    public ResponseEntity<List<InvoiceDTO>> findMyInvoices(@AuthenticationPrincipal User user) {
        List<Invoice> invoices = invoiceService.findByUserId(user.getId());
        List<InvoiceDTO> dtos = invoices.stream()
                .map(invoice -> modelMapper.map(invoice, InvoiceDTO.class)) // Usando ModelMapper
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("{id}")
    public ResponseEntity<InvoiceDTO> findOne(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Invoice invoice = findInvoiceAndCheckOwner(id, user);
        return ResponseEntity.ok(modelMapper.map(invoice, InvoiceDTO.class)); // Usando ModelMapper
    }

    @PostMapping("{id}/cancel")
    public ResponseEntity<InvoiceDTO> cancel(@PathVariable Long id, @AuthenticationPrincipal User user) {
        findInvoiceAndCheckOwner(id, user);
        Invoice canceledInvoice = invoiceService.cancel(id);
        return ResponseEntity.ok(modelMapper.map(canceledInvoice, InvoiceDTO.class)); // Usando ModelMapper
    }

    private Invoice findInvoiceAndCheckOwner(Long invoiceId, User loggedUser) {
        Invoice invoice = invoiceService.findById(invoiceId);
        if (invoice == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado.");
        }
        if (!invoice.getUser().getId().equals(loggedUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado.");
        }
        return invoice;
    }
}