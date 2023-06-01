package com.ukanio.springbootlibrary.dao;

import com.ukanio.springbootlibrary.entity.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;


@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    Page<Movie> findByTitleContaining(@RequestParam("title") String title, Pageable pageable);

    Page<Movie> findByCategory(@RequestParam("category") String category, Pageable pageable);

    @Query("select o.title from Movie o where id = :id")
    String findTitleById(@Param("id") Long id);




    @Query("select o from Movie o where id in :movie_ids")
    List<Movie> findMoviesByMovieIds(@Param("movie_ids")List<Long> movieId);



}
