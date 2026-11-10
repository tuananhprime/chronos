package com.mycompany.chronos.controller;

import com.mycompany.chronos.entity.ComplianceCase;
import com.mycompany.chronos.service.ComplianceCaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/compliance")
public class ComplianceCaseController {

    private final ComplianceCaseService complianceCaseService;

    @Autowired
    public ComplianceCaseController(ComplianceCaseService complianceCaseService) {
        this.complianceCaseService = complianceCaseService;
    }

    /**
     * POST endpoint để xử lý hành động Compliance (Approve/Reject).
     * URL: /api/compliance/submit-case
     * Phương thức: POST
     * Dữ liệu nhận vào: JSON body map với ComplianceCase Entity (relatedTransactionID, status, severityLevel, description)
     * @param caseDetails
     * @return 
     */
    @PostMapping("/submit-case")
    public ResponseEntity<ComplianceCase> submitComplianceCase(@RequestBody ComplianceCase caseDetails) {
        
        // Kiểm tra dữ liệu cần thiết (Ví dụ: phải có ID giao dịch)
        if (caseDetails.getRelatedTransactionID() == null || caseDetails.getStatus() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        try {
            // Logic xử lý được chuyển giao cho Service Layer
            ComplianceCase savedCase = complianceCaseService.submitComplianceAction(caseDetails);
            
            // Trả về đối tượng đã lưu với caseID mới được tạo
            return new ResponseEntity<>(savedCase, HttpStatus.CREATED);
            
        } catch (Exception e) {
            // Log lỗi (nên dùng logger)
            System.err.println("Error processing compliance case: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Thêm các endpoint khác nếu cần, ví dụ:
    
    /**
     * GET endpoint để lấy tất cả các Compliance Cases.
     * @return Danh sách ComplianceCase.
     */
    // @GetMapping("/cases")
    // public ResponseEntity<List<ComplianceCase>> getAllComplianceCases() {
    //     List<ComplianceCase> cases = complianceCaseRepository.findAll();
    //     return new ResponseEntity<>(cases, HttpStatus.OK);
    // }
}