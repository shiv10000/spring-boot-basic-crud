package com.shivam.spring_boot_rest.service;

import com.shivam.spring_boot_rest.model.JobPost;
import com.shivam.spring_boot_rest.repo.JobRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class JobService {

    @Autowired
    public JobRepo repo;


    public List<JobPost> getAllJobs(){
        return repo.findAll();
    }


    public void addJobPost(JobPost jobPost) {
        repo.save(jobPost);
    }

    public JobPost getJob(int id) {
       return repo.findById(id).orElse(new JobPost());
    }

    public void updateJob(JobPost c) {
        repo.save(c);

    }

    public void deleteJob(Integer id) {

        repo.deleteById(id);
    }
}
