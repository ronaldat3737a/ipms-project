package com.ipms.repository;

import com.ipms.entity.ApplicationFee;
import com.ipms.entity.enums.FeeStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationFeeRepository extends JpaRepository<ApplicationFee, UUID> {

    List<ApplicationFee> findByApplication_Id(UUID applicationId);

    Optional<ApplicationFee> findByApplication_IdAndStage(UUID applicationId, FeeStage stage);
}

