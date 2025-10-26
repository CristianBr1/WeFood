package com.PraTi.Backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_GERENTES")
@PrimaryKeyJoinColumn(name = "user_id")
public class Gerente extends User {

    // Estruturando a classe 
}