package com.PraTi.Backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_CLIENTES")
@PrimaryKeyJoinColumn(name = "user_id")
public class Cliente extends User  {
    @Column
    private String endereco;

    
    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }
}
