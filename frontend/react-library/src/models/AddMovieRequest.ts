class AddMovieRequest{

    title: string;
    director: string;
    description: string;
    copies: number;
    category: string;
    img?: string;


    constructor(title: string, director: string, description: string, copies: number, category: string, img: string) {
        this.title = title;
        this.director = director;
        this.description = description;
        this.copies = copies;
        this.category = category;
        this.img = img;
    }
}

export default AddMovieRequest;