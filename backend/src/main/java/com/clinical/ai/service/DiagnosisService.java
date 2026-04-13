package com.clinical.ai.service;

import com.clinical.ai.dto.AnalysisRequest;
import com.clinical.ai.dto.AnalysisResponse;
import com.clinical.ai.model.DiagnosisRecord;
import com.clinical.ai.repository.DiagnosisRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiagnosisService {

    private static final Logger logger = LoggerFactory.getLogger(DiagnosisService.class);
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final ChatClient chatClient;
    private final DiagnosisRepository diagnosisRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public DiagnosisService(ChatClient chatClient,
                            DiagnosisRepository diagnosisRepository,
                            ObjectMapper objectMapper) {
        this.chatClient = chatClient;
        this.diagnosisRepository = diagnosisRepository;
        this.objectMapper = objectMapper;
    }

    public AnalysisResponse analyzeSymptoms(AnalysisRequest request) {
        try {
            Prompt prompt = new Prompt(List.of(
                new SystemMessage(buildSystemPrompt()),
                new UserMessage(buildUserPrompt(request))
            ));

            String aiResponse = chatClient.call(prompt)
                .getResult()
                .getOutput()
                .getContent();

            logger.debug("AI Response: {}", aiResponse);

            AnalysisResponse response = parseAiResponse(aiResponse);
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

    private String buildSystemPrompt() {
        return """
            You are a medical assistant AI. Analyze symptoms and return ONLY valid JSON.
            No markdown, no explanation, just JSON in this exact format:
            {
              "disease": "Most likely condition name",
              "severity": "MILD | MODERATE | SEVERE | CRITICAL",
              "recommendation": "Detailed recommendation and next steps. Note: This is AI-generated, not a substitute for professional medical advice.",
              "confidence": 0.0 to 1.0
            }
            Severity: MILD=home care, MODERATE=see doctor soon, SEVERE=urgent care, CRITICAL=emergency.
            """;
    }

    private String buildUserPrompt(AnalysisRequest request) {
        StringBuilder sb = new StringBuilder("Analyze these symptoms:\n");
        sb.append("Symptoms: ").append(request.getSymptoms()).append("\n");
        if (request.getAge() != null)
            sb.append("Age: ").append(request.getAge()).append("\n");
        if (request.getDuration() != null && !request.getDuration().isBlank())
            sb.append("Duration: ").append(request.getDuration()).append("\n");
        return sb.toString();
    }

    private AnalysisResponse parseAiResponse(String raw) throws Exception {
        String clean = raw.trim()
            .replaceAll("^```json\\s*", "")
            .replaceAll("^```\\s*", "")
            .replaceAll("\\s*```$", "")
            .trim();

        JsonNode json = objectMapper.readTree(clean);
        AnalysisResponse r = new AnalysisResponse();
        r.setDisease(json.path("disease").asText("Unknown Condition"));
        r.setSeverity(json.path("severity").asText("MODERATE").toUpperCase());
        r.setRecommendation(json.path("recommendation").asText("Please consult a doctor."));

        double conf = json.path("confidence").asDouble(0.75);
        if (conf > 1.0) conf = conf / 100.0;
        r.setConfidence(Math.min(1.0, Math.max(0.0, conf)));

        return r;
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