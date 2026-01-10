package com.ipms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ipms.dto.DesignRequestDto;
import com.ipms.entity.Application;
import com.ipms.entity.IndustrialDesignDetail;
import com.ipms.service.DesignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/industrial-designs")
@RequiredArgsConstructor
@CrossOrigin(
    origins = "http://localhost:5173",
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class DesignController {

    private final DesignService designService;
    private final ObjectMapper objectMapper;

    @PostMapping(value = "/create", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Map<String, UUID>> createDesignApplication(
            @RequestPart("designData") String designDataJson,
            @RequestPart(value = "files", required = false) MultipartFile[] files) throws Exception {
        
        DesignRequestDto dto = objectMapper.readValue(designDataJson, DesignRequestDto.class);

        // Assuming user ID 1 for now, will be replaced by real auth principal
        Long mockUserId = 1L; 

        Application createdApp = designService.createDesignApplication(dto, mockUserId, files);
        return ResponseEntity.ok(Map.of("id", createdApp.getId()));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<Application> submitDesignApplication(@PathVariable UUID id) {
        Application submittedApp = designService.submitDesignApplication(id);
        return ResponseEntity.ok(submittedApp);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Application>> getAllDesignApplications() {
        List<Application> applications = designService.getDesignApplications();
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getDesignApplicationById(@PathVariable UUID id) {
        Application application = designService.getDesignApplicationById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + id));
        IndustrialDesignDetail detail = designService.getIndustrialDesignDetail(id)
                .orElseThrow(() -> new RuntimeException("Industrial Design detail not found for Application ID: " + id));
        
        Map<String, Object> response = new HashMap<>();
        response.put("application", application);
        response.put("detail", detail);

        return ResponseEntity.ok(response);
    }
}
