package com.larrykin.services;

import com.larrykin.Request.EmailRequest;
import com.larrykin.Response.VisitorResponse;
import com.larrykin.enums.Role;
import com.larrykin.enums.Status;
import com.larrykin.model.Visitor;
import com.larrykin.exceptions.VisitorNotFoundException;
import com.larrykin.repositories.VisitorRepository;
import com.larrykin.utils.QRCodeGenerator;
import com.larrykin.utils.UrlUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Slf4j
@Service
public class VisitorServiceImpl implements VisitorService {
    @Autowired
    private VisitorRepository visitorRepository;
    @Autowired
    private QRCodeGenerator qrCodeGenerator;
    @Autowired
    private EmailService service;

    @Override
    public Visitor createVisitor(Visitor visitor) {
        //*Generate QR code and update
        visitor.setStatus(Status.PENDING);
        visitor.setRole(Role.VISITOR);

        //* set qrcode
        Visitor savedVisitor = visitorRepository.save(visitor);
        String id = savedVisitor.getVisitorId();
        String url = UrlUtil.getBaseUrl() + "/api/v1/visitor/" + id;
        log.info("qrcode url: {}", url);
        String qrCode = qrCodeGenerator.generateQRCode(url);
        savedVisitor.setQrCode(qrCode);

        //* Send email
        try {
            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setVisitorId(id);
            emailRequest.setName(savedVisitor.getName());
            emailRequest.setPhone(emailRequest.getPhone());
            emailRequest.setEmail(emailRequest.getEmail());
            emailRequest.setSubject("Your QR Code for Visitor Check-In");
            emailRequest.setMessage("Dear " + savedVisitor.getName() + ", \n\nPlease find your QR code attached for visitor check-in.\n\n Best regards,\nSvms");
            Boolean isSent = service.sendEmailWithAttachment(emailRequest, qrCode);
            if (isSent) {
                log.info("Email sent successfully to {}", savedVisitor.getEmail());
            } else {
                log.error("Failed to send Email");
            }
        } catch (Exception e) {
            log.error("Failed to send Email{}", e.getMessage());
            log.error("error", e);
        }

        log.info("Visitor: {}", visitor);
        return visitorRepository.save(savedVisitor);
    }

    @Override
    public Visitor manualCheckIn(Visitor visitor) {
        visitor.setStatus(Status.CHECKED_IN);
        return visitorRepository.save(visitor);
    }

    @Override
    public Visitor guestCheckin(Visitor visitor) {
        visitor.setStatus(Status.CHECKED_IN);
        visitor.setRole(Role.GUEST);
        return visitorRepository.save(visitor);
    }

    @Override
    public Visitor getVisitorById(String id) {
        return visitorRepository.findById(id).orElseThrow(() -> new VisitorNotFoundException("Visitor with ID" + id + "not found"));
    }
    @Override
    public Visitor findByIdNumber(String id) {
        return visitorRepository.findByIdNumber(id).orElseThrow(() -> new VisitorNotFoundException("Visitor with ID Number" + id + "not found"));
    }


    @Override
    public VisitorResponse checkin(String id) {
        Visitor visitor = visitorRepository.findById(id).orElseThrow(() -> new VisitorNotFoundException("Visitor with ID" + id + "not found"));
        VisitorResponse visitorResponse = new VisitorResponse();
        visitorResponse.setVisitorId(visitor.getVisitorId());
        visitorResponse.setName(visitor.getName());

        //update checkin time.
        visitor.setCheckInTime(new Date());
        updateVisitor(visitor.getVisitorId(), visitor);

        return visitorResponse;
    }

    @Override
    public Visitor findVisitorByEmail(String email) {
        return visitorRepository.findByEmail(email).orElseThrow(() -> new VisitorNotFoundException("Visitor with Email" + email + "not found"));
    }

    @Override
    public List<Visitor> getAllVisitors() {
        return visitorRepository.findAll();
    }

    @Override
    public Visitor updateVisitor(String id, Visitor visitor) {
        Visitor existingVisitor = getVisitorById(id);
        existingVisitor.setName(visitor.getName());
        existingVisitor.setEmail(visitor.getEmail());
        existingVisitor.setPhone(visitor.getPhone());
        existingVisitor.setIdType(visitor.getIdType());
        existingVisitor.setIdNumber(visitor.getIdNumber());
        existingVisitor.setCheckInTime(visitor.getCheckInTime());
        existingVisitor.setCheckOutTime(visitor.getCheckOutTime());
        existingVisitor.setStatus(visitor.getStatus());
        existingVisitor.setPurpose(visitor.getPurpose());


        return visitorRepository.save(existingVisitor);
    }

    @Override
    public boolean deleteVisitor(String id) {
        Visitor existingVisitor = getVisitorById(id);
        if (existingVisitor != null) {
            visitorRepository.deleteById(id);
            return true;
        }
        throw new VisitorNotFoundException("Visitor with ID" + id + "not found");
    }
}
