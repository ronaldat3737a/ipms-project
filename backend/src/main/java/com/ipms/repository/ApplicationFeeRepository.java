package com.ipms.repository;

import com.ipms.entity.ApplicationFee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicationFeeRepository extends JpaRepository<ApplicationFee, UUID> {
    List<ApplicationFee> findByApplicationId(UUID applicationId);
}
