package com.ipms.repository;

import com.ipms.entity.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ApplicantRepository extends JpaRepository<Applicant, UUID> {
}