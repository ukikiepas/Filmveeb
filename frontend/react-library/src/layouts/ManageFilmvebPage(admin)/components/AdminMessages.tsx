import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import MessageModel from '../../../models/MessageModel';
import SpinnerLoading from "../../utils/SpinnerLoading";
import {Pagination} from "../../utils/Pagination";
import {AdminMessage} from "./AdminMessage";
import AdminMessageRequest from "../../../models/AdminMessageRequest";


export const AdminMessages = () => {

    const { authState } = useOktaAuth();

    // To co zawsze
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // staty dla wiadomosci do admina
    const [messages, setMessages] = useState<MessageModel[]>([]);

    // Pagination
    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    //Zeby na nowo uzyc useEffecta
    const [buttonSubmit, setButtonSubmit] = useState(false);

    useEffect(() => {

        const fetchUserMessages = async () => {

            if(authState && authState?.isAuthenticated){
                const url = `${process.env.REACT_APP_API}/messages/search/findByClosed/?closed=false&page=${currentPage -1}$size=${messagesPerPage}`
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const messageResponse = await fetch(url, requestOptions);
                if(!messageResponse.ok){
                    throw new Error("Something went wron! :)")
                }
                const messagesResponseJson = await messageResponse.json();
                console.log(messagesResponseJson)

                setMessages(messagesResponseJson._embedded.messages);
                setTotalPages(messagesResponseJson.page.totalPages);
            }
            setIsLoadingMessages(false);

        }
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        })
        window.scrollTo(0,0);
    }, [authState, currentPage, buttonSubmit])

    if (isLoadingMessages) {
        return (
            <SpinnerLoading/>
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    // te funkcje przez propsy do AdminMessage
    async function submitResponseToQuestion(id: number, response: string){

        if(authState && authState?.isAuthenticated && id!= null && response!='') {
            const messageAdminRequestModel: AdminMessageRequest = new AdminMessageRequest(id, response);
            const url = `${process.env.REACT_APP_API}/messages/secure/admin/message`;
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageAdminRequestModel)
            };

            const messageAdminRequestModelResponse = await fetch(url, requestOptions);
            if(!messageAdminRequestModelResponse.ok){
                throw new Error("Something went wrong");
            }
            // zmieniamy stan zeby odswiezyc useEffecta ktory nam wczytuje pytanka do odp
            setButtonSubmit(!buttonSubmit)
        }

    }


    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className='mt-3'>
            {messages.length > 0 ?
                <>
                    <h5>Pozostałe pytania:  </h5>
                    {messages.map(message => (
                        <AdminMessage message={message} key={message.id} submitResponseToQuestion={submitResponseToQuestion}/>
                    ))}
                </>
                :
                <h5>Nie ma żadnych pytań</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}