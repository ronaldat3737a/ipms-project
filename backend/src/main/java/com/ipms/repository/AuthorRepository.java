package com.ipms.repository;

import com.ipms.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AuthorRepository extends JpaRepository<Author, UUID> {
}