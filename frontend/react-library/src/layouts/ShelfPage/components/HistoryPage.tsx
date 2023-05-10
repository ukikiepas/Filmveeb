import {useOktaAuth} from "@okta/okta-react";
import React, {useEffect, useState} from "react";
import HistoryModel from "../../../models/HistoryModel";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import SpinnerLoading from "../../utils/SpinnerLoading";
import {Pagination} from "../../utils/Pagination";
import {Link} from "react-router-dom";

export const HistoryPage = () => {


    const {authState} = useOktaAuth();
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //Historia (model)
    const [histories, setHistories] = useState<HistoryModel[]>([]);

    // strony (pagination)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages]  = useState(0);


    //do pobierania histori :>
    useEffect(() => {

        const fetchUserHistory = async () =>{

            if(authState && authState.isAuthenticated){
                const url =`${process.env.REACT_APP_API}/histories/search/findMoviesByUserEmail/?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage -1}&size=5`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                const historyResponse = await fetch(url, requestOptions);
                console.log(historyResponse);
                if(!historyResponse.ok){
                    throw new Error("Something went wrong")
                }
                const historyResponseJson = await historyResponse.json();

                setHistories(historyResponseJson._embedded.histories);
                setTotalPages(historyResponseJson.page.totalPages);

            }
            setIsLoadingHistory(false);


        }
        fetchUserHistory().catch((error: any) => {
            setIsLoadingHistory(false)
            setHttpError(error.message);
        })

    }, [authState, currentPage]);

    if(isLoadingHistory){
        return(
            <SpinnerLoading/>
        )
    }

    if(httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return(
        <div className='mt-2'>
            {histories.length > 0 ?
                <>
                    <h5>Historia wypożyczeń:</h5>

                    {histories.map(history => (
                        <div key={history.id}>
                            <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
                                <div className='row g-0'>
                                    <div className='col-md-2'>
                                        <div className='d-none d-lg-block'>
                                            {history.image ?
                                                <img src={history.image} width='123' height='196' alt='Movie' />
                                                :
                                                <img src={require('../../../Images/MovieImage/movie1.jpg')}
                                                     width='123' height='196' alt='Default'/>
                                            }
                                        </div>
                                        <div className='d-lg-none d-flex justify-content-center align-items-center'>
                                            {history.image ?
                                                <img src={history.image} width='123' height='196' alt='Movie' />
                                                :
                                                <img src={require('../../../Images/MovieImage/movie1.jpg')}
                                                     width='123' height='196' alt='Default'/>
                                            }
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='card-body'>
                                            <h5 className='card-title'> {history.director} </h5>
                                            <h4>{history.title}</h4>
                                            <p className='card-text'>{history.description}</p>
                                            <hr/>
                                            <p className='card-text'> Wypożyczono: {history.checkoutDate}</p>
                                            <p className='card-text'> Zwrócono: {history.returnedDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                        </div>
                    ))}
                </>
                :
                <>
                    <h3 className='mt-3'>Obecnie nie masz żadnej historii wypożyczeń </h3>
                    <Link className='btn btn-primary' to={'/search'}>
                        Poszukaj nowego filmu
                    </Link>
                </>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    )
}