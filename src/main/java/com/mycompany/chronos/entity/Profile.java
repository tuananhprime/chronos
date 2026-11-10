package com.mycompany.chronos.entity;

import com.mycompany.chronos.repository.ProfileServiceRepository;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ProfileService", schema = "dbo")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProfileID")
    private Integer profileId;

    @Column(name = "taxCode", length = 50)
    private String taxCode;

    @Column(name = "companyName", length = 255)
    private String companyName;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    // ===== Getters & Setters =====
    public Integer getProfileId() {
        return profileId;
    }

    public void setProfileId(Integer profileId) {
        this.profileId = profileId;
    }

    public String getTaxCode() {
        return taxCode;
    }

    public void setTaxCode(String taxCode) {
        this.taxCode = taxCode;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
 public User getUser() { return user; }
    
    public void setUser(User user) { this.user = user; }

}
