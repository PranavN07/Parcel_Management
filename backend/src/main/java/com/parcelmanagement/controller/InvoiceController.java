package com.parcelmanagement.controller;

import com.parcelmanagement.entity.Invoice;
import com.parcelmanagement.entity.Parcel;
import com.parcelmanagement.entity.User;
import com.parcelmanagement.service.InvoiceService;
import com.parcelmanagement.service.ParcelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*", maxAge = 3600)
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Invoice Management", description = "Invoice and billing APIs")
public class InvoiceController {
    
    @Autowired
    private InvoiceService invoiceService;
    
    @Autowired
    private ParcelService parcelService;
    
    @PostMapping("/generate/{parcelId}")
    @Operation(summary = "Generate invoice", description = "Generate invoice for a parcel")
    public ResponseEntity<?> generateInvoice(@PathVariable Long parcelId, Authentication authentication) {
        try {
            Optional<Parcel> parcelOpt = parcelService.findById(parcelId);
            
            if (parcelOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Parcel not found");
                return ResponseEntity.notFound().build();
            }
            
            Parcel parcel = parcelOpt.get();
            User currentUser = (User) authentication.getPrincipal();
            
            // Check if user has permission to generate invoice for this parcel
            if (!currentUser.getRole().equals(User.UserRole.ADMIN) && 
                !currentUser.getRole().equals(User.UserRole.STAFF) &&
                !parcel.getSender().getId().equals(currentUser.getId())) {
                return ResponseEntity.forbidden().build();
            }
            
            Invoice invoice = invoiceService.generateInvoice(parcel);
            return ResponseEntity.ok(invoice);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/{invoiceNumber}")
    @Operation(summary = "Get invoice by number", description = "Get invoice details by invoice number")
    public ResponseEntity<?> getInvoiceByNumber(@PathVariable String invoiceNumber, Authentication authentication) {
        Optional<Invoice> invoiceOpt = invoiceService.findByInvoiceNumber(invoiceNumber);
        
        if (invoiceOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invoice not found");
            return ResponseEntity.notFound().build();
        }
        
        Invoice invoice = invoiceOpt.get();
        User currentUser = (User) authentication.getPrincipal();
        
        // Check if user has permission to view this invoice
        if (!currentUser.getRole().equals(User.UserRole.ADMIN) && 
            !currentUser.getRole().equals(User.UserRole.STAFF) &&
            !invoice.getParcel().getSender().getId().equals(currentUser.getId())) {
            return ResponseEntity.forbidden().build();
        }
        
        return ResponseEntity.ok(invoice);
    }
    
    @GetMapping("/parcel/{parcelId}")
    @Operation(summary = "Get invoice by parcel ID", description = "Get invoice for a specific parcel")
    public ResponseEntity<?> getInvoiceByParcelId(@PathVariable Long parcelId, Authentication authentication) {
        Optional<Parcel> parcelOpt = parcelService.findById(parcelId);
        
        if (parcelOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Parcel not found");
            return ResponseEntity.notFound().build();
        }
        
        Parcel parcel = parcelOpt.get();
        User currentUser = (User) authentication.getPrincipal();
        
        // Check if user has permission to view invoice for this parcel
        if (!currentUser.getRole().equals(User.UserRole.ADMIN) && 
            !currentUser.getRole().equals(User.UserRole.STAFF) &&
            !parcel.getSender().getId().equals(currentUser.getId())) {
            return ResponseEntity.forbidden().build();
        }
        
        Optional<Invoice> invoiceOpt = invoiceService.findByParcel(parcel);
        
        if (invoiceOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invoice not found for this parcel");
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(invoiceOpt.get());
    }
    
    @GetMapping("/my-invoices")
    @Operation(summary = "Get user's invoices", description = "Get all invoices for the authenticated user")
    public ResponseEntity<List<Invoice>> getUserInvoices(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<Invoice> invoices = invoiceService.findBySenderId(currentUser.getId());
        return ResponseEntity.ok(invoices);
    }
    
    @PutMapping("/{invoiceId}/payment")
    @Operation(summary = "Update payment status", description = "Update payment status of an invoice")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long invoiceId,
                                                @RequestParam Invoice.PaymentStatus paymentStatus,
                                                @RequestParam(required = false) Invoice.PaymentMethod paymentMethod,
                                                Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            
            // Check if user has permission (only Admin/Staff or invoice owner can update)
            Optional<Invoice> invoiceOpt = invoiceService.findByInvoiceNumber(invoiceId.toString());
            
            Invoice updatedInvoice = invoiceService.updatePaymentStatus(invoiceId, paymentStatus, paymentMethod);
            return ResponseEntity.ok(updatedInvoice);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Get all invoices", description = "Get all invoices (Admin/Staff only)")
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        List<Invoice> invoices = invoiceService.findAll();
        return ResponseEntity.ok(invoices);
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Get invoices by payment status", description = "Get all invoices with specific payment status (Admin/Staff only)")
    public ResponseEntity<List<Invoice>> getInvoicesByStatus(@PathVariable Invoice.PaymentStatus status) {
        List<Invoice> invoices = invoiceService.findByPaymentStatus(status);
        return ResponseEntity.ok(invoices);
    }
    
    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @Operation(summary = "Get overdue invoices", description = "Get all overdue invoices (Admin/Staff only)")
    public ResponseEntity<List<Invoice>> getOverdueInvoices() {
        List<Invoice> invoices = invoiceService.findOverdueInvoices();
        return ResponseEntity.ok(invoices);
    }
}