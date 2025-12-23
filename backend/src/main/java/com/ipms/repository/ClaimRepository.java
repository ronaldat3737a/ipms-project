package com.ipms.repository;

import com.ipms.entity.ApplicationClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ClaimRepository extends JpaRepository<ApplicationClaim, UUID> {
}