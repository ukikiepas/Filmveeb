class ReviewModel{
    id: number;
    userEmail: string;
    date: string;
    rating: number;
    movieId: number;
    reviewDescription?: string;


    constructor(id: number, userEmail: string, date: string, rating: number, movieId: number, reviewDescription: string) {
        this.id = id;
        this.userEmail = userEmail;
        this.date = date;
        this.rating = rating;
        this.movieId = movieId;
        this.reviewDescription = reviewDescription;
    }
}


export default ReviewModel;