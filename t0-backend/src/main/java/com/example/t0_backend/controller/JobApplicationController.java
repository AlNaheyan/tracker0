package com.example.t0_backend.controller;

import com.example.t0_backend.model.JobApplication;
import com.example.t0_backend.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://tracker0-eight.vercel.app"
})
public class JobApplicationController {
    
    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @GetMapping
    public List<JobApplication> getAllApplications() {
        return jobApplicationRepository.findAll();
    }

    @PostMapping
    public JobApplication createApplication(@RequestBody JobApplication jobApplication) {
        return jobApplicationRepository.save(jobApplication);
    }
    @GetMapping("/{id}")
    public JobApplication getapApplicationById(@PathVariable Long  id) {
        return jobApplicationRepository.findById(id).orElse(null);
    }
    @PutMapping("/{id}")
    public JobApplication updateApplication(@PathVariable Long id, @RequestBody JobApplication updatedApplication) {
        return jobApplicationRepository.findById(id).map(app -> {
            app.setCompanyName(updatedApplication.getCompanyName());
            app.setRole(updatedApplication.getRole());
            app.setJobType(updatedApplication.getJobType());
            app.setLocation(updatedApplication.getLocation());
            app.setStatus(updatedApplication.getStatus());
            app.setApplicationDate(updatedApplication.getApplicationDate());
            app.setLinks(updatedApplication.getLinks());
            return jobApplicationRepository.save(app);

        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteApplication(@PathVariable Long id) {
        jobApplicationRepository.deleteById(id);
    }
}
