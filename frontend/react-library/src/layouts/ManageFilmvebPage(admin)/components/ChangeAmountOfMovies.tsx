import {useEffect, useState} from "react";
import MovieModel from "../../../models/MovieModel";
import SpinnerLoading from "../../utils/SpinnerLoading";
import {Pagination} from "../../utils/Pagination";
import {ChangeAmountOfMovie} from "./ChangeAmountOfMovie";

export const ChangeAmountOfMovies = () => {

    //tutaj w zasadzie giga duzo kodu skopiowalem od zwyklego uzytkownika z SearchMoviesPage.tsx
    const [movies, setMovies] = useState<MovieModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [moviesPerPage] = useState(5);
    const [totalAmountOfMovies, setTotalAmountOfMovies] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const[bookDelete, setBookDelete] = useState(false);

    //Do pobierania wszystkich filmow z bazy
    useEffect(() => {
        const fetchMovies = async () => {
            const baseUrl: string = `http://localhost:8080/api/movies?page=${currentPage - 1}&size=${moviesPerPage}`;

            const response = await fetch(baseUrl);

            if(!response.ok) {
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
    }, [currentPage, bookDelete]);




    // do stron
    const indexOfLastMovie: number = currentPage * moviesPerPage;
    const indexOfFirstMovie: number = indexOfLastMovie - moviesPerPage;
    let lastItem = moviesPerPage * currentPage <= totalAmountOfMovies ?
        moviesPerPage * currentPage: totalAmountOfMovies;
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // zeby zmieniac stan i odswiezac (przekazuje przez props).
    // po to aby na tej stronie nam sie useEffect odswiezyl i nie pokazywal juz usunietej ksiazki
    const deleteBook = () => setBookDelete(!bookDelete);

    if(isLoading){
        return (
            <SpinnerLoading/>
        )
    }

    if(httpError){
        return(
            <div className='container m-5'>
                {httpError}
            </div>
        )
    }



    return(
        <div className='container mt-5'>
            {totalAmountOfMovies > 0 ?
                <>
                    <div className='mt-3'>
                        <h3>Ilość: ({totalAmountOfMovies})</h3>
                    </div>
                    <p>
                        {indexOfFirstMovie + 1} do {lastItem} z {totalAmountOfMovies} filmów:
                    </p>
                    {movies.map(movie => (
                        <ChangeAmountOfMovie movie={movie} key={movie.id} deleteBook={deleteBook}/>
                    ))}
                </>
                :
                <h5>Obecnie nie ma żadnych filmów </h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    )
}