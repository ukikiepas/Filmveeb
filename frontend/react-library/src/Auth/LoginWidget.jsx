import React from "react";
import {useOktaAuth} from "@okta/okta-react";
import SpinnerLoading from "../layouts/utils/SpinnerLoading";
import {Redirect} from "react-router";
import OktaSignInWidget from "./OktaSignInWidget";

const LoginWidget = (config) => {

    const {oktaAuth, authState} = useOktaAuth();

    const onSuccess = (tokens) => {
        oktaAuth.handleLoginRedirect(tokens);
    };

    // mozna przemyslec potem lepsze errorowanie xD
    const onError = (err) => {
        console.log('Sign in error', err)
    }

    if(!authState){
        return(
            <SpinnerLoading/>
        )
    }

    return authState.isAuthenticated ?
        <Redirect to={ {pathname: '/'} } />
        :
        <OktaSignInWidget config={config} onsuccess={onSuccess} onError={onError}/>

}

export  default LoginWidget;