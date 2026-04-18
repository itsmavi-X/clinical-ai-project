package com.clinical.ai.service;

import com.clinical.ai.dto.AnalysisRequest;
import com.clinical.ai.dto.AnalysisResponse;
import com.clinical.ai.model.DiagnosisRecord;
import com.clinical.ai.repository.DiagnosisRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DiagnosisService {

    private static final Logger logger = LoggerFactory.getLogger(DiagnosisService.class);
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final DiagnosisRepository diagnosisRepository;
    private final ObjectMapper objectMapper;
    private final WebClient webClient;
    private final String apiKey;

    @Autowired
    public DiagnosisService(DiagnosisRepository diagnosisRepository,
                            ObjectMapper objectMapper,
                            WebClient.Builder webClientBuilder,
                            @Value("${gemini.api.key}") String apiKey) {
        this.diagnosisRepository = diagnosisRepository;
        this.objectMapper = objectMapper;
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com").build();
        this.apiKey = apiKey;
    }

    public AnalysisResponse analyzeSymptoms(AnalysisRequest request) {
        try {
            String prompt = buildPrompt(request);
            String aiResponse = callGeminiAPI(prompt);

            logger.debug("AI Response: {}", aiResponse);

            AnalysisResponse response = new AnalysisResponse();
            response.setDisease("AI Diagnosis");
            response.setSeverity("MODERATE");
            response.setRecommendation(aiResponse);
            response.setConfidence(0.8);

            DiagnosisRecord record = saveRecord(request, response);

            response.setId(record.getId());
            response.setSymptoms(request.getSymptoms());
            response.setAge(request.getAge());
            response.setDuration(request.getDuration());
            response.setPatientName(request.getPatientName());
            response.setCreatedAt(record.getCreatedAt().format(FORMATTER));
            response.setSuccess(true);

            return response;

        } catch (Exception e) {
            logger.error("Error analyzing symptoms", e);
            return AnalysisResponse.error("Analysis failed: " + e.getMessage());
        }
    }

    private String callGeminiAPI(String prompt) {
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", prompt)))
            )
        );

        return webClient.post()
            .uri("/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(String.class)
            .map(this::extractTextFromResponse)
            .onErrorResume(e -> {
                logger.error("Gemini API error", e);
                return Mono.just("Error: Unable to get diagnosis from AI.");
            })
            .block();
    }

    private String extractTextFromResponse(String responseJson) {
        try {
            JsonNode json = objectMapper.readTree(responseJson);
            return json.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
        } catch (Exception e) {
            logger.error("Error parsing Gemini response", e);
            return "Error: Unable to parse AI response.";
        }
    }

    private String buildPrompt(AnalysisRequest request) {
        StringBuilder sb = new StringBuilder("You are a medical assistant. Analyze the symptoms and suggest possible condition with precautions. Symptoms: ");
        sb.append(request.getSymptoms());
        if (request.getAge() != null) {
            sb.append(" Age: ").append(request.getAge());
        }
        if (request.getDuration() != null && !request.getDuration().isBlank()) {
            sb.append(" Duration: ").append(request.getDuration());
        }
        return sb.toString();
    }

    public List<AnalysisResponse> getHistory() {
        return diagnosisRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public boolean deleteRecord(Long id) {
        if (diagnosisRepository.existsById(id)) {
            diagnosisRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private DiagnosisRecord saveRecord(AnalysisRequest req, AnalysisResponse res) {
        DiagnosisRecord r = new DiagnosisRecord();
        r.setSymptoms(req.getSymptoms());
        r.setAge(req.getAge());
        r.setDuration(req.getDuration());
        r.setPatientName(req.getPatientName());
        r.setDisease(res.getDisease());
        r.setSeverity(res.getSeverity());
        r.setRecommendation(res.getRecommendation());
        r.setConfidence(res.getConfidence());
        return diagnosisRepository.save(r);
    }

    private AnalysisResponse mapToResponse(DiagnosisRecord r) {
        AnalysisResponse res = new AnalysisResponse();
        res.setId(r.getId());
        res.setSymptoms(r.getSymptoms());
        res.setAge(r.getAge());
        res.setDuration(r.getDuration());
        res.setPatientName(r.getPatientName());
        res.setDisease(r.getDisease());
        res.setSeverity(r.getSeverity());
        res.setRecommendation(r.getRecommendation());
        res.setConfidence(r.getConfidence());
        res.setSuccess(true);
        if (r.getCreatedAt() != null)
            res.setCreatedAt(r.getCreatedAt().format(FORMATTER));
        return res;
    }
}