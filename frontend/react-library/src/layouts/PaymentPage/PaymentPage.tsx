import {useOktaAuth} from "@okta/okta-react";
import {useEffect, useState} from "react";
import SpinnerLoading from "../utils/SpinnerLoading";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {Link} from "react-router-dom";
import PaymentInfoRequest from "../../models/PaymentInfoRequest";


export const PaymentPage = () => {

    const {authState} = useOktaAuth();
    const [httpError, setHttpError] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fees,setFees] = useState(0);
    const [loadingFees, setLoadingFees] = useState(true);

    //do popupu
    const [paymentSuccess, setPaymentSuccess] = useState(false);



    useEffect( () => {

        const fetchFees = async () => {
            if(authState && authState.isAuthenticated){
                const url = `${process.env.REACT_APP_API}/payments/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}`
                const requestOptions = {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                };
                const paymentResponse = await fetch(url, requestOptions);

                if(paymentResponse.ok){
                    const paymentResponseJson = await paymentResponse.json();
                    setFees(paymentResponseJson.amount);
                    setLoadingFees(false);
                }else if(paymentResponse.status === 404){
                    setFees(0);
                    setLoadingFees(false);
                }else {
                    throw new Error('Something went wrong!!!!');
                }


            }
        }
        fetchFees().catch((error:any) => {
            setLoadingFees(false);
            setHttpError(error.message);
        })

    }, [authState]);


    const elements = useElements();
    const stripe = useStripe();

    async function checkout(){
        if(!stripe || !elements || !elements.getElement(CardElement)){
            return;
        }

        setSubmitDisabled(true);

        let paymentInfo = new PaymentInfoRequest(Math.round(fees*100), 'USD', authState?.accessToken?.claims.sub);

        const url = `${process.env.REACT_APP_API}/payment/secure/payment-intent`;
        const requestOptions = {
            method: 'POST',
            headers:{
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentInfo)
        };

        const stripeResponse = await fetch(url, requestOptions);
        if(!stripeResponse.ok){
            setHttpError(true);
            setSubmitDisabled(false);
            throw new Error('Something went wrong');
        }
        const stripeResponseJson = await stripeResponse.json();

         stripe.confirmCardPayment(
            stripeResponseJson.client_secret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        email: authState?.accessToken?.claims.sub
                    }
                }
            }, {handleActions:false}
        ).then(async function (result: any){
            if(result.error){
                setSubmitDisabled(false);
                alert('There was an error!')
            }else {
                setPaymentSuccess(true);
                const url = `https://localhost:8443/api/payment/secure/payment-complete`;
                const requestOptions = {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const stripeResponse = await fetch(url, requestOptions);
                if(!stripeResponse.ok){
                    setHttpError(true);
                    setSubmitDisabled(false);
                    throw new Error("Something went wrong");
                }
                setFees(0);
                setSubmitDisabled(false);
            }
         });
         setHttpError(false);


    }



    if(loadingFees){
        return (
            <SpinnerLoading/>
        )
    }

    if(httpError){
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    return(

        <div className='container'>
            {paymentSuccess &&
                <div className='alert alert-success mt-3' role='alert'>
                    Opłacenie zakończone pomyślnie!
                </div>
            }
            {fees > 0 && <div className='card mt-3'>
                <h5 className='card-header'>Do opłacenia: <span className='text-danger'>${fees}</span></h5>
                <div className='card-body'>
                    <h5 className='card-title mb-3'>Karta kredytowa</h5>
                    <CardElement id='card-element'/>
                    <button disabled={submitDisabled} type='button' className='btn btn-md main-color text-white mt-3'
                            onClick={checkout}>
                        Zapłać
                    </button>
                </div>
            </div>}

            {fees == 0 && <div className='mt-3'>
                <h5>Nie masz żadnych zaległości do opłacenia</h5>
                <Link type='button' className='btn main-color text-white' to='search'>
                    Zobacz najlepsze filmy
                </Link>
            </div>
            }



            {submitDisabled && <SpinnerLoading/>}

        </div>

    );

}