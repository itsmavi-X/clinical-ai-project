package com.clinical.ai.repository;

import com.clinical.ai.model.DiagnosisRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiagnosisRepository extends JpaRepository<DiagnosisRecord, Long> {

    List<DiagnosisRecord> findAllByOrderByCreatedAtDesc();

    List<DiagnosisRecord> findBySeverityOrderByCreatedAtDesc(String severity);

    long countBySeverity(String severity);
}