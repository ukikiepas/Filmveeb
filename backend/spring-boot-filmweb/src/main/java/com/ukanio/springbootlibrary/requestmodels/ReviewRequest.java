package com.ukanio.springbootlibrary.requestmodels;


import lombok.Data;

import java.util.Optional;

@Data
public class ReviewRequest {

    private double rating;

    private Long movieId;

    private Optional<String> reviewDescription;

}
