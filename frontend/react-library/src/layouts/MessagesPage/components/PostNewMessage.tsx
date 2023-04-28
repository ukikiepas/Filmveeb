import {useOktaAuth} from "@okta/okta-react";
import {useState} from "react";
import MessageModel from "../../../models/MessageModel";

export const PostNewMessage = () => {

    const {authState} = useOktaAuth();

    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);


    async function submitNewQuestion() {

        const url = `http://localhost:8080/api/messages/secure/add/message`;
        if(authState?.isAuthenticated && title !== '' && question !== ''){
            const messageRequestModel: MessageModel = new MessageModel(title, question);
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageRequestModel)
            };

            const submitNewQuestionResponse = await fetch(url, requestOptions);
            if(!submitNewQuestionResponse.ok){
                throw new Error("Something went wrong!")
            }

            setTitle('')
            setQuestion('')
            setDisplaySuccess(true)
            setDisplayWarning(false)
        } else {
            setDisplayWarning(true)
            setDisplaySuccess(false)
        }
    }







    return (
        <div className='card mt-3'>

            <div className='card-header'>
                Zadaj pytanie naszym moderatorom
            </div>
            <div className='card-body'>
                <form method='POST'>
                    {displayWarning &&
                        <div className='alert alert-danger' role='alert'>
                            Musisz uzupełnić wszystkie pola !
                        </div>
                    }

                    {displaySuccess &&
                        <div className='alert alert-success' role='alert'>
                            Pytanie wysłane
                        </div>
                    }

                    <div className='mb-3'>
                        <label className='form-label'>
                            Tytuł
                        </label>
                        <input type='text' className='form-control' id='exampleFormControlInput1'
                               placeholder='Tytuł' onChange={e => setTitle(e.target.value)} value={title} />
                    </div>

                    <div className='mb-3'>
                        <label className='form-label'>
                            Pytanie
                        </label>
                        <textarea className='form-control' id='exampleFormControlTextarea1'
                                  rows={3} onChange={e => setQuestion(e.target.value)} value={question}>
                        </textarea>
                    </div>
                    <div>
                        <button type='button' className='btn btn-primary mt-3' onClick={submitNewQuestion}>
                            Wyślij
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}