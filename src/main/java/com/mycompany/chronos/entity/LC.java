package com.mycompany.chronos.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "LC")
public class LC {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lcID")
    private Integer lcID;

    @Column(name = "issueDate")
    private LocalDate issueDate;

    @Column(name = "expiryDate")
    private LocalDate expiryDate;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "status")
    private String status;

    @Column(name = "applicant")
    private String applicant;

    @Column(name = "beneficiary")
    private String beneficiary;

    @Column(name = "transactionID")
    private Integer transactionID;
    
    @Column(name = "profile_id")
    private Integer profileId;

    // Getters and Setters
    public Integer getLcID() {
        return lcID;
    }

    public void setLcID(Integer lcID) {
        this.lcID = lcID;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getApplicant() {
        return applicant;
    }

    public void setApplicant(String applicant) {
        this.applicant = applicant;
    }

    public String getBeneficiary() {
        return beneficiary;
    }

    public void setBeneficiary(String beneficiary) {
        this.beneficiary = beneficiary;
    }

    public Integer getTransactionID() {
        return transactionID;
    }

    public void setTransactionID(Integer transactionID) {
        this.transactionID = transactionID;
    }


public Integer getProfileId() {
    return profileId;
}

public void setProfileId(Integer profileId) {
    this.profileId = profileId;
}
}