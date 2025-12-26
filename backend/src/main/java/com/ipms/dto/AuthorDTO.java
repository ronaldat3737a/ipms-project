package com.ipms.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data; // Phải có dòng này

@Data
@JsonIgnoreProperties(ignoreUnknown = true) // DẶN JAVA: Nếu thấy trường lạ (như id) thì cứ bỏ qua
public class AuthorDTO {
    private String fullName;
    private String nationality;
    private String idNumber;
}
