package com.ukanio.springbootlibrary.dao;

import com.ukanio.springbootlibrary.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {

    Checkout findByUserEmailAndMovieId(String userEmail, Long bookId);

    List<Checkout> findMoviesByUserEmail(String userEmail);

    // musimy dodać bo modyfikujemy dane w bazie (nie tylko findBy czyli szukamy)
    @Modifying
    @Query("delete from Checkout where movie_id in :movie_id")
    void deleteAllByMovieId(@Param("movie_id")Long movieId);


}
