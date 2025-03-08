package com.larrykin.entity;

import com.larrykin.enums.AssignedLocation;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "receptionists")
public class Receptionist {
    @Id
    private String receptionistId;
    @NotBlank
    private String fullName;
    @Email
    private String email;
    @NotBlank
    private String phoneNumber;
    private AssignedLocation assignedLocation;
}
