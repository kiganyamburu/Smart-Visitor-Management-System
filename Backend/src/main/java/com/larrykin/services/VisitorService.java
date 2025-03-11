package com.larrykin.services;

import com.larrykin.model.Visitor;

import java.util.List;

public interface VisitorService {
    Visitor createVisitor(Visitor visitor);

    Visitor getVisitorById(String id);

    Visitor findVisitorByEmail(String email);

    List<Visitor> getAllVisitors();

    Visitor updateVisitor(String id, Visitor visitor);

    boolean deleteVisitor(String id);
}
