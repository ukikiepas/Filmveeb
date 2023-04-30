import {useOktaAuth} from "@okta/okta-react";
import {useState} from "react";
import AddMovieRequest from "../../../models/AddMovieRequest";

export const AddNewMovie = () => {

    const {authState} = useOktaAuth();

    //rzeczy do nowego filmu
    const [title, setTitle] = useState('');
    const [director, setDirector] = useState('');
    const [description, setDescription] = useState('');
    const [copies, setCopies] = useState(0);
    const [category, setCategory] = useState('Gatunek');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    // Displays
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    function categoryField(value:string){
        setCategory(value);
    }

    //do przerabiania zdjecia na BASE64
    // co dostajemy i nas interesuje jest w target.files.[0]
    async function base64ConversionForImages(e:any){
        //console.log(e)
        if(e.target.files[0]){
            getBase64(e.target.files[0])
        }
    }

    function getBase64(file:any){
        let reader = new FileReader();
        //tutaj zamieniamy na base64
        reader.readAsDataURL(file);
        //tutaj zapisujemy do useStata
        reader.onload = function (){
            setSelectedImage(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error  ', error);
        }
    }


    async function submitNewMovie(){
        const url = `http://localhost:8080/api/admin/secure/add/book`;
        if(authState?.isAuthenticated && title !== '' && director !=='' && director!=='' && category!=='' && description !=='' && copies >=0 ){
            const movie: AddMovieRequest = new AddMovieRequest(title, director, description, copies, category, selectedImage);
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(movie)
            };

            const submitNewBookResponse = await fetch(url, requestOptions);
            if(!submitNewBookResponse){
                throw new Error('Something went wrong!!');
            }
            setTitle('')
            setDirector('')
            setDescription('')
            setCopies(0)
            setCategory('Kategoria')
            setSelectedImage(null)
            setDisplayWarning(false)
            setDisplaySuccess(true)
        }else {
            setDisplayWarning(true)
            setDisplaySuccess(false)
        }
    }

    return (
        <div className='container mt-5 mb-5'>
            {displaySuccess &&
                <div className='alert alert-success' role='alert'>
                    Film dodany poprawnie
                </div>
            }
            {displayWarning &&
                <div className='alert alert-danger' role='alert'>
                    Uzupełnij wszystkie pola !
                </div>
            }
            <div className='card'>
                <div className='card-header'>
                    Dodaj nowy film
                </div>
                <div className='card-body'>
                    <form method='POST'>
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Tytuł</label>
                                <input type="text" className='form-control' name='title' required
                                       onChange={e => setTitle(e.target.value)} value={title} />
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Reżyser </label>
                                <input type="text" className='form-control' name='director' required
                                       onChange={e => setDirector(e.target.value)} value={director}/>
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Kategoria</label>
                                <button className='form-control btn btn-secondary dropdown-toggle' type='button'
                                        id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                    {category}
                                </button>
                                <ul id='addNewBookId' className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li><a onClick={() => categoryField('Akcji')} className='dropdown-item'>Akcji</a></li>
                                    <li><a onClick={() => categoryField('Thriller')} className='dropdown-item'>Thriller</a></li>
                                    <li><a onClick={() => categoryField('Komedia')} className='dropdown-item'>Komedia</a></li>
                                    <li><a onClick={() => categoryField('Horror')} className='dropdown-item'>Horror</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-md-12 mb-3'>
                            <label className='form-label'>Opis</label>
                            <textarea className='form-control' id='exampleFormControlTextarea1' rows={3}
                                      onChange={e => setDescription(e.target.value)} value={description}></textarea>
                        </div>
                        <div className='col-md-3 mb-3'>
                            <label className='form-label'>Ilość</label>
                            <input type='number' className='form-control' name='Copies' required
                                   onChange={e => setCopies(Number(e.target.value))} value={copies}/>
                        </div>

                        {/*Tutaj wgrywanie zdjecia musimy jakby foto przerobić na BASE64*/}
                        <input type='file' onChange={e => base64ConversionForImages(e)} />
                        <div>
                            <button type='button' className='btn btn-primary mt-3' onClick={submitNewMovie}>
                                Dodaj Film
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}