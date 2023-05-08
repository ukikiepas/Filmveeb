package com.ukanio.springbootlibrary.entity;


import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "favourite")
@Data
public class Favourite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "movie_id")
    private Long movieId;

    public Favourite(Long id, String userEmail, Long movieId) {
        this.id = id;
        this.userEmail = userEmail;
        this.movieId = movieId;
    }

    public Favourite() {

    }
}
