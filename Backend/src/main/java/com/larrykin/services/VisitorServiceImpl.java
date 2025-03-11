package com.larrykin.services;

import com.larrykin.model.Visitor;
import com.larrykin.exceptions.VisitorNotFoundException;
import com.larrykin.repositories.VisitorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitorServiceImpl implements VisitorService {
    @Autowired
    private VisitorRepository visitorRepository;


    @Override
    public Visitor createVisitor(Visitor visitor) {
        return visitorRepository.save(visitor);
    }

    @Override
    public Visitor getVisitorById(String id) {
        return visitorRepository.findById(id).orElseThrow(() -> new VisitorNotFoundException("Visitor with ID" + id + "not found"));
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
        existingVisitor.setFullName(visitor.getFullName());
        existingVisitor.setEmail(visitor.getEmail());
        existingVisitor.setPhoneNumber(visitor.getPhoneNumber());
        existingVisitor.setIdType(visitor.getIdType());
        existingVisitor.setIdNumber(visitor.getIdNumber());
        existingVisitor.setImageUrl(visitor.getImageUrl());
        existingVisitor.setQrCode(visitor.getQrCode());
        existingVisitor.setCheckInTime(visitor.getCheckInTime());
        existingVisitor.setCheckOutTime(visitor.getCheckOutTime());
        existingVisitor.setStatus(visitor.getStatus());
        existingVisitor.setHostId(visitor.getHostId());

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
