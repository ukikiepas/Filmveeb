import {Link} from "react-router-dom";

export const ExploreTopMovies = () => {
    return (
        <div className='p-5 mb-4 bg-dark header'>
            <div className='container-fluid py-5 text-white
                d-flex justify-content-center align-items-center'>
                <div>
                    <h1 className='display-5 fw-bold'>Znajdź swój następny film</h1>
                    <p className='col-md-8 fs-4'>Na co masz teraz ochote?</p>
                    <Link type='button' className='btn main-color btn-lg text-white' to='/search'>
                        Najlepsze filmy</Link>
                </div>
            </div>
        </div>
    );
}