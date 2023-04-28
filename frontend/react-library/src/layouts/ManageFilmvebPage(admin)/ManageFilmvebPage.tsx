import { useOktaAuth } from '@okta/okta-react';
import { useState } from 'react';
import {Redirect} from "react-router";
import {AdminMessages} from "./components/AdminMessages";

export const ManageFilmvebPage = () => {

    const { authState } = useOktaAuth();

    const [changeQuantityOfMoviesClick, setChangeQuantityOfMoviesClick] = useState(false);
    const [messagesClick, setMessagesClick] = useState(false);

    function addMovieClickFunction(){
        setChangeQuantityOfMoviesClick(false);
        setMessagesClick(false);
    }

    function changeQuantityOfMoviesClickFunction(){
        setChangeQuantityOfMoviesClick(true);
        setMessagesClick(false);
    }

    function messagesClickFunction(){
        setChangeQuantityOfMoviesClick(false);
        setMessagesClick(true);
    }

    // tutaj sprawdzamy, ze jesli uzytkownik nie ma typu admin to go przekierujemy do strony glownej (nie ma tu dostepu) :)) ))) ))
    if(authState?.accessToken?.claims.userType === undefined){
        return <Redirect to='/home'/>
    }

    return (
        <div className='container'>
            <div className='mt-5'>
                <h3>Panel Admina</h3>
                <nav>
                    <div className='nav nav-tabs' id='nav-tab' role='tablist'>
                        <button className='nav-link active' id='nav-add-book-tab' data-bs-toggle='tab'
                                data-bs-target='#nav-add-book' type='button' role='tab' aria-controls='nav-add-book'
                                aria-selected='false'
                                onClick={addMovieClickFunction}
                        >
                            Dodaj film
                        </button>
                        <button className='nav-link' id='nav-quantity-tab' data-bs-toggle='tab'
                                data-bs-target='#nav-quantity' type='button' role='tab' aria-controls='nav-quantity'
                                aria-selected='true'
                                onClick={changeQuantityOfMoviesClickFunction}
                        >
                            Zmień ilość
                        </button>
                        <button className='nav-link' id='nav-messages-tab' data-bs-toggle='tab'
                                data-bs-target='#nav-messages' type='button' role='tab' aria-controls='nav-messages'
                                aria-selected='false'
                                onClick={messagesClickFunction}
                        >
                            Wiadomości
                        </button>
                    </div>
                </nav>
                <div className='tab-content' id='nav-tabContent'>
                    <div className='tab-pane fade show active' id='nav-add-book' role='tabpanel'
                         aria-labelledby='nav-add-book-tab'>
                        Niedługo bedzie smigac :))
                    </div>
                    <div className='tab-pane fade' id='nav-quantity' role='tabpanel' aria-labelledby='nav-quantity-tab'>
                        {changeQuantityOfMoviesClick ? <></> : <>Change Quantity</>}
                    </div>
                    <div className='tab-pane fade' id='nav-messages' role='tabpanel' aria-labelledby='nav-messages-tab'>
                        {messagesClick ? <AdminMessages/> : <></> }
                    </div>
                </div>
            </div>
        </div>
    );
}