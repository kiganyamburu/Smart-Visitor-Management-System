package com.larrykin.model;

import lombok.Data;

import java.util.List;

@Data
public class Stats {
    int totalEmployee;
    int totalVisitors;
    int totalPreRegister;
    int maleVisitors;
    int femaleVisitors;
    int otherVisitors;
    List<Visitor> recentVisitors;
}
