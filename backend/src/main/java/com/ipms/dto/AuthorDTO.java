package com.ipms.dto;

import lombok.Data; // Phải có dòng này

@Data
public class AuthorDTO {
    private String fullName;
    private String nationality;
    private String idNumber;
}
