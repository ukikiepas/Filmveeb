package com.ukanio.springbootlibrary.entity;


import lombok.Data;

import javax.persistence.*;


@Data
@Entity
@Table(name = "history")

public class History {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_email")
    private String userEmail;
    @Column(name = "checkout_date")
    private String checkoutDate;
    @Column(name = "returned_date")
    private String returnedDate;
    @Column(name = "title")
    private String title;
    @Column(name = "director")
    private String director;
    @Column(name = "description")
    private String description;
    @Column(name = "image")
    private String image;


    public History() {}

    public History(String userEmail, String checkoutDate, String returnedDate, String title, String director, String description, String image) {
        this.userEmail = userEmail;
        this.checkoutDate = checkoutDate;
        this.returnedDate = returnedDate;
        this.title = title;
        this.director = director;
        this.description = description;
        this.image = image;
    }
}
