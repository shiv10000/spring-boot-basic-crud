package com.shivam.spring_boot_rest;


import com.shivam.spring_boot_rest.model.JobPost;
import com.shivam.spring_boot_rest.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@org.springframework.web.bind.annotation.RestController
public class RestController {

    @Autowired
    private JobService service;

    @GetMapping("jobPosts")
    public List<JobPost> getAllJobs(){
        return service.getAllJobs();
    }

    @GetMapping("getJob/{id}")
    public JobPost getJob(@PathVariable("id") int id){
        return service.getJob(id);
    }

    @PostMapping("getJob")
    public void addJov(@RequestBody JobPost jobPost){
         service.addJobPost(jobPost);
    }

    @PutMapping("getJob")
    public void updateJob(@RequestBody JobPost jobPost){
        service.updateJob(jobPost);

    }

    @DeleteMapping("getJob/{id}")
    public void deleteJob(@PathVariable Integer id){
        service.deleteJob(id);


    }
}
