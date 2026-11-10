package com.mycompany.chronos.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ComplianceCase", schema = "dbo") 
public class ComplianceCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "caseID")
    private Integer caseID;

    @Column(name = "relatedTransactionID", nullable = false, length = 50)
    private String relatedTransactionID; 

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description; 

    @Column(name = "status", nullable = false, length = 50)
    private String status; 

    @Column(name = "severityLevel", nullable = false, length = 20)
    private String severityLevel; 

    @Column(name = "createdDate")
    private LocalDateTime createdDate; 

    // Đã sửa đổi: Không còn mối quan hệ ManyToOne, chỉ là cột Integer đơn thuần
    @Column(name = "complianceOfficerID", nullable = false)
    private Integer complianceOfficerID; 

    // Constructor mặc định
    public ComplianceCase() {
        this.createdDate = LocalDateTime.now(); // Tự động set thời gian tạo
        // Không set complianceOfficerID ở đây vì giá trị này sẽ được set từ Service/Controller
        // (ví dụ: mặc định là 1 khi lưu)
    }

    // --- Getters & Setters ---

    public Integer getCaseID() {
        return caseID;
    }

    public void setCaseID(Integer caseID) {
        this.caseID = caseID;
    }

    public String getRelatedTransactionID() {
        return relatedTransactionID;
    }

    public void setRelatedTransactionID(String relatedTransactionID) {
        this.relatedTransactionID = relatedTransactionID;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSeverityLevel() {
        return severityLevel;
    }

    public void setSeverityLevel(String severityLevel) {
        this.severityLevel = severityLevel;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public Integer getComplianceOfficerID() {
        return complianceOfficerID;
    }

    public void setComplianceOfficerID(Integer complianceOfficerID) {
        this.complianceOfficerID = complianceOfficerID;
    }
}