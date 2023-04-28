import MovieModels from "../../../models/MovieModels";
import React from "react";
import {Link} from "react-router-dom";


export const ReturnMovie: React.FC<{movie: MovieModels}> = (props) => {


    return (
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
            <div className='text-center'>
                {props.movie.img ?
                    <img
                        src={props.movie.img}
                        width='151'
                        height='233'
                        alt="movie"
                    />
                    :
                    <img
                        src={require('../../../Images/MovieImage/movie1.jpg')}
                        width='151'
                        height='233'
                        alt="movie"
                    />
                }
                <h6 className='mt-2'>{props.movie.title}</h6>
                <p>{props.movie.director}</p>
                <Link className='btn main-color text-white' to={`/checkout/${props.movie.id}`} >Zarezerwuj</Link>
            </div>
        </div>
    );
}
