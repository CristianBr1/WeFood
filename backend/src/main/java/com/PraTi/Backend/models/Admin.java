package com.PraTi.Backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_ADMINS")
@PrimaryKeyJoinColumn(name = "user_id")
public class Admin extends User {
    
    @Column(nullable = false)
    private Boolean isSuperAdmin = false;


    public Boolean getIsSuperAdmin() {
        return isSuperAdmin;
    }

    public void setIsSuperAdmin(Boolean isSuperAdmin) {
        this.isSuperAdmin = isSuperAdmin;
    }
}