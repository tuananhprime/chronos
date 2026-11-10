package com.mycompany.chronos.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Importer", schema = "dbo")
public class Importer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ImporterID")
    private Integer importerId;

    @Column(name = "companyName", length = 255)
    private String companyName;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "profileID")
    private Integer profileId;

    public Importer() {}

    public Integer getImporterId() {
        return importerId;
    }

    public void setImporterId(Integer importerId) {
        this.importerId = importerId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getProfileId() {
        return profileId;
    }

    public void setProfileId(Integer profileId) {
        this.profileId = profileId;
    }
}
