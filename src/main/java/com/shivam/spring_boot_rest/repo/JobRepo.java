package com.shivam.spring_boot_rest.repo;


import com.shivam.spring_boot_rest.model.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepo extends JpaRepository<JobPost, Integer> {
    @Query("select j from JobPost j where j.reqExperiance = ?1")
    List<JobPost> findByReqExperiance(Integer exp);
}
