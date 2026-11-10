package com.mycompany.chronos.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Blacklist", schema = "dbo")
public class Blacklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "blacklistID")
    private Integer blacklistID;

    @Column(name = "keyword", nullable = false, length = 255)
    private String keyword;

    @Column(name = "keywordType", nullable = false, length = 50)
    private String keywordType; 
    // COMPANY | PERSON | COUNTRY | SWIFT | ACCOUNT | FREE_TEXT

    @Column(name = "riskLevel", nullable = false, length = 20)
    private String riskLevel; 
    // HIGH | MEDIUM

    @Column(name = "isActive")
    private Boolean isActive = true;

    @Column(name = "createdDate")
    private LocalDateTime createdDate;

    public Blacklist() {
        this.createdDate = LocalDateTime.now();
    }

    // -------- GETTERS & SETTERS --------

    public Integer getBlacklistID() {
        return blacklistID;
    }

    public void setBlacklistID(Integer blacklistID) {
        this.blacklistID = blacklistID;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public String getKeywordType() {
        return keywordType;
    }

    public void setKeywordType(String keywordType) {
        this.keywordType = keywordType;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}
