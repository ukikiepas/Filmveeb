import React, {useEffect, useState} from "react";
import MovieModel from "../../models/MovieModel";
import SpinnerLoading from "../utils/SpinnerLoading";
import {SearchMovie} from "./components/SearchMovie";
import {Pagination} from "../utils/Pagination";
import {Link} from "react-router-dom";
import {useOktaAuth} from "@okta/okta-react";



export default function SearchMoviesPage(){

    const {authState} = useOktaAuth();

    const [movies, setMovies] = useState<MovieModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [moviesPerPage] = useState(5);
    const [totalAmountOfMovies, setTotalAmountOfMovies] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    // const [searchUrlFav, setSearchUrlFav] = useState(``);
    const [categorySelection, setCategorySelection] = useState('Gatunek filmu');


    // do ulubionych
    const [onlyFavourited, setOnlyFavourited] = useState(false);


    //Do pobierania wszystkich filmow z bazy
    useEffect(() => {
        const fetchMovies = async () => {
            const baseUrl: string = "http://localhost:8080/api/movies";
            let url: string = ``;

            if(onlyFavourited){
                url = `http://localhost:8080/api/movies`
            }else {
                if(searchUrl ===``){
                    url = `${baseUrl}?page=${currentPage - 1}&size=${moviesPerPage}`
                }else {
                    let searchWithPage = searchUrl.replace('<pageNumber', `${currentPage -1}`);
                    url = baseUrl + searchWithPage;
                }
            }


            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.movies;
            setTotalPages(responseJson.page.totalPages);
            setTotalAmountOfMovies(responseJson.page.totalElements);


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

            if(onlyFavourited){
                const favouriteIds = await getIdsOfFavourited();
                let filteredMovies = loadedMovies.filter(movie => favouriteIds.includes(movie.id));
                if(categorySelection !== 'Gatunek filmu' && categorySelection !== 'Wszystkie'){
                    filteredMovies = filteredMovies.filter(movie => movie.category === categorySelection.toLowerCase());
                }
                if(search !== ''){
                    filteredMovies = filteredMovies.filter(movie => movie.title.toLowerCase().includes(search.toLowerCase()));
                }
                setMovies(filteredMovies);
                setTotalAmountOfMovies(filteredMovies.length)
                setTotalPages(setTotalPagesForFavourited(filteredMovies.length + 1))
            }else {
                setMovies(loadedMovies);
            }
            setIsLoading(false);
        };
        fetchMovies().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
        //tutaj mowimy zeby po kazdym odnowieniu listy stronka
        // szla nam do punktu 0;0 czyli na gore
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl, onlyFavourited, categorySelection]);

    async function getIdsOfFavourited(){
        const url =`http://localhost:8080/api/favourite/secure/getFavourites`;
        const requestOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const returnResponse = await fetch(url, requestOptions);
        if(!returnResponse.ok){
            throw new Error("Something went wrong!!");
        }
        const returnResponseJson = await returnResponse.json();
        const movieIds = [];
        for(const fav of returnResponseJson){
            movieIds.push(fav.movieId);
        }
        return movieIds;

    }

    function setTotalPagesForFavourited(lengthOfFav:number) {
        if(lengthOfFav / 5 <= 1){
            return 1;
        }else {
            if(lengthOfFav % 5 === 0){
                return lengthOfFav / 5;
            }else {
                return lengthOfFav /5 + 1;
            }
        }
    }


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
        setCategorySelection('Gatunek filmu')
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
            setCategorySelection('Wszystkie');
            setSearchUrl(`?page=0&size=${moviesPerPage}`);
        }
    }

    function forButton (){
        setOnlyFavourited(!onlyFavourited)
        searchHandleChange()
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


                    <div className='row col-10 mt-5'>
                        <div className='col-6 text-nowrap'>
                            <div className='d-flex '>

                                <input className='form-control me-2' type='search'
                                       placeholder='Wyszukaj' aria-labelledby='Search'
                                       onChange={e => setSearch(e.target.value)}
                                />
                                <button className='btn btn-outline-success ms-3 '
                                        onClick={() => searchHandleChange()}>
                                    Szukaj
                                </button>

                            </div>
                        </div>
                        <div className='col-6'>
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
                                <button className='btn  ms-3 '
                                    onClick={forButton}>
                                    {onlyFavourited?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             fill="#ff6666" className="bi bi-heart-fill" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd"
                                                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                                        </svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                                            <path
                                                d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                                        </svg>
                                    }
                                </button>


                            </div>

                        </div>


                    </div>

                    {totalAmountOfMovies > 0 ?
                        <>
                            <div className='mt-3'>
                                {onlyFavourited ?
                                    <h5>Liczba ulubionych filmów: ({totalAmountOfMovies})</h5>
                                    :
                                    <h5>Liczba rezultatów: ({totalAmountOfMovies})</h5>
                                }
                            </div>
                                {!onlyFavourited &&
                                    <p>{indexOfFirstMovie + 1} do {lastItem} z {totalAmountOfMovies} filmów:</p>
                                }

                            {movies.map(movie => (
                                <SearchMovie movie={movie} key={movie.id} />
                            ))}
                        </>
                        :
                        <div className='m-5'>
                            <h3>
                                Nie możesz znaleźć czego szukasz?
                            </h3>
                            <Link type='button' className='btn main-color btn-md px-4
                                me-md-2 fw-bold text-white' to='/messages'>
                                Skontaktuj się
                            </Link>
                        </div>
                    }
                    {totalPages > 1 && !onlyFavourited &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>
                    }

                </div>
            </div>
        </div>



    );
}