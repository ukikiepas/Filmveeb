import { useEffect, useState } from "react";
import MovieModel from "../../models/MovieModel";
import SpinnerLoading from "../utils/SpinnerLoading";
import {StarsReview} from "../utils/StarsReview";
import {CheckoutAndReviewBox} from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {LatestReviews} from "./LatestReviews";
import {useOktaAuth} from "@okta/okta-react";
import reviewRequestModel from "../../models/ReviewRequestModel";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export default function MovieCheckoutPage() {

    //Do weryfikownia jakie konto
    const {authState} = useOktaAuth();

    //Filmy
    const [movie, setMovie] = useState<MovieModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);
    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    //Wypozyczenia -> staty do wypozyczen
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    //stany do zmiany jesli film jest juz wypozyczony
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingMovieCheckout, setIsLoadingMovieCheckout] = useState(true);

    const movieId = (window.location.pathname).split('/')[2];

    // use Effect do wczytywania ksiazki
    useEffect(() => {
        const fetchMovie = async () => {
            const baseUrl: string = `http://localhost:8080/api/movies/${movieId}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!!!!!');
            }

            const responseJson = await response.json();


            const loadedMovie: MovieModel = {
                id: responseJson.id,
                title: responseJson.title,
                director: responseJson.director,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };


            setMovie(loadedMovie);
            setIsLoading(false);
        };
        fetchMovie().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [isCheckedOut]);

    // use effect do wczytywania recenzji
    useEffect(() => {

        const fetchMovieReview = async () =>{

            const reviewUrl: string  = `http://localhost:8080/api/reviews/search/findByMovieId?movieId=${movieId}`;

            const responseReviews = await fetch(reviewUrl);

            if(!responseReviews.ok){
                throw new Error('Something went wrong');
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData =  responseJsonReviews._embedded.reviews;

            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;

            for(const key in responseData){
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    movieId: responseData[key].movieId,
                    reviewDescription: responseData[key].reviewDescription,
                })
                // tutaj sumujemy punkty :)
                weightedStarReviews = weightedStarReviews + responseData[key].rating;
            }

            // tutaj zaokraglamy albo do liczba.0 albo do liczba.5
            if(loadedReviews){
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2 ) / 2)
                                .toFixed(1);
                setTotalStars(Number(round));

            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);

        }

        fetchMovieReview().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, [isReviewLeft])


    useEffect(() => {

        const fetchUserReviewMovie = async () => {

            if(authState && authState.isAuthenticated) {

                //tutaj przygotowuje dane do zapytania
                const url = `http://localhost:8080/api/reviews/secure/user/movie/?movieId=${movieId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                const userReview = await fetch(url, requestOptions);
                if(!userReview.ok){
                    throw new Error('Something went wrong ');
                }
                const userReviewResponseJson = await userReview.json();
                setIsReviewLeft(userReviewResponseJson);
            }
            setIsLoadingUserReview(false);
        }
        fetchUserReviewMovie().catch((error: any) => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })

    }, [authState])


    //use effect do wczytywania recenzji
    useEffect( () => {
        const fetchUserCurrentLoansCount = async () => {
            if(authState && authState.isAuthenticated){

                //tutaj przygotowuje dane do zapytania
                const url = `http://localhost:8080/api/movies/secure/currentloans/count`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        //tutaj ogarniam sobie token z aktualnego statu zebym mogl przekazac go do zapytania
                        //bo jest zabezpieczone i inaczej nie przejdzie
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                const currentLoansCountResponse = await fetch(url, requestOptions);
                if(!currentLoansCountResponse.ok){
                    throw new Error('Something went wrong!');
                }
                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountResponseJson);
            }
            setIsLoadingCurrentLoansCount(false);
        }
        fetchUserCurrentLoansCount().catch((error: any) =>{
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        })
    }, [authState, isCheckedOut])

    // efekt do okreslania czy dany uzytkownik ma juz ten film :->
    useEffect(() => {

        const fetchUserCheckedOutMovie = async () => {

            if(authState && authState.isAuthenticated){
                //tutaj przygotowuje dane do zapytania
                const url = `http://localhost:8080/api/movies/secure/ischeckedout/byuser/?movieId=${movieId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        //tutaj ogarniam sobie token z aktualnego statu zebym mogl przekazac go do zapytania
                        //bo jest zabezpieczone i inaczej nie przejdzie
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                const moviesCheckedOut = await fetch(url, requestOptions);
                if(!moviesCheckedOut.ok){
                    throw new Error('Something went wrong!');
                }
                const moviesCheckedOUtResponseJson = await moviesCheckedOut.json();
                setIsCheckedOut(moviesCheckedOUtResponseJson);
            }
            setIsLoadingMovieCheckout(false);
        }
        fetchUserCheckedOutMovie().catch((error:any ) =>{
            setIsLoadingMovieCheckout(false);
            setHttpError(error.message);
        })

    }, [authState])


    //---------------------------------------------------------------------------

    async function checkoutMovie(){
        const url = `http://localhost:8080/api/movies/secure/checkout/?movieId=${movie?.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                //tutaj ogarniam sobie token z aktualnego statu zebym mogl przekazac go do zapytania
                //bo jest zabezpieczone i inaczej nie przejdzie
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const checkoutResponse = await fetch(url, requestOptions);
        if(!checkoutResponse.ok){
            throw new Error('Something went wrong!');
        }
        setIsCheckedOut(true);

    }

    async function submitReview(starInput: number, reviewDescription: string){

        let movieId: number = 0;
        if(movie?.id){
            movieId = movie.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, movieId, reviewDescription);
        const url = `http://localhost:8080/api/reviews/secure`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            // zamieniam tym cialko z TS/JS na Jsona zeby moglo przejsc przez PUT'a
            body: JSON.stringify(reviewRequestModel)
        };
        const returnResponse = await fetch(url, requestOptions);
        if(!returnResponse.ok){
            throw new Error("Something went wrong!!");
        }
        setIsReviewLeft(true);
    }

    if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingMovieCheckout || isLoadingUserReview) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    return (
        <div>
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {movie?.img ?
                            <img src={movie?.img} width='226' height='349' alt='Movie' />
                            :
                            <img src={require('../../Images/MovieImage/movie1.jpg')} width='226'
                                 height='349' alt='Movie' />
                        }
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{movie?.title}</h2>
                            <h5 className='text-primary'>{movie?.director}</h5>
                            <p className='lead'>{movie?.description}</p>
                            <StarsReview rating={totalStars} size={32}/>
                        </div>
                    </div>
                    <CheckoutAndReviewBox movie={movie} mobile={false} currentLoansCount={currentLoansCount} isAuthenticated={authState}
                                          isCheckedOut={isCheckedOut} checkoutMovie={checkoutMovie} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                </div>
                <hr />
                <LatestReviews reviews={reviews} movieId={movie?.id} mobile={false} />
            </div>


            {/*MOBILKI !!!*/}
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center align-items-center'>
                    {movie?.img ?
                        <img src={movie?.img} width='226' height='349' alt='Movie' />
                        :
                        <img src={require('../../Images/MovieImage/movie1.jpg')} width='226'
                             height='349' alt='Movie' />
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{movie?.title}</h2>
                        <h5>{movie?.director}</h5>
                        <p>{movie?.description}</p>
                        <StarsReview rating={2.5} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox movie={movie} mobile={true} currentLoansCount={currentLoansCount} isAuthenticated={authState}
                                      isCheckedOut={isCheckedOut} checkoutMovie={checkoutMovie} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                <hr/>
                <LatestReviews reviews={reviews} movieId={movie?.id} mobile={true}/>
            </div>


        </div>
    );
}

