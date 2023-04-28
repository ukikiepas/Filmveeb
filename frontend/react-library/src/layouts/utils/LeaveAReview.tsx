import { useState } from 'react';
import { StarsReview } from './StarsReview';

export const LeaveAReview: React.FC<{submitReview: any}> = (props) => {

    //do gwiazdek
    const [starInput, setStarInput] = useState(0);
    // do tekstu
    const [displayInput, setDisplayInput] = useState(false);
    const [reviewDescription, setReviewDescription] = useState('');



    function starValue(value: number) {
        setStarInput(value);
        setDisplayInput(true);
    }



    return (
        <div className='dropdown' style={{ cursor: 'pointer' }}>
            <h5 className='dropdown-toggle' id='dropdownMenuButton1' data-bs-toggle='dropdown'>
                Zostaw recenzje
            </h5>
            <ul id='submitReviewRating' className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                <li><button onClick={() => starValue(0)} className='dropdown-item'>0 </button></li>
                <li><button onClick={() => starValue(.5)} className='dropdown-item'>.5 </button></li>
                <li><button onClick={() => starValue(1)} className='dropdown-item'>1 </button></li>
                <li><button onClick={() => starValue(1.5)} className='dropdown-item'>1.5 </button></li>
                <li><button onClick={() => starValue(2)} className='dropdown-item'>2 </button></li>
                <li><button onClick={() => starValue(2.5)} className='dropdown-item'>2.5 </button></li>
                <li><button onClick={() => starValue(3)} className='dropdown-item'>3 </button></li>
                <li><button onClick={() => starValue(3.5)} className='dropdown-item'>3.5 </button></li>
                <li><button onClick={() => starValue(4)} className='dropdown-item'>4 </button></li>
                <li><button onClick={() => starValue(4.5)} className='dropdown-item'>4.5 </button></li>
                <li><button onClick={() => starValue(5)} className='dropdown-item'>5 </button></li>
            </ul>
            <StarsReview rating={starInput} size={32}/>

            {displayInput &&
                <form onSubmit={(event) => {
                    event.preventDefault();
                    props.submitReview(starInput, reviewDescription)
                }}>
                    <hr/>

                    <div className='mb-3'>
                        <label className='form-label'>
                            Opis
                        </label>
                        <textarea className='form-control' id='submitReviewDescription' placeholder='Opcjonalne'
                                  rows={3} onChange={e=> setReviewDescription(e.target.value)}>
            </textarea>
                    </div>

                    <div>
                        <button title='button' type="submit" className='btn btn-primary mt-3'>Wyślij</button>
                    </div>

                </form>
            }









        </div>
    );
}