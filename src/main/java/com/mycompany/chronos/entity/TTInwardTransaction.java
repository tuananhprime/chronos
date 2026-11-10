package com.mycompany.chronos.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "TTInwardTransaction")
public class TTInwardTransaction {

    @Id
    @Column(name = "transactionID")
    private int transactionID; // Không auto-increment nữa

    private String sender;

    // Getter & Setter
    public int getTransactionID() {
        return transactionID;
    }

    public void setTransactionID(int transactionID) {
        this.transactionID = transactionID;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }
}
