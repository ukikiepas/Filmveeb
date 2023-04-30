package com.ukanio.springbootlibrary.requestmodels;


import lombok.Data;


@Data
public class AddMovieRequest {

    private String title;

    private String director;

    private String description;

    private int copies;

    private String category;

    private String img;

}
