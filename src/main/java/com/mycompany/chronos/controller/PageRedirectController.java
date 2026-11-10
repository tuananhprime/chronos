package com.mycompany.chronos.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageRedirectController {
    @GetMapping("/transactions.html")
    public String transactions() {
        return "redirect:/transaction.html";
    }

    @GetMapping("/documents.html")
    public String documents() {
        return "redirect:/document.html";
    }
}
