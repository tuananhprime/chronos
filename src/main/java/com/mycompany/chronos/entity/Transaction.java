package com.mycompany.chronos.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "TTTransaction", schema = "dbo")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transactionID")
    private Integer transactionId;

    // Liên kết tới ProfileService (không phải BusinessProfile nữa)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profileID", referencedColumnName = "ProfileID")
    private Profile profile;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "currency", length = 10)
    private String currency;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "createdByOps", length = 100)
    private String createdByOps;

    @Column(name = "preApprovedByOps", length = 100)
    private String preApprovedByOps;

    @Column(name = "approvedByBankUser", length = 100)
    private String approvedByBankUser;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Transaction() {}

    public Transaction(Double amount, String currency, String status, LocalDateTime createdAt) {
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Integer getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Integer transactionId) {
        this.transactionId = transactionId;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedByOps() {
        return createdByOps;
    }

    public void setCreatedByOps(String createdByOps) {
        this.createdByOps = createdByOps;
    }

    public String getPreApprovedByOps() {
        return preApprovedByOps;
    }

    public void setPreApprovedByOps(String preApprovedByOps) {
        this.preApprovedByOps = preApprovedByOps;
    }

    public String getApprovedByBankUser() {
        return approvedByBankUser;
    }

    public void setApprovedByBankUser(String approvedByBankUser) {
        this.approvedByBankUser = approvedByBankUser;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
