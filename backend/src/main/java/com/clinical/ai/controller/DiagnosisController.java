package com.clinical.ai.controller;

import com.clinical.ai.dto.AnalysisRequest;
import com.clinical.ai.dto.AnalysisResponse;
import com.clinical.ai.service.DiagnosisService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DiagnosisController {

    private static final Logger logger = LoggerFactory.getLogger(DiagnosisController.class);

    private final DiagnosisService diagnosisService;

    @Autowired
    public DiagnosisController(DiagnosisService diagnosisService) {
        this.diagnosisService = diagnosisService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResponse> analyze(@Valid @RequestBody AnalysisRequest request) {
        AnalysisResponse response = diagnosisService.analyzeSymptoms(request);
        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<AnalysisResponse>> getHistory() {
        return ResponseEntity.ok(diagnosisService.getHistory());
    }

    @DeleteMapping("/history/{id}")
    public ResponseEntity<Map<String, Object>> deleteRecord(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        boolean deleted = diagnosisService.deleteRecord(id);
        result.put("success", deleted);
        result.put("message", deleted ? "Deleted successfully" : "Record not found");
        return deleted ? ResponseEntity.ok(result)
                       : ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "Clinical AI Engine"));
    }
}