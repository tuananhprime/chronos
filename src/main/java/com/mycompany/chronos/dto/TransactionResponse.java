package com.mycompany.chronos.dto;

import java.time.LocalDateTime;

public class TransactionResponse {
    private Integer transactionId;
    private String type; // TT / LC / etc.
    private LocalDateTime createdAt;
    private String status;
    private Double amount;
    private String currency;

    public TransactionResponse() {}

    public TransactionResponse(Integer transactionId, String type, LocalDateTime createdAt,
                               String status, Double amount, String currency) {
        this.transactionId = transactionId;
        this.type = type;
        this.createdAt = createdAt;
        this.status = status;
        this.amount = amount;
        this.currency = currency;
    }

    public Integer getTransactionId() { return transactionId; }
    public void setTransactionId(Integer transactionId) { this.transactionId = transactionId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}
