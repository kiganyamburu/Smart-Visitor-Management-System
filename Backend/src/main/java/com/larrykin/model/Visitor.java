package com.larrykin.model;

import com.larrykin.enums.IDTYPE;
import com.larrykin.enums.Status;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.URL;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "visitors")
public class Visitor {
    @Id
    private String visitor;
    @NotBlank(message = "FullName cannot be blank")
    private String fullName;
    @Email(message = "Should be an email")
    private String email;
    @NotBlank(message = "PhoneNumber cannot be blank")
    private String phoneNumber;
    private IDTYPE idType;
    private String idNumber;
    @NotBlank(message = "Image url cannot be blank")
    @URL(message = "Please enter a valid url")
    private String imageUrl;
    private String qrCode;
    private Date checkInTime;
    private Date checkOutTime;
    private Status status;
    private String hostId;
}
