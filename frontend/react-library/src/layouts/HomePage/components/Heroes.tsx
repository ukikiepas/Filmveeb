import {useOktaAuth} from "@okta/okta-react";
import {Link} from "react-router-dom";
import React from "react";

export default function Heroes(){

    // ta zmienna wykorzystawana jest do sprawdzenia czy user juz jest zalogowany czy nie :)
    const {authState} = useOktaAuth();


    return(
        <div>
            <div className='d-none d-lg-block'>
                <div className='row g-0 mt-5'>
                    <div className='col-sm-6 col-md-6'>
                        <div className='col-image-left'></div>
                    </div>
                    <div className='col-4 col-md-4 container d-flex justify-content-center align-items-center'>
                        <div className='ml-2'>
                            <h1>Co oglądałeś ostatnio?</h1>
                            <p className='lead'>
                                Nasz zespół chciałby wiedzieć co ostatnio oglądałeś - daj nam znać recenzując film na naszej stronie!
                                Jeśli szukasz dobrego filmu, zerknij w nasze <strong> <span className='text-primary'>najlepsze filmy</span> </strong>
                                 a na pewno znajdziesz coś dla siebie.
                            </p>
                            {/*Jesli zalogowany to jedna rzecz, a jak nie to druga :>*/}
                            {authState?.isAuthenticated ?
                                <Link type='button' className='btn main-color btn-lg text-white'
                                    to='/search'>Najlepsze filmy</Link>
                                :
                                <Link className='btn main-color btn-lg text-white' to='/login'>Zaloguj się</Link>
                            }

                        </div>
                    </div>
                </div>
                <div className='row g-0'>
                    <div className='col-4 col-md-4 container d-flex
                        justify-content-center align-items-center'>
                        <div className='ml-2'>
                            <h1>Stale się rozwijamy!</h1>
                            <p className='lead'>
                                Sprawdzaj naszą stronę codziennie, ponieważ codzień pojawiają się nowe pozycje!
                                Pracujemy ciągle aby dostarczyć najwyższą jakość świadczonych usług.
                                Starannie przeglądamy Wasze wpisy oraz staramy się, aby nasza społeczność była
                                jak najbardziej przyjazna i otwarta.
                            </p>

                        </div>
                    </div>
                    <div className='col-sm-6 col-md-6'>
                        <div className='col-image-right'></div>
                    </div>
                </div>
            </div>

            {/* Mobile Heros */}
            <div className='d-lg-none'>
                <div className='container'>
                    <div className='m-2'>
                        <div className='col-image-left'></div>
                        <div className='mt-2'>
                            <h1>Co oglądałeś ostatnio?</h1>
                            <p className='lead'>
                                The library team would love to know what you have been reading.
                                Whether it is to learn a new skill or grow within one,
                                we will be able to provide the top content for you!
                                Nasz zespół chciałby wiedzieć co ostatno oglądałeś.Daj nam znać.
                                Jeśli szukasz dobrego filmu, zerknij w nasze Top Filmy
                            </p>
                            {authState?.isAuthenticated ?
                                <Link type='button' className='btn main-color btn-lg text-white'
                                      to='/search'>Najlepsze filmy</Link>
                                :
                                <Link className='btn main-color btn-lg text-white' to='/login'>Zaloguj się</Link>
                            }
                        </div>
                    </div>
                    <div className='m-2'>
                        <div className='col-image-right'></div>
                        <div className='mt-2'>
                            <h1>Stale się rozwijamy!</h1>
                            <p className='lead'>
                                Sprawdzaj naszą stronę codziennie, ponieważ codzień pojawiają się nowe pozycje!
                                Pracujemy ciągle aby dostarczyć najwyższą jakość świadczonych usług.
                                Starannie przeglądamy Wasze wpisy oraz staramy się, aby nasza społeczność była
                                jak najbardziej przyjazna i otwarta.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}