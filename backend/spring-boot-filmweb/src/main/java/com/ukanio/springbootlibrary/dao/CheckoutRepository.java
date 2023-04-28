package com.ukanio.springbootlibrary.dao;

import com.ukanio.springbootlibrary.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {

    Checkout findByUserEmailAndMovieId(String userEmail, Long bookId);

    List<Checkout> findMoviesByUserEmail(String userEmail);


}
