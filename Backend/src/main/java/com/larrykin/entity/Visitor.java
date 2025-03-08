package com.larrykin.entity;

import com.larrykin.enums.IDTYPE;
import com.larrykin.enums.Status;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "visitors")
public class Visitor {
    @Id
    private String visitor;
    @NotBlank
    private String fullName;
    @Email
    private String email;
    @NotBlank
    private String phoneNumber;
    private IDTYPE idType;
    private String idNumber;
    private String qrCode;
    private Date checkInTime;
    private Date checkOutTime;
    private Status status;
//    @DBRef
    private String hostId;
}
