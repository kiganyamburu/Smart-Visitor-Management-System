package com.larrykin.services;

import com.larrykin.Response.VisitorResponse;
import com.larrykin.model.Visitor;

import java.util.List;

public interface VisitorService {
    Visitor createVisitor(Visitor visitor);

    Visitor getVisitorById(String id);

    VisitorResponse checkin(String id);

    Visitor guestCheckin(Visitor visitor);

    Visitor findByIdNumber(String id);

    Visitor manualCheckIn(Visitor visitor);

    Visitor findVisitorByEmail(String email);

    List<Visitor> getAllVisitors();

    Visitor updateVisitor(String id, Visitor visitor);

    boolean deleteVisitor(String id);
}
