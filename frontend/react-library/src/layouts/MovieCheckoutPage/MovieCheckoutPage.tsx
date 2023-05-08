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
import {Link} from "react-router-dom";

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
    const [isReviewChanged, setIsReviewChanged] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);
    const [reviewLeftStars, setReviewLeftStars] = useState<number>(0);


    //favourited state
    const [isMovieFavourited, setIsMovieFavourited] = useState(false);
    const [changeMovieFav, setChangeMovieFav] = useState(false);

    //Wypozyczenia -> staty do wypozyczen
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    //stany do zmiany jesli film jest juz wypozyczony
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingMovieCheckout, setIsLoadingMovieCheckout] = useState(true);

    const movieId = (window.location.pathname).split('/')[2];






    // use Effect do wczytywania filmu
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


    //use effect do wczytywania recenzji uzytkownika
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
                await getMovieRatingByUser();
                setIsReviewLeft(userReviewResponseJson);
            }
            setIsLoadingUserReview(false);
        }
        fetchUserReviewMovie().catch((error: any) => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })

    }, [authState, isReviewLeft])

    //use effect do wczytywania ilosci wypozyczonych filmow
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

    // useEffect do okreslania czy dany uzytkownik ma ten film dodany do ulubionych
    useEffect(() => {

        const fetchIsMovieFavourited = async () => {

            if(authState && authState.isAuthenticated){
                //tutaj przygotowuje dane do zapytania
                const url = `http://localhost:8080/api/favourite/secure/isFavourited?movieId=${movieId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        //tutaj ogarniam sobie token z aktualnego statu zebym mogl przekazac go do zapytania
                        //bo jest zabezpieczone i inaczej nie przejdzie
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                const movieFavourited = await fetch(url, requestOptions);
                if(!movieFavourited.ok){
                    throw new Error('Something went wrong!');
                }
                const moviesCheckedOUtResponseJson = await movieFavourited.json();
                setIsMovieFavourited(moviesCheckedOUtResponseJson);
            }
            setIsLoadingMovieCheckout(false);
        }
        fetchIsMovieFavourited().catch((error:any ) =>{
            setIsLoadingMovieCheckout(false);
            setHttpError(error.message);
        })

    }, [authState, changeMovieFav])


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


    // do wyslania opini
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
        setIsReviewLeft(!isReviewLeft);
        //window.location.reload();
    }


    // do przeslania zaktualizowanie opini
    async function updateReview(starInput: number, reviewDescription: string){

        let movieId: number = 0;
        if(movie?.id){
            movieId = movie.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, movieId, reviewDescription);
        const url = `http://localhost:8080/api/reviews/secure/user/updateReview`;
        const requestOptions = {
            method: 'PUT',
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
        setIsReviewChanged(!isReviewChanged);
        setIsReviewLeft(!isReviewLeft);
    }

    // do wzieca punktow gwiazdek konkretnego uzytkownika pod konkretnym filmem
    async function getMovieRatingByUser(){
        const url = `http://localhost:8080/api/reviews/secure/user/movie/rating/?movieId=${movieId}`;
        const requestOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const returnResponse = await fetch(url, requestOptions);
        if(!returnResponse.ok){
            throw new Error("Something went wrong!!!!!!!!!");
        }
        const returnResponseJson = await returnResponse.json()
        setReviewLeftStars(returnResponseJson)
    }

    //do wyslania dodania do ulubionych do bazy danych
    async function submitFavourited(){

        let movieId: number = 0;
        if(movie?.id){
            movieId = movie.id;
        }

        const url = `http://localhost:8080/api/favourite/secure/postFavourited?movieId=${movieId}`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const returnResponse = await fetch(url, requestOptions);
        if(!returnResponse.ok){
            throw new Error("Something went wrong!!");
        }
        setChangeMovieFav(!changeMovieFav);
    }

    async function deleteFavourited(){

        let movieId: number = 0;
        if(movie?.id){
            movieId = movie.id;
        }

        const url = `http://localhost:8080/api/favourite/secure/deleteFavourited?movieId=${movieId}`;
        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const returnResponse = await fetch(url, requestOptions);
        if(!returnResponse.ok){
            throw new Error("Something went wrong!!");
        }
        setChangeMovieFav(!changeMovieFav);
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


    // render buttonu do ulubionych ! :3
    function buttonFavouriteRender(){
        if(authState?.isAuthenticated){
            return (
                <div>
                    {
                        isMovieFavourited?
                            <button onClick={deleteFavourited} className='btn btn-outline-danger btn-sm '>Usuń z ulubionych</button>
                            :
                            <button onClick={submitFavourited} className='btn btn-outline-success btn-sm '>Dodaj do ulubionych</button>
                    }
                </div>

            )
        }else {
            return (<Link to={'/login'} className='btn btn-outline-success btn-sm'>Zaloguj sie aby dodać do ulubionych</Link>)
        }
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
                            {buttonFavouriteRender()}
                        </div>
                    </div>
                    <CheckoutAndReviewBox movie={movie} mobile={false} currentLoansCount={currentLoansCount} isAuthenticated={authState}
                                          isCheckedOut={isCheckedOut} checkoutMovie={checkoutMovie} isReviewLeft={isReviewLeft} submitReview={submitReview} updateReview={updateReview} reviewLeftStars={reviewLeftStars} isMovieFavourited={isMovieFavourited}/>
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
                        <StarsReview rating={totalStars} size={32} />
                        {buttonFavouriteRender()}
                    </div>
                </div>
                <CheckoutAndReviewBox movie={movie} mobile={true} currentLoansCount={currentLoansCount} isAuthenticated={authState}
                                      isCheckedOut={isCheckedOut} checkoutMovie={checkoutMovie} isReviewLeft={isReviewLeft} submitReview={submitReview} updateReview={updateReview} reviewLeftStars={reviewLeftStars} isMovieFavourited={isMovieFavourited}/>
                <hr/>
                <LatestReviews reviews={reviews} movieId={movie?.id} mobile={true}/>
            </div>


        </div>
    );
}

