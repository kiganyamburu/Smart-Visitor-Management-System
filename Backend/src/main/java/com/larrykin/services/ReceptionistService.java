package com.larrykin.services;

import com.larrykin.model.Receptionist;

import java.util.List;

public interface ReceptionistService {
    Receptionist createReceptionist(Receptionist receptionist);

    Receptionist getReceptionistById(String id);
    Receptionist findReceptionistByEmail(String email);

    List<Receptionist> getAllReceptionists();

    Receptionist updateReceptionist(String id, Receptionist receptionist);

    boolean deleteReceptionist(String id);
}
