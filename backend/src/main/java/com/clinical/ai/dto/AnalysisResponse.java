package com.clinical.ai.dto;

public class AnalysisResponse {

    private Long id;
    private String disease;
    private String severity;
    private String recommendation;
    private Double confidence;
    private String symptoms;
    private Integer age;
    private String duration;
    private String patientName;
    private String createdAt;
    private boolean success;
    private String errorMessage;

    public AnalysisResponse() {}

    public static AnalysisResponse error(String message) {
        AnalysisResponse r = new AnalysisResponse();
        r.setSuccess(false);
        r.setErrorMessage(message);
        return r;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDisease() { return disease; }
    public void setDisease(String disease) { this.disease = disease; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}