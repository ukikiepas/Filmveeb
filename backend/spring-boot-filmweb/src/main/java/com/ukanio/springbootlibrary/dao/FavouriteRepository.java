package com.ukanio.springbootlibrary.dao;

import com.ukanio.springbootlibrary.entity.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavouriteRepository extends JpaRepository<Favourite, Long> {

    List<Favourite> findByUserEmail(String userEmail);

    Optional<Favourite> findByUserEmailAndMovieId(String userEmail, Long movieId);



    Optional<Favourite> findByMovieId(Long id);

    void delete(Favourite favourite);
}
