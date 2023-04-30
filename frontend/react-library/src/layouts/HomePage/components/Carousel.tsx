import {ReturnMovie} from "./ReturnMovie";
import {useEffect, useState} from "react";
import MovieModel from "../../../models/MovieModel";
import SpinnerLoading from "../../utils/SpinnerLoading";
import {Link} from "react-router-dom";

export default function Carousel(){

    const[movies, setMovies] = useState<MovieModel[]>([])
    const[isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {

        const fetchMovies = async () => {
            const baseUrl: string = "http://localhost:8080/api/movies";

            const url: string = `${baseUrl}?page=0&size=9`;

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
                d-none d-lg-block' data-bs-interval='false'>

                {/* Desktop */}
                <div className='carousel-inner'>
                    <div className='carousel-item active'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {movies.slice(0, 3).map(movie => (
                                <ReturnMovie movie={movie} key ={movie.id} />
                            ))}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {movies.slice(3, 6).map(movie => (
                                <ReturnMovie movie={movie} key ={movie.id} />
                            ))}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {movies.slice(6, 9).map(movie => (
                                <ReturnMovie movie={movie} key ={movie.id} />
                            ))}
                        </div>
                    </div>
                </div>
                <button className='carousel-control-prev' type='button'
                        data-bs-target='#carouselExampleControls' data-bs-slide='prev'>
                    <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Poprzedni</span>
                </button>
                <button className='carousel-control-next' type='button'
                        data-bs-target='#carouselExampleControls' data-bs-slide='next'>
                    <span className='carousel-control-next-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Następny</span>
                </button>
            </div>

             {/*Mobile */}
            <div className='d-lg-none mt-3'>
                <div className='row d-flex justify-content-center align-items-center'>
                    <ReturnMovie movie={movies[7]} key={movies[7].id}/>
                </div>
            </div>


            <div className='homepage-carousel-title mt-3'>
                <Link className='btn btn-outline-secondary btn-lg' to='/search'>Więcej</Link>
            </div>
        </div>
    );

}