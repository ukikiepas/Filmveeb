import {ReturnMovie} from "./ReturnMovie";
import {useEffect, useState} from "react";
import MovieModel from "../../../models/MovieModel";
import SpinnerLoading from "../../utils/SpinnerLoading";
import {Link} from "react-router-dom";

export default function Carousel(){

    const[movies, setMovies] = useState<MovieModel[]>([])
    const[isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // do karuzeli zeby ze wszystkich filmow korzystac
    const[movieNumber, setMovieNumber] = useState(1);
    const[movieNumber2, setMovieNumber2] = useState(4);
    const[determineWhichCarousel, setDetermineWhichCarousel] = useState(false);

    useEffect(() => {

        const fetchMovies = async () => {


            const url: string = `${process.env.REACT_APP_API}/movies`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.movies;

            const loadedMovies: MovieModel[] = [];


            for (const key in responseData) {
                loadedMovies.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    director: responseData[key].director,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img,
                });
            }

            setMovies(loadedMovies);
            setIsLoading(false);
        };
        fetchMovies().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, []);

    function getMovieNumForCarousel(){
        let moviesLength = movies.length -3;
        let randomNum = Math.floor(Math.random() * moviesLength);
        console.log("Karuzela nr 1: " + randomNum);
        setMovieNumber(randomNum);
    }

    function getMovieNumForCarousel2(){
        let moviesLength = movies.length -3;
        let randomNum = Math.floor(Math.random() * moviesLength);
        console.log("Karuzela nr 2: " + randomNum);
        setMovieNumber2(randomNum);
    }

    function onClickWraperCarousel(){
        if(determineWhichCarousel){
            getMovieNumForCarousel();
            setDetermineWhichCarousel(!determineWhichCarousel);
        }else {
            getMovieNumForCarousel2();
            setDetermineWhichCarousel(!determineWhichCarousel);
        }
    }









    if(isLoading){
        return (
           <SpinnerLoading/>
        )
    }

    if(httpError){
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }







    return (
        <div className='container mt-5' style={{ height: 550 }}>
            <div className='homepage-carousel-title'>
                <h3>Co dziś obejrzysz?</h3>
            </div>
            <div id='carouselExampleControls' className='carousel carousel-dark slide mt-5
                d-none d-lg-block' data-bs-interval='true'>

                {/*Desktop*/}
                <div className='carousel-inner'>
                    <div className='carousel-item active'>
                        <div className='row d-flex justify-content-center align-items-center'>
                                <ReturnMovie movie={movies[movieNumber]} key ={movies[movieNumber].id} />
                                <ReturnMovie movie={movies[movieNumber +1]} key ={movies[movieNumber +1].id} />
                                <ReturnMovie movie={movies[movieNumber +2]} key ={movies[movieNumber +2].id} />
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            <ReturnMovie movie={movies[movieNumber2]} key ={movies[movieNumber2].id} />
                            <ReturnMovie movie={movies[movieNumber2 +1]} key ={movies[movieNumber2 +1].id} />
                            <ReturnMovie movie={movies[movieNumber2 +2]} key ={movies[movieNumber2 +2].id} />
                        </div>
                    </div>

                </div>
                <button className='carousel-control-prev' type='button'
                        data-bs-target='#carouselExampleControls' data-bs-slide='prev' onClick={onClickWraperCarousel} >
                    <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Poprzedni</span>
                </button>
                <button className='carousel-control-next' type='button'
                        data-bs-target='#carouselExampleControls' data-bs-slide='next' onClick={onClickWraperCarousel}>
                    <span className='carousel-control-next-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Następny</span>
                </button>
            </div>



            {/*Mobile */}
            <div className='carousel carousel-dark slide d-lg-none mt-3' id='carouselExampleControlsMobile' data-bs-ride='carousel'>
                <div className='carousel-inner'>
                    {movies.slice(0, movies.length).map((movie, index) => (
                        <div className={`carousel-item${index === 0 ? ' active' : ''}`} key={movie.id}>
                            <div className='row d-flex justify-content-center align-items-center'>
                                <ReturnMovie movie={movie} key={movie.id}/>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='row d-flex justify-content-center align-items-center mt-3'>
                    <button className='carousel-control-prev' type='button' data-bs-target='#carouselExampleControlsMobile' data-bs-slide='prev' >
                        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Poprzedni</span>
                    </button>
                    <button className='carousel-control-next' type='button' data-bs-target='#carouselExampleControlsMobile' data-bs-slide='next' >
                        <span className='carousel-control-next-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Następny</span>
                    </button>
                </div>
            </div>



            <div className='homepage-carousel-title mt-3'>
                <Link className='btn btn-outline-secondary btn-lg' to='/search'>Więcej</Link>
            </div>
        </div>
    );

}