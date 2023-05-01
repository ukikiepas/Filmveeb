import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";
import {LeaveAReview} from "../../utils/LeaveAReview";

export const isRevieved: React.FC<{ checkIfRevieved:any, movieId:number }> = (props) => {

    function reviewRender(){
        if(props.checkIfRevieved(props.movieId)){
            return(
                <p>
                    lsakdlsadsa
                </p>
            )
        }else {
            return (<div>
                srakkkaa
            </div>)
        }
    }


    return(
        <div>
            {reviewRender()}
        </div>
    )

    }

    export default isRevieved;