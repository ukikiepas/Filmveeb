import {Link, NavLink} from "react-router-dom";

export default function Footer(){
    return (
        <div className='main-color'>
            <footer className='container d-flex flex-wrap
                justify-content-between align-items-center py-5 main-color'>
                <p className='col-md-4 mb-0 text-white'>© ukanio</p>
                <ul className='nav navbar-dark col-md-4 justify-content-end'>
                    <li className='nav-item'>
                        <Link className='nav-link px-2 text-white' to='/home'> Strona główna </Link>
                    </li>
                    <li className='nav-item'>
                        <Link className='nav-link px-2 text-white' to='/search'> Znajdź film </Link>
                    </li>
                </ul>
            </footer>
        </div>
    );
}