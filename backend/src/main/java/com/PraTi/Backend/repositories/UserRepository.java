package com.PraTi.Backend.repositories;


import com.PraTi.Backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Parte para segurança 
    Optional<User> findByEmail(String email);
}