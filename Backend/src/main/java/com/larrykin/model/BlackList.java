package com.larrykin.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "blacklist")
public class BlackList {
    @Id
    private String blackListId;
    @NotBlank(message = "FullName cannot be null")
    private String fullName;
    private String idNumber;
    @NotBlank(message = "Reason cannot be null")
    private String reason;
    @CreatedDate
    @Indexed
    private Date dateAdded;
    private String adminId;
}
