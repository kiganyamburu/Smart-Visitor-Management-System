package com.larrykin.entity;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "blacklist")
public class BlackList {
    @Id
    private String blackListId;
    @NotBlank
    private String fullName;
    private String idNumber;
    @NotBlank
    private String reason;
    private Data dateAdded;
    private String adminId;
}
