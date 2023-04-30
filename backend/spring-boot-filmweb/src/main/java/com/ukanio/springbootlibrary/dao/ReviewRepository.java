package com.ukanio.springbootlibrary.dao;

import com.ukanio.springbootlibrary.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.data.domain.Pageable;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByMovieId(@RequestParam("movie_id") Long movieId, Pageable pageable);

    Review findByUserEmailAndMovieId(String userEmail, Long movieId);

    @Modifying
    @Query("delete from Review where movie_id in :movie_id")
    void deleteAllByMovieId(@Param("movie_id")Long movieId);




}
