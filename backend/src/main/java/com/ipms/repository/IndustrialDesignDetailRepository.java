package com.ipms.repository;

import com.ipms.entity.IndustrialDesignDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface IndustrialDesignDetailRepository extends JpaRepository<IndustrialDesignDetail, UUID> {
}
