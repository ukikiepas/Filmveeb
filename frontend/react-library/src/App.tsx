import React from 'react';
import './App.css';
import {Navbar} from "./layouts/NavbarAndFooter/Navbar";
import Footer from "./layouts/NavbarAndFooter/Footer";
import HomePage from "./layouts/HomePage/HomePage";
import SearchMoviesPage from "./layouts/SearchMoviesPage/SearchMoviesPage";
import {Redirect, Route, Switch, useHistory} from "react-router";
import MovieCheckoutPage from "./layouts/MovieCheckoutPage/MovieCheckoutPage";
import {OktaAuth, toRelativeUrl} from "@okta/okta-auth-js";
import {oktaConfig} from "./lib/oktaConfig";
import {LoginCallback, SecureRoute, Security} from "@okta/okta-react";
import LoginWidget from "./Auth/LoginWidget";
import {ReviewListPage} from "./layouts/MovieCheckoutPage/ReviewListPage/ReviewListPage";
import {ShelfPage} from "./layouts/ShelfPage/ShelfPage";
import {MessagesPage} from "./layouts/MessagesPage/MessagesPage";
import {ManageFilmvebPage} from "./layouts/ManageFilmvebPage(admin)/ManageFilmvebPage";
import {PaymentPage} from "./layouts/PaymentPage/PaymentPage";


const oktaAuth = new OktaAuth(oktaConfig);
function App() {

    const customAuthHandler = () => {
        history.push('/login');
    }

    const history = useHistory();

    const restoreOriginUri = async (_oktaAuth: any, originalUri: any) => {
        history.replace(toRelativeUrl(originalUri || '/', window.location.origin))
    }

  return (
    <div className='d-flex flex-column min-vh-100'>
        <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginUri} onAuthRequired={customAuthHandler}>
        <Navbar/>

        <div className='flex-grow-1'>
            <Switch>

                <Route path='/' exact>
                    <Redirect to='/home'/>
                </Route>

                <Route path='/home'>
                    <HomePage/>
                </Route>

                <Route path='/search'>
                    <SearchMoviesPage/>
                </Route>

                <Route path='/reviewlist/:bookId'>
                    <ReviewListPage/>
                </Route>

                <Route path='/checkout/:bookId'>
                    <MovieCheckoutPage/>
                </Route>


                <SecureRoute path='/shelf'>
                    <ShelfPage/>
                </SecureRoute>

                <SecureRoute path='/messages'>
                    <MessagesPage/>
                </SecureRoute>

                <SecureRoute path='/admin'>
                    <ManageFilmvebPage/>
                </SecureRoute>

                <SecureRoute path='/fees'>
                    <PaymentPage/>
                </SecureRoute>

                <Route path='/login' render={
                    () => <LoginWidget config={oktaConfig} />
                }/>

                <Route path='/login/callback' component={LoginCallback}/>



            </Switch>
        </div>

        <Footer/>
        </Security>
    </div>
  );
}

export default App;
