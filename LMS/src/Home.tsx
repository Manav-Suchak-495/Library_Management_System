import { Box, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import Header from "./Header";
import AddBookDialog from "./AddBookDialog";
import axios from "axios";
import HomeCardLayout from "./HomeCardLayout";
import BookDetailsDialog from "./BookDetailsDialog";

interface BookDataInterface {
    book_isbn: string;
    book_title: string;
    book_author: string;
    book_publisher: string;
    book_category: string;
    copy_count: number;
    issued_count: number;
    book_description: string;
    book_status: string;
}

function Home() {
    const [isAndroid, setIsAndroid] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState(false)
    const [email, setEmail] = useState('')
    const [addBookDialogOpen, setAddBookDialogOpen] = useState<boolean>(false);
    const [isBookDetailsOpen, setIsBookDetailsOpen] = useState<boolean>(false);
    const [books, setBooks] = useState<BookDataInterface[]>([])
    const [bookDetails, setBookDetails] = useState<BookDataInterface>({
        book_isbn: '',
    book_title: '',
    book_author: '',
    book_publisher: '',
    book_category: '',
    copy_count: 0,
    issued_count: 0,
    book_description: '',
    book_status: ''
    })
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchBooks = ({queryFilter}: {queryFilter: string}) =>{
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        axios.post(`${apiUrl}/books/fetch`,{queryFilter}).then((response) =>{
            if(response.data && response.data.length > 0){
                    setBooks(response.data)
                    console.log(books)
            }
        }).catch((err) =>{
            console.error("Error fetching books:", err);
            setError(true);
        }).finally(()=>{
            setLoading(false);
        })
    }
    const fetchBookDetails = ({queryFilter}: {queryFilter: string}) =>{
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        axios.post(`${apiUrl}/books/fetch`,{queryFilter}).then((response) =>{
            if(response.data && response.data.length > 0){
                    setBookDetails(response.data[0])
            }
        }).catch((err) =>{
            console.error("Error fetching books:", err);
            setError(true);
        }).finally(()=>{
            setLoading(false);
        })
    }
    
    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor;
        if (/android|iphone|ipad|ipod/i.test(userAgent)) {
            setIsAndroid(true);
        }
    }, []);
    
    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        axios.post(`${apiUrl}/isAdmin`,{Token: sessionStorage.getItem("Token")}).then((response) =>{
            setIsAdmin(response.data.isAdmin)
            setEmail(response.data.user_email)
        })
        .catch(() => {
            setIsAdmin(false)
        })
        fetchBooks({queryFilter: ''})
    },[])
    
    
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress/>
            </Box>
        );
    }
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            height: '100%',
            minHeight: '100dvh',
            width: '100%',
            pb: { xs: 0, sm: 0, md: 4, lg: 4 },
            boxSizing: 'border-box',
            backgroundColor: '#FAFAFA',
            border: 0,
            outline: 'none',
        }}>
            <Header handleAddDialog = {() => setAddBookDialogOpen(true)} fetchData={fetchBooks}/>
            { books && (<HomeCardLayout bookData = {books} email={email} fetchData={fetchBookDetails} setIsBookDetailsOpen={setIsBookDetailsOpen}/>)}
            { error && (<Box sx={{height: '100%', width: '100%', display: 'flex', textAlign: "center", justifyItems: "center", fontSize: '2rem'}}>No Item Found</Box>)}
            { addBookDialogOpen && (<AddBookDialog open = {addBookDialogOpen} onClose = {() => {setAddBookDialogOpen(false); fetchBooks({queryFilter: ''})}} user_email={email} /> )}
            {isBookDetailsOpen &&(<BookDetailsDialog open = {isBookDetailsOpen} onClose={()=> {setIsBookDetailsOpen(false)}} bookDetails={bookDetails} user_email={email} isAdmin={isAdmin}/>)}
        </Box>
    );
}export default Home;
