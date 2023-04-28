import MovieModels from "../../../models/MovieModels";
import {Link} from "react-router-dom";

export const SearchMovie: React.FC<{ movie: MovieModels }> = (props) => {
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
                </div>
            </div>
        </div>
    );
}