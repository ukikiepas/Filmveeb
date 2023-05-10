import {useOktaAuth} from "@okta/okta-react";
import React, {useEffect, useState} from "react";
//import ShelfCurrentLoans from "../../models/ShelfCurrentLoans";
import SpinnerLoading from "../../utils/SpinnerLoading";
import {Link} from "react-router-dom";
import {wait} from "@testing-library/user-event/dist/utils";
import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";
import MovieModel from "../../../models/MovieModel";
import {LoansModal} from "./LoansModal";
import {LeaveAReview} from "../../utils/LeaveAReview";
import IsRevieved from "./IsRevieved";

export const Loans = () => {

    // standardowe do weryfikacji i errorw
    const {authState} = useOktaAuth();
    const [httpError, setHttpError] = useState(null);

    // obecne wyopzyczenia

    //tutaj jeszcze <ShelfCurrentLoans[]> zeby okreslic co bedzie przechowywal
    const[shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
    const[isLoadingUserLoans, setIsLoadingUserLoans] = useState(true)

    //do zwrotow wypozyczonych filmow
    const[checkout, setCheckout] = useState(false);



    useEffect( () => {

        const fetchUserCurrentLoans = async () => {

            if(authState && authState.isAuthenticated){
                const url = `${process.env.REACT_APP_API}/movies/secure/currentloans`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const shelfCurrentLoansResponse = await fetch(url, requestOptions);
                if (!shelfCurrentLoansResponse.ok) {
                    throw new Error('Something went wrong!');
                }

                const shelfCurrentLoansResponseJson = await shelfCurrentLoansResponse.json();
                const shelfCurrentLoans = [];

                //tutaj nie działało tak jak zawsze robiłem i musiałem w ten sposób
                for (let i = 0; i < shelfCurrentLoansResponseJson.length; i++) {
                    const { category, copies, copiesAvailable, description, director, id, img, title } = shelfCurrentLoansResponseJson[i].movie;
                    const movie = new MovieModel(id, title, director, description, copies, copiesAvailable, category, img);
                    const loan = new ShelfCurrentLoans(movie, shelfCurrentLoansResponseJson[i].daysLeft);
                    shelfCurrentLoans.push(loan);
                }



                setShelfCurrentLoans(shelfCurrentLoans);
            }
            setIsLoadingUserLoans(false);
        }
        fetchUserCurrentLoans().catch((error: any) => {
            setIsLoadingUserLoans(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [authState, checkout]);

    // useEffect(() => {
    //     console.log("teeeest")
    //     console.log('shelfCurrentLoans changed:', shelfCurrentLoans);
    // }, [shelfCurrentLoans]);

    if(isLoadingUserLoans){
        return (
            <SpinnerLoading/>
        )
    }






    if(httpError){
        return (
            <div className='container m-5'>
                <p>
                    {httpError}
                </p>
            </div>
        )
    }

    //funkcja do zwaracania filmow
    async function returnMovie(movieId: number){
        const url = `${process.env.REACT_APP_API}/movies/secure/return/?movieId=${movieId}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const returnResponse = await fetch(url, requestOptions);
        if(!returnResponse.ok){
            throw new Error("Something went wrong!");
        }
        // to w zasadzie tylko po to zeby przy kazdym zwroceniu ksiazki odnawial nam sie nasz widok w apce
        // czyli wykona sie jeszcze po prostu useEffect ktory jest uzalezniony od tej zmiennej i odswiezy nasz widok :) :)
        setCheckout(!checkout)
    }


    // do odnawiania na 7 dni
    async function renewLoan(movieId: number){
        const url = `${process.env.REACT_APP_API}/movies/secure/renew/loan/?movieId=${movieId}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const returnResponse = await fetch(url, requestOptions);
        if(!returnResponse.ok){
            throw new Error("Something went wrong!");
        }
        // to w zasadzie tylko po to zeby przy kazdym odnowieniu filmu odnawial nam sie nasz widok w apce
        // czyli wykona sie jeszcze po prostu useEffect ktory jest uzalezniony od tej zmiennej i odswiezy nasz widok :) :)
        setCheckout(!checkout)
    }

    //do sprawdzenia czy dany user juz dał opinie
    async function checkIfRevieved(movieId: number){
        const url = `${process.env.REACT_APP_API}/reviews/secure/user/movie/?movieId=${movieId}`;
        const requestOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const returnResponse = await fetch(url, requestOptions);
        const returnResponseJson = await returnResponse.json();
        if(!returnResponse.ok){
            throw new Error("Something went wrong!");
        }
        return returnResponseJson;
    }



    const MyFunctionnalComponent: React.FC<{movieId:number, mobile:boolean}> = props => {
        const[isRevieved, setIsRevieved] = useState(false);

        useEffect(() => {
            const saveState = async () => {
                const true_false = await checkIfRevieved(props.movieId);
                setIsRevieved(true_false);
                console.log("odpowiedz IS REVIEVED: " + isRevieved)
            };
            saveState();
        }, [isRevieved]);

        return (
            <div>
                {props.mobile ?
                    <div>
                    {isRevieved?
                            <Link className='btn btn-success mt-2' to={`/checkout/${props.movieId}`}>
                                Zmień recenzje
                            </Link>
                            :
                            <Link className='btn btn-primary mt-2' to={`/checkout/${props.movieId}`}>
                                Zostaw recenzje
                            </Link>
                    }
                    </div>
                :
                    <div>
                    {isRevieved?
                            <Link className='btn btn-success' to={`/checkout/${props.movieId}`}>
                                Zmień recenzje
                            </Link>
                            :
                            <Link className='btn btn-primary' to={`/checkout/${props.movieId}`}>
                                Zostaw recenzje
                            </Link>
                    }
                    </div>

                }



            </div>
        );
    };







    return(
        <div>
            {/*Komputr*/}
            <div className='d-none d-lg-block mt-2'>
                {shelfCurrentLoans.length > 0 ?
                    <>
                        <h5>Obecne wypożyczenia: </h5>

                        {shelfCurrentLoans.map(shelfCurrentLoan => (
                            <div key={shelfCurrentLoan.movie.id}>
                                <div className='row mt-3 mb-3'>
                                    <div className='col-4 col-md-4 container'>
                                        {shelfCurrentLoan.movie?.img ?
                                            <img src={shelfCurrentLoan.movie?.img} width='226' height='349' alt='Movie'/>
                                            :
                                            <img src={require('../../../Images/MovieImage/movie1.jpg')}
                                                 width='226' height='349' alt='Movie'/>
                                        }
                                    </div>
                                    <div className='card col-3 col-md-3 container d-flex'>
                                        <div className='card-body'>
                                            <div className='mt-3'>
                                                <h4>Opcje</h4>
                                                {shelfCurrentLoan.daysLeft > 0 &&
                                                    <p className='text-secondary'>
                                                        Zostały {shelfCurrentLoan.daysLeft} dni.
                                                    </p>
                                                }
                                                {shelfCurrentLoan.daysLeft === 0 &&
                                                    <p className='text-success'>
                                                        Do dziś.
                                                    </p>
                                                }
                                                {shelfCurrentLoan.daysLeft < 0 &&
                                                    <p className='text-danger'>
                                                        Czas przekroczony o {shelfCurrentLoan.daysLeft} dni.
                                                    </p>
                                                }
                                                <div className='list-group mt-3'>
                                                    <button className='list-group-item list-group-item-action'
                                                            aria-current='true' data-bs-toggle='modal'
                                                            data-bs-target={`#modal${shelfCurrentLoan.movie.id}`}>
                                                        Zarządaj wypożyczeniem
                                                    </button>
                                                    <Link to={'search'} className='list-group-item list-group-item-action'>
                                                        Więcej filmów.
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr/>
                                            <p className='mt-3'>
                                                Pomóż innym wybrać film na wieczór
                                            </p>
                                            <MyFunctionnalComponent movieId={shelfCurrentLoan.movie.id} mobile={false}/>

                                        </div>
                                    </div>
                                </div>
                                <hr/>
                                <LoansModal shelfCurrentLoan={shelfCurrentLoan} mobile={false} returnMovie={returnMovie} renewLoan={renewLoan   }/>

                            </div>
                        ))}
                    </>
                    :
                    <>
                        <h3 className='mt-3'>
                            Obecnie nie masz żadnego wypożyczenia
                        </h3>
                        <Link className='btn btn-primary mt-2' to={`search`}>
                            Poszukaj nowego filmu
                        </Link>
                    </>
                }
            </div>

            {/*Mobilki*/}
            <div>
                <div className='container d-lg-none mt-2'>
                    {shelfCurrentLoans.length > 0 ?
                        <>
                            <h5 className='mb-3'> Obecne wypożyczenia: </h5>

                            {shelfCurrentLoans.map(shelfCurrentLoan => (
                                <div key={shelfCurrentLoan.movie.id}>
                                    <div className='d-flex justify-content-center align-items-center'>
                                        {shelfCurrentLoan.movie?.img ?
                                            <img src={shelfCurrentLoan.movie?.img} width='226' height='349' alt='Movie'/>
                                            :
                                            <img src={require('../../../Images/MovieImage/movie1.jpg')}
                                                 width='226' height='349' alt='Movie'/>
                                        }
                                    </div>
                                    <div className='card d-flex mt-5 mb-3'>
                                        <div className='card-body container'>
                                            <div className='mt-3'>
                                                <h4>Opcje</h4>
                                                {shelfCurrentLoan.daysLeft > 0 &&
                                                    <p className='text-secondary'>
                                                        Zostały {shelfCurrentLoan.daysLeft} dni.
                                                    </p>
                                                }
                                                {shelfCurrentLoan.daysLeft === 0 &&
                                                    <p className='text-success'>
                                                        Do dziś.
                                                    </p>
                                                }
                                                {shelfCurrentLoan.daysLeft < 0 &&
                                                    <p className='text-danger'>
                                                        Czas przekroczony o {shelfCurrentLoan.daysLeft} dni.
                                                    </p>
                                                }
                                                <div className='list-group mt-3'>
                                                    <button className='list-group-item list-group-item-action'
                                                            aria-current='true' data-bs-toggle='modal'
                                                            data-bs-target={`#mobilemodal${shelfCurrentLoan.movie.id}`}>
                                                        Zarządaj wypożyczeniem
                                                    </button>
                                                    <Link to={'search'} className='list-group-item list-group-item-action'>
                                                        Więcej filmów.
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr/>
                                            <p className='mt-3'>
                                                Pomóż innym wybrać film na wieczór
                                            </p>
                                            <MyFunctionnalComponent movieId={shelfCurrentLoan.movie.id} mobile={true}/>

                                        </div>
                                    </div>
                                    <hr/>
                                    <LoansModal shelfCurrentLoan={shelfCurrentLoan} mobile={true} returnMovie={returnMovie} renewLoan={renewLoan}/>

                                </div>
                            ))}
                        </> :
                        <>
                            <h3 className='mt-3'>
                                Obecnie nie masz żadnego wypożyczenia
                            </h3>
                            <Link className='btn btn-primary mt-2' to={`/search`}>
                                Poszukaj nowego filmu
                            </Link>
                        </>
                    }
                </div>
            </div>
        </div>
    );



}