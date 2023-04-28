
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css'
import {useEffect, useRef} from "react";
import {oktaConfig} from "../lib/oktaConfig";
import OktaSignIn from "@okta/okta-signin-widget";


const OktaSignInWidget = ({onsuccess, onError}) =>{

    const widgetRef = useRef();

    useEffect( () => {
        if(!widgetRef.current){
            return false;
        }

        const widget = new OktaSignIn(oktaConfig);

        widget.showSignInToGetTokens({
            el: widgetRef.current,
        }).then(onsuccess).catch(onError)

        return () => widget.remove();
    }, [onsuccess, onError])


    return(
        <div>
            <div ref={widgetRef}></div>
        </div>
    )
}

export default OktaSignInWidget;
