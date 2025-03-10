package com.larrykin.model;

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
    @NotBlank(message = "FullName Cannot be blank")
    private String fullName;
    @Email(message = "Should be an email")
    private String email;
    @NotBlank(message = "Phone number cannot be blank")
    private String phoneNumber;
    private AssignedLocation assignedLocation;
}
