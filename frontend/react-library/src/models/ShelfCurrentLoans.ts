import MovieModels from "./MovieModels";

class ShelfCurrentLoans{

    movie: MovieModels;
    daysLeft: number;


    constructor(movie: MovieModels, daysLeft: number) {
        this.movie = movie;
        this.daysLeft = daysLeft;
    }
}

export default ShelfCurrentLoans;
