package com.ukanio.springbootlibrary.responsemodels;

import com.ukanio.springbootlibrary.entity.Movie;
import lombok.Data;



@Data
public class ShelfCurrentLoansResponse {

        private Movie movie;

        private int daysLeft;

        public ShelfCurrentLoansResponse(Movie movie, int daysLeft) {
            this.movie = movie;
            this.daysLeft = daysLeft;
        }



}
