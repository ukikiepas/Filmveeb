import {Link, NavLink} from "react-router-dom";
import {useOktaAuth} from "@okta/okta-react";
import SpinnerLoading from "../utils/SpinnerLoading";
import {Redirect} from "react-router";
import {useEffect, useState} from "react";

export const Navbar = () => {

    const {oktaAuth, authState} = useOktaAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    const handleLogout = async () => oktaAuth.signOut()

    console.log(authState);

    useEffect ( () => {
        if(authState?.accessToken?.claims.userType === 'admin') {
            setIsAdmin(true);
        }else {
            setIsAdmin(false);
        }
    }, [authState])

    if(!authState){
        return <SpinnerLoading/>
    }

    return (
        <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
            <div className='container-fluid'>
                <span className='navbar-brand'>Filmveb

            {/*    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"*/}
            {/*         className="bi bi-film m-2" viewBox="0 0 16 16">*/}
            {/*<       path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z"/>*/}
            {/*    </svg>*/}
                </span>
                <button className='navbar-toggler' type='button'
                        data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'
                        aria-controls='navbarNavDropdown' aria-expanded='false'
                        aria-label='Toggle Navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarNavDropdown'>
                    <ul className='navbar-nav'>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/home'> Strona główna </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/search'> Znajdź film </NavLink>
                        </li>
                        {authState.isAuthenticated &&

                            <li className='nav-item'>
                                <NavLink className='nav-link' to='/shelf'>Twoja półka</NavLink>
                            </li>

                        }

                        {authState.isAuthenticated && !isAdmin &&

                            <li className='nav-item'>
                                <NavLink className='nav-link' to='/messages'>Pytania</NavLink>
                            </li>

                        }

                    </ul>
                    <ul className='navbar-nav ms-auto'>
                        {/*Jesli nie jest zalogowany to chcemy pokazac sign in
                        a jak jest to logouta wpierdalamy */}

                        {isAdmin &&
                            <li className='nav-item me-2'>
                                <NavLink className='nav-link' to='/admin'>Panel admina</NavLink>
                            </li>
                        }


                        <li className='nav-item me-3'>
                            <NavLink className='nav-link' to='/account'>Konto</NavLink>
                        </li>

                        {!authState.isAuthenticated ?
                            <li className='nav-item m-1'>
                                <Link type='button' className='btn btn-outline-light' to='/login'>
                                    Zaloguj się
                                </Link>
                            </li>:
                            <li>
                                <button className='btn btn-outline-light' onClick={handleLogout}>Wyloguj się</button>
                            </li>
                        }

                    </ul>
                </div>
            </div>
        </nav>
    );
}