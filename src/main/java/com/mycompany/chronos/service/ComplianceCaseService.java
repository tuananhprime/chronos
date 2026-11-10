package com.mycompany.chronos.service;

import com.mycompany.chronos.entity.ComplianceCase;
import com.mycompany.chronos.entity.Transaction;
import com.mycompany.chronos.repository.ComplianceCaseRepository;
import com.mycompany.chronos.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ComplianceCaseService {

    private final ComplianceCaseRepository complianceCaseRepository;
    private final TransactionRepository transactionRepository;

    @Autowired
    public ComplianceCaseService(ComplianceCaseRepository complianceCaseRepository,
                                 TransactionRepository transactionRepository) {
        this.complianceCaseRepository = complianceCaseRepository;
        this.transactionRepository = transactionRepository;
    }

    /**
     * Lưu Compliance Case và cập nhật trạng thái của Transaction liên quan.
     * @param caseDetails Dữ liệu Case từ Frontend.
     * @return ComplianceCase đã được lưu.
     */
    public ComplianceCase submitComplianceAction(ComplianceCase caseDetails) {
        // 1️⃣ Gán các giá trị mặc định/tự động:
        caseDetails.setCreatedDate(LocalDateTime.now());
        caseDetails.setComplianceOfficerID(1); // mặc định

        // 2️⃣ Lưu Compliance Case vào DB:
        ComplianceCase savedCase = complianceCaseRepository.save(caseDetails);

        // 3️⃣ Cập nhật trạng thái Transaction liên quan:
        String transactionIdStr = caseDetails.getRelatedTransactionID();
        Integer transactionId = null;
        try {
            transactionId = Integer.valueOf(transactionIdStr);
        } catch (NumberFormatException e) {
            System.err.println("Invalid transaction ID: " + transactionIdStr);
        }

        String caseStatus = caseDetails.getStatus();

        if (transactionId != null && caseStatus != null) {
            Optional<Transaction> transactionOpt = transactionRepository.findById(transactionId);
            if (transactionOpt.isPresent()) {
                Transaction transaction = transactionOpt.get();

                switch (caseStatus.toUpperCase()) {
                    case "APPROVE", "APPROVED" -> transaction.setStatus("Pending Approval"); // approve
                    case "REJECT", "REJECTED" -> transaction.setStatus("Rejected");           // reject
                    case "REQUEST", "REQUEST_INFO" -> transaction.setStatus("Request Information"); // nếu dùng nút Request
                    default -> {
                        // giữ nguyên trạng thái
                        System.out.println("Status không hợp lệ, giữ nguyên trạng thái của Transaction.");
                    }
                }

                // Lưu lại Transaction
                transactionRepository.save(transaction);
            } else {
                System.err.println("Transaction ID " + transactionId + " not found!");
            }
        }

        return savedCase;
    }
}
