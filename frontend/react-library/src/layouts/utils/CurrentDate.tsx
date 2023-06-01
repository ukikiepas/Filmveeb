import React from "react";


const currentDate = () => {

    var showdate = new Date();
    var displaytodaysdate = showdate.getDate()+'/'+showdate.getMonth()+'/'+showdate.getFullYear();
    return(
        <span className='text-primary '>{displaytodaysdate}</span>
    )
}

export default currentDate;