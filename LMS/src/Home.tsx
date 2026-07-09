import { Box, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import Header from "./Header";
import AddBookDialog from "./AddBookDialog";
import axios from "axios";
import HomeCardLayout from "./HomeCardLayout";
import BookDetailsDialog from "./BookDetailsDialog";
import LoadingOverlay from "./LoadingOverlay";

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
    const [booksDisplayed, setBooksDisplayed] = useState<BookDataInterface[]>([])
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

    const fetchBooks = () =>{
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        axios.get(`${apiUrl}/books/fetch`).then((response) =>{
            if(response.data && response.data.length > 0){
                    setBooks(response.data)
                    setBooksDisplayed(response.data)
                    console.log(books)
            }
        }).catch((err) =>{
            console.error("Error fetching books:", err);
            setError(true);
        }).finally(()=>{
            setLoading(false);
        })
    }

    const filterBooks = ({ searchValue, bookDetails }: { searchValue: string, bookDetails: boolean}) => {
        const cleanTerm = searchValue.toLowerCase().trim()
        if (cleanTerm === "") {
            setBooksDisplayed(books)
        } else {
            if(bookDetails){
                setBookDetails( books.filter(book => book.book_isbn.includes(cleanTerm))[0])
            }
            else{
                setBooksDisplayed( books.filter(book => book.book_title.toLowerCase().includes(cleanTerm) || book.book_author.toLowerCase().includes(cleanTerm) || book.book_isbn.includes(cleanTerm) || book.book_category.toLowerCase().includes(cleanTerm)))
            }
        }
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
        fetchBooks()
    },[])
    
    
    return (
        <Box sx={{
            position: 'relative',
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            pb: { xs: 0, sm: 0, md: 4, lg: 4 },
            boxSizing: 'border-box',
            backgroundColor: '#FAFAFA',
            border: 0,
            outline: 'none',
        }}>
            <Header handleAddDialog = {() => setAddBookDialogOpen(true)} fetchData={filterBooks}/>
            { books && (<HomeCardLayout bookData = {booksDisplayed} email={email} fetchData={filterBooks} setIsBookDetailsOpen={setIsBookDetailsOpen}/>)}
            { error && (<Box sx={{height: '100%', width: '100%', display: 'flex', textAlign: "center", justifyItems: "center", fontSize: '2rem'}}>No Item Found</Box>)}
            { addBookDialogOpen && (<AddBookDialog open = {addBookDialogOpen} onClose = {() => {setAddBookDialogOpen(false);}} user_email={email} fetchBooks={fetchBooks}/> )}
            {isBookDetailsOpen &&(<BookDetailsDialog open = {isBookDetailsOpen} 
                onClose={()=> {setIsBookDetailsOpen(false); setBookDetails({book_isbn: '',book_title: '',book_author: '',book_publisher: '',book_category: '',copy_count: 0,issued_count: 0,book_description: '',book_status: ''})}}
                bookDetails={bookDetails} user_email={email} isAdmin={isAdmin}/>)}
        </Box>
    );
}export default Home;
