package com.larrykin.services;

import com.larrykin.exceptions.ReceptionistNotFoundException;
import com.larrykin.model.Receptionist;
import com.larrykin.repositories.ReceptionistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReceptionistServiceImplementation implements ReceptionistService {
    @Autowired
    private ReceptionistRepository receptionistRepository;

    @Override
    public Receptionist createReceptionist(Receptionist receptionist) {
        return receptionistRepository.save(receptionist);
    }

    @Override
    public Receptionist getReceptionistById(String id) {
        return receptionistRepository.findById(id).orElseThrow(() -> new ReceptionistNotFoundException("Receptionist with ID" + id + "not found"));
    }
@Override
    public Receptionist findReceptionistByEmail(String email) {
        return receptionistRepository.findByEmail(email).orElseThrow(() -> new ReceptionistNotFoundException("Receptionist with Email" + email + "not found"));
    }

    @Override
    public List<Receptionist> getAllReceptionists() {
        return receptionistRepository.findAll();
    }

    @Override
    public Receptionist updateReceptionist(String id, Receptionist receptionist) {
        Receptionist existingReceptionist = getReceptionistById(id);
        existingReceptionist.setFullName(receptionist.getFullName());
        existingReceptionist.setEmail(receptionist.getEmail());
        existingReceptionist.setPhoneNumber(receptionist.getPhoneNumber());
        existingReceptionist.setAssignedLocation(receptionist.getAssignedLocation());

        return receptionistRepository.save(existingReceptionist);
    }

    @Override
    public boolean deleteReceptionist(String id) {
        Receptionist receptionist = getReceptionistById(id);
        if (receptionist != null) {
            receptionistRepository.deleteById(id);
            return true;
        }
        throw new ReceptionistNotFoundException("Receptionist with ID" + id + "not found");
    }
}
