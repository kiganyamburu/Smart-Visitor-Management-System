package com.larrykin.controllers;

import com.larrykin.Request.EmailRequest;
import com.larrykin.services.EmailService;
import com.larrykin.services.VisitorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/email")
@Tag(name = "Mail", description = "Mail API's")
public class EmailController {

    @Autowired
    private EmailService service;
    @Autowired
    private VisitorService visitorService;

    @Operation(
            description = "Send Email endpoint",
            summary = "This is the send email api",
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200"
                    ),
                    @ApiResponse(
                            description = "Bad Request",
                            responseCode = "400"
                    ),
                    @ApiResponse(
                            description = "Internal Server Error",
                            responseCode = "500"
                    )
            }

    )
    @PostMapping("/send-email")
    public ResponseEntity<String> sendEmail(@Valid @RequestBody EmailRequest emailRequest) {
        try {
            Boolean isSent = service.sendEmail(emailRequest);
            if (!isSent) {
                return ResponseEntity.badRequest().body("Error Sending email");
            }
            return ResponseEntity.ok("Email sent Successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending email");
        }
    }

    @PostMapping("/send-email-qrcode")
    public ResponseEntity<String> sendEmailQrcode(@Valid @RequestBody EmailRequest emailRequest) {
        try {
            String visitorId = emailRequest.getVisitorId();
            String qrCodeBase64 = visitorService.getVisitorById(visitorId).getQrCode();

            Boolean isSent = service.sendEmailWithAttachment(emailRequest, qrCodeBase64);
            if (!isSent) {
                return ResponseEntity.badRequest().body("Error Sending Email");
            }
            return ResponseEntity.ok("Email sent Successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending email");
        }
    }
}
