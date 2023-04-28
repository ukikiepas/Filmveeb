class HistoryModel{

    id:number;
    userEmail: string;
    checkoutDate: string;
    returnedDate: string;
    title: string;
    director: string;
    description: string;
    image: string;


    constructor(id: number, userEmail: string, checkoutDate: string, returnedDate: string, title: string, director: string, description: string, image: string) {
        this.id = id;
        this.userEmail = userEmail;
        this.checkoutDate = checkoutDate;
        this.returnedDate = returnedDate;
        this.title = title;
        this.director = director;
        this.description = description;
        this.image = image;
    }
}

export default HistoryModel;