package com.clinical.ai.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AnalysisRequest {

    @NotBlank(message = "Symptoms are required")
    @Size(max = 5000, message = "Symptoms must be 5000 characters or less")
    private String symptoms;

    @Min(value = 0, message = "Age must be at least 0")
    @Max(value = 150, message = "Age must be 150 or less")
    private Integer age;

    @Size(max = 100, message = "Duration must be 100 characters or less")
    private String duration;

    @Size(max = 100, message = "Patient name must be 100 characters or less")
    private String patientName;

    public AnalysisRequest() {}

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
}
