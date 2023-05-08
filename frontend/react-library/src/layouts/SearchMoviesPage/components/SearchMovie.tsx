import MovieModel from "../../../models/MovieModel";
import {Link} from "react-router-dom";
import {useOktaAuth} from "@okta/okta-react";
import {useEffect, useState} from "react";




export const SearchMovie: React.FC<{ movie: MovieModel }> = (props) => {


    const {authState} = useOktaAuth();
    const [isFavourited, setIsFavourited] = useState(false)
    const [httpError, setHttpError] = useState(null);



    useEffect(() => {

        const fetchIsMovieFavourited = async () => {

            if(authState && authState.isAuthenticated){
                const url = `http://localhost:8080/api/favourite/secure/isFavourited?movieId=${props.movie.id}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                const movieFavourited = await fetch(url, requestOptions);
                if(!movieFavourited.ok){
                    throw new Error('Something went wrong!');
                }
                const moviesCheckedOUtResponseJson = await movieFavourited.json();
                setIsFavourited(moviesCheckedOUtResponseJson);
            }
        }
        fetchIsMovieFavourited().catch((error:any ) =>{
            setHttpError(error.message);
        })

    }, [authState])

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }


    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.movie.img ?
                            <img src={props.movie.img}
                                 width='123'
                                 height='196'
                                 alt='Movie'
                            />
                            :
                            <img src={require('../../../Images/MovieImage/movie1.jpg')}
                                 width='123'
                                 height='196'
                                 alt='Movie'
                            />
                        }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center
                        align-items-center'>
                        {props.movie.img ?
                            <img src={props.movie.img}
                                 width='123'
                                 height='196'
                                 alt='Movie'
                            />
                            :
                            <img src={require('../../../Images/MovieImage/movie1.jpg')}
                                 width='123'
                                 height='196'
                                 alt='Movie'
                            />
                        }
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>
                            {props.movie.director}
                        </h5>
                        <h4>
                            {props.movie.title}
                        </h4>
                        <p className='card-text'>
                            {props.movie.description}
                        </p>
                    </div>
                </div>
                <div className='col-md-4 d-flex justify-content-center align-items-center'>
                    <Link className='btn btn-md main-color text-white' to={`/checkout/${props.movie.id}`}>
                        Zobacz szczegóły
                    </Link>
                    {isFavourited ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#ff6666"
                             className="bi bi-heart-fill m-2" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#ff6666"
                             className="bi bi-heart-fill m-lg-2 opacity-0" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                        </svg>
                    }
                </div>
            </div>
        </div>
    );
}