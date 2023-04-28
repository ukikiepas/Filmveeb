package com.ukanio.springbootlibrary.entity;

import lombok.Data;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "movie")
@Data
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="movie_id")
    private Long id;

    @Column(name="title")
    private String title;

    @Column(name="director")
    private String director;

    @Column(name="description")
    private String description;

    @Column(name="copies")
    private int copies;

    @Column(name="copies_available")
    private int copiesAvailable;

    @Column(name="category")
    private String category;

    @Column(name="img")
    private String img;
}
