import {useEffect, useState} from "react";
import MovieModel from "../../models/MovieModel";
import SpinnerLoading from "../utils/SpinnerLoading";
import {SearchMovie} from "./components/SearchMovie";
import {Pagination} from "../utils/Pagination";

export default function SearchMoviesPage(){

    const [movies, setMovies] = useState<MovieModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [moviesPerPage] = useState(5);
    const [totalAmountOfMovies, setTotalAmountOfMovies] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('Gatunek filmu');


    //Do pobierania wszystkich filmow z bazy
    useEffect(() => {
        const fetchMovies = async () => {
            const baseUrl: string = "http://localhost:8080/api/movies";

            let url: string = ``;

            if(searchUrl ===``){
                url = `${baseUrl}?page=${currentPage - 1}&size=${moviesPerPage}`
            }else {
                let searchWithPage = searchUrl.replace('<pageNumber', `${currentPage -1}`);
                url = baseUrl + searchWithPage;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.movies;

            setTotalAmountOfMovies(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

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
        //tutaj mowimy zeby po kazdym odnowieniu listy stronka
        // szla nam do punktu 0;0 czyli na gore
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

    if (isLoading) {
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

    const searchHandleChange = () => {
        setCurrentPage(1);
        if(search === ''){
            setSearchUrl('')
        }else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${moviesPerPage}`)
        }
        setCategorySelection('Movie category')
    }

    const categoryField = (value: string) => {
        setCurrentPage(1);
        if(
            value.toLowerCase() === 'akcji'||
            value.toLowerCase() === 'thriller'||
            value.toLowerCase() === 'komedia'||
            value.toLowerCase() === 'horror'
        ){
            setCategorySelection(value);
            setSearchUrl(`/search/findByCategory?category=${value}&page=<pageNumber>&size=${moviesPerPage}`)
        }else {
            setCategorySelection('All');
            setSearchUrl(`?page=0&size=${moviesPerPage}`);
        }
    }



    const indexOfLastMovie: number = currentPage * moviesPerPage;
    const indexOfFirstMovie: number = indexOfLastMovie - moviesPerPage;
    let lastItem = moviesPerPage * currentPage <= totalAmountOfMovies ?
        moviesPerPage * currentPage: totalAmountOfMovies;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className='container'>
                <div>
                    <div className='row mt-5'>
                        <div className='col-6'>
                            <div className='d-flex'>
                                <input className='form-control me-2' type='search'
                                       placeholder='Wyszukaj' aria-labelledby='Search'
                                       onChange={e => setSearch(e.target.value)}
                                />
                                <button className='btn btn-outline-success'
                                        onClick={() => searchHandleChange()}>
                                    Szukaj
                                </button>
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className='dropdown'>
                                <button className='btn btn-secondary dropdown-toggle' type='button'
                                        id='dropdownMenuButton1' data-bs-toggle='dropdown'
                                        aria-expanded='false'>
                                    {categorySelection}
                                </button>
                                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li onClick={() => categoryField('Wszystkie')}>
                                        <a className='dropdown-item' href='#'>
                                            Wszystkie
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Akcji')}>
                                        <a className='dropdown-item' href='#'>
                                            Akcji
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Thriller')}>
                                        <a className='dropdown-item' href='#'>
                                            Thriller
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Komedia')}>
                                        <a className='dropdown-item' href='#'>
                                            Komedia
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Horror')}>
                                        <a className='dropdown-item' href='#'>
                                            Horror
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {totalAmountOfMovies > 0 ?
                        <>
                            <div className='mt-3'>
                                <h5>Liczba rezultatów: ({totalAmountOfMovies})</h5>
                            </div>
                            <p>
                                {indexOfFirstMovie + 1} do {lastItem} z {totalAmountOfMovies} filmów:
                            </p>
                            {movies.map(movie => (
                                <SearchMovie movie={movie} key={movie.id} />
                            ))}
                        </>
                        :
                        <div className='m-5'>
                            <h3>
                                Nie możesz znaleźć czego szukasz?
                            </h3>
                            <a type='button' className='btn main-color btn-md px-4
                                me-md-2 fw-bold text-white' href='#'>
                                Skontaktuj się
                            </a>
                        </div>
                    }
                    {totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>
                    }

                </div>
            </div>
        </div>
    );
}