import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";


// wyskakujacy modalny (nie mozna go jakby zamknac klikajac gdzies obok) popup
export const LoansModal: React.FC<{ shelfCurrentLoan: ShelfCurrentLoans, mobile: boolean,
    returnMovie:any, renewLoan: any }> = (props) => {
    return (
        <div className='modal fade' id={props.mobile ? `mobilemodal${props.shelfCurrentLoan.movie.id}` :
            `modal${props.shelfCurrentLoan.movie.id}`} data-bs-backdrop='static' data-bs-keyboard='false'
             aria-labelledby='staticBackdropLabel' aria-hidden='true' key={props.shelfCurrentLoan.movie.id}>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h5 className='modal-title' id='staticBackdropLabel'>
                            Opcje wypożyczenia
                        </h5>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'>
                        </button>
                    </div>
                    <div className='modal-body'>
                        <div className='container'>
                            <div className='mt-3'>
                                <div className='row'>
                                    <div className='col-2'>
                                        {props.shelfCurrentLoan.movie?.img ?
                                            <img src={props.shelfCurrentLoan.movie?.img}
                                                 width='56' height='87' alt='Movie'/>
                                            :
                                            <img src={require('../../../Images/MovieImage/movie1.jpg')}
                                                 width='56' height='87' alt='Movie'/>
                                        }
                                    </div>
                                    <div className='col-10'>
                                        <h6>{props.shelfCurrentLoan.movie.director}</h6>
                                        <h4>{props.shelfCurrentLoan.movie.title}</h4>
                                    </div>
                                </div>
                                <hr/>
                                {props.shelfCurrentLoan.daysLeft > 0 &&
                                    <p className='text-secondary'>
                                        Zostało {props.shelfCurrentLoan.daysLeft} dni.
                                    </p>
                                }
                                {props.shelfCurrentLoan.daysLeft === 0 &&
                                    <p className='text-success'>
                                        Do dziś.
                                    </p>
                                }
                                {props.shelfCurrentLoan.daysLeft < 0 &&
                                    <p className='text-danger'>
                                        Czas przekroczony o {props.shelfCurrentLoan.daysLeft} dni.
                                    </p>
                                }
                                <div className='list-group mt-3'>
                                    <button onClick={() => props.returnMovie(props.shelfCurrentLoan.movie.id)} data-bs-dismiss='modal' className='list-group-item list-group-item-action'
                                            aria-current='true'>
                                        Zwróć film.
                                    </button>
                                    <button
                                        onClick={
                                        props.shelfCurrentLoan.daysLeft < 0 ?
                                            (event) => event.preventDefault()
                                                :
                                            () => props.renewLoan(props.shelfCurrentLoan.movie.id)
                                        }
                                        data-bs-dismiss='modal'
                                            className={
                                                props.shelfCurrentLoan.daysLeft < 0 ?
                                                    'list-group-item list-group-item-action inactiveLink' :
                                                    'list-group-item list-group-item-action'
                                            }>
                                        {props.shelfCurrentLoan.daysLeft < 0 ?
                                            'Nie można odnowić filmów po terminie zwrotu' : 'Odnów wypożyczenie na 7 dni'
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                            Zamknij
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}