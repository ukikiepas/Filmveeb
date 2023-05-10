import React, {useEffect, useState} from "react";
import MovieModel from "../../../models/MovieModel";
import {useOktaAuth} from "@okta/okta-react";

export const ChangeAmountOfMovie: React.FC<{movie: MovieModel, deleteBook: any}> = (props, key) => {

    const {authState} = useOktaAuth();

    const[quantity, setQuantity] = useState<number>(0);
    const[remaining, setRemaining] = useState<number>(0)

    useEffect(()=> {

        const fetchMoviesInState = () => {
            props.movie.copies ? setQuantity(props.movie.copies) : setQuantity(0);
            props.movie.copiesAvailable ? setRemaining(props.movie.copiesAvailable) : setRemaining(0);
        }
        fetchMoviesInState();

    }, [])


    // funkcja do zwiekszania ilosci ksiazek
    async function increaseQuantity(){
        const url = `${process.env.REACT_APP_API}/admin/secure/increase/movie/quantity?movieId=${props.movie?.id}`
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const increaseQuantityResponse = await fetch(url, requestOptions);
        if(!increaseQuantityResponse.ok){
            throw new Error("Something went wrong")!
        }
        // tutaj w zasadzie moglibsmy znowu uzyc useEffecta zeby wcyztac z bazy wszystkie filmy,
        // ale to by bylo duzo wszystkiego a tak w sumie bedzie prosicej hardcodowac ilosc + 1 jak sie uda, a przy
        //odswiezeniu strony na nowo juz i tak pojdzie nam z bazy dobra ilosc
        setQuantity(quantity +1);
        setRemaining(remaining +1);
    }

    // funkcja do zmniejszania ilosci ksiazek

    async function decreaseQuantity(){
        const url = `${process.env.REACT_APP_API}/admin/secure/decrease/movie/quantity?movieId=${props.movie?.id}`
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const decreaseQuantityResponse = await fetch(url, requestOptions);
        if(!decreaseQuantityResponse.ok){
            throw new Error("Something went wrong")!
        }
        // tutaj w zasadzie moglibsmy znowu uzyc useEffecta zeby wcyztac z bazy wszystkie filmy,
        // ale to by bylo duzo wszystkiego a tak w sumie bedzie prosicej hardcodowac ilosc -1 jak sie uda, a przy
        //odswiezeniu strony na nowo juz i tak pojdzie nam z bazy dobra ilosc
        setQuantity(quantity -1);
        setRemaining(remaining -1);
    }

    async function deleteBook(){
        const url = `${process.env.REACT_APP_API}/admin/secure/delete/movie/?movieId=${props.movie?.id}`
        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const decreaseQuantityResponse = await fetch(url, requestOptions);
        if(!decreaseQuantityResponse.ok){
            throw new Error("Something went wrong")!
        }
        props.deleteBook();

    }

    return(
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.movie.img ?
                            <img src={props.movie.img} width='123' height='196' alt='Movie' />
                            :
                            <img src={require('./../../../Images/MovieImage/movie1.jpg')}
                                 width='123' height='196' alt='Movie' />
                        }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center align-items-center'>
                        {props.movie.img ?
                            <img src={props.movie.img} width='123' height='196' alt='Movie' />
                            :
                            <img src={require('./../../../Images/MovieImage/movie1.jpg')}
                                 width='123' height='196' alt='Movie' />
                        }
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>{props.movie.director}</h5>
                        <h4>{props.movie.title}</h4>
                        <p className='card-text'> {props.movie.description} </p>
                    </div>
                </div>
                <div className='mt-3 col-md-4'>
                    <div className='d-flex justify-content-center align-items-center'>
                        <p>Ilość: <b>{quantity}</b></p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <p>Zostało: <b>{remaining}</b></p>
                    </div>
                </div>
                <div className='mt-3 col-md-1'>
                    <div className='d-flex justify-content-start'>
                        <button className='m-1 btn btn-md btn-danger' onClick={deleteBook}>
                            Usuń
                        </button>
                    </div>
                </div>
                <button className='m1 btn btn-md main-color text-white' onClick={increaseQuantity}>
                    Dodaj 1 egzemplarz
                </button>
                <button className='m1 btn btn-md btn-warning' onClick={decreaseQuantity}>
                    Usuń 1 egzemplarz
                </button>
            </div>
        </div>
    );

}