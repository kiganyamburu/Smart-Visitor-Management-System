package com.larrykin.services;

import java.util.List;

public interface Receptionist {
    Receptionist createReceptionist(Receptionist receptionist);

    Receptionist getReceptionistById(String id);

    List<Receptionist> getAllReceptionists();

    boolean deleteReceptionist(String id);
}
