import { Link } from "react-router-dom";
import MovieModel from "../../models/MovieModel";
import {LeaveAReview} from "../utils/LeaveAReview";

export const CheckoutAndReviewBox: React.FC<{ movie: MovieModel | undefined, mobile: boolean,
        currentLoansCount: number, isAuthenticated: any, isCheckedOut: boolean
        checkoutMovie: any, isReviewLeft: boolean, submitReview: any, updateReview:any, reviewLeftStars:number}> = (props) => {

    // logika do tego jaki wysweitlic baton w naszym boxie
    // w zaleznosci od czy zalogowany / czy moze wypozyczc film / czy juz ja wypozyczyl
    function buttonRender(){
        if(props.isAuthenticated.isAuthenticated){
            if(!props.isCheckedOut && props.currentLoansCount < 5) {
                return(<button onClick={() => props.checkoutMovie()} className='btn btn-success btn-lg'>Wypożycz</button>)
            }else if(props.isCheckedOut) {
                return (<div><p><b>Film wypożyczony</b></p>
                    <p><b>Miłego oglądania !</b></p></div>)
            }else if(!props.isCheckedOut) {
                return (<p className='text-danger'>Zbyt wiele wypożyczonych filmów</p>)
            }
        }else {
            return (<Link to={'/login'} className='btn btn-success btn-lg'>Zaloguj sie</Link>)
        }
    }

    function reviewRender(){
        if(props.isAuthenticated.isAuthenticated && !props.isReviewLeft){
            return(
                <div>
                <LeaveAReview submitReview={props.submitReview} isRevieved={false}  updateReview={props.updateReview} reviewLeftStars={props.reviewLeftStars}/>
                </div>
            )
        }else if(props.isAuthenticated.isAuthenticated && props.isReviewLeft){
            return (
                <div>
                <LeaveAReview submitReview={props.submitReview} isRevieved={true} updateReview={props.updateReview} reviewLeftStars={props.reviewLeftStars}/>
                </div>
            )
        }else {
            return (
                <div>

                </div>)
        }
    }

    return (
        <div className={props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'}>
            <div className='card-body container'>
                <div className='mt-3'>
                    <p>
                        <b>{props.currentLoansCount} /5 </b>
                        filmów wypożyczonych
                    </p>
                    <hr />
                    {props.movie && props.movie.copiesAvailable && props.movie.copiesAvailable > 0 ?
                        <h4 className='text-success'>
                            Dostępne
                        </h4>
                        :
                        <h4 className='text-danger'>
                            Lista oczekujących
                        </h4>
                    }
                    <div className='row'>
                        <p className='col-6 lead'>
                            <b>{props.movie?.copies} </b>
                            sztuk
                        </p>
                        <p className='col-6 lead'>
                            <b>{props.movie?.copiesAvailable} </b>
                            dostępnych
                        </p>
                    </div>
                </div>
                {buttonRender()}
                <hr />
                {
                    props.isAuthenticated.isAuthenticated ?
                    <p className='mt-3'>
                        Liczba filmów może się zmienić do momentu złożenia zamówienia
                    </p>
                        :
                        <p className='mt-3 text-danger'>
                            <strong>Zaloguj się aby napisać opinię </strong>
                        </p>
                }

                {reviewRender()}
            </div>
        </div>
    );
}