import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import Header from "./Header";
import AddBookDialog from "./AddBookDialog";
import axios from "axios";
import HomeCardLayout from "./HomeCardLayout";
import BookDetailsDialog from "./BookDetailsDialog";
import LoadingOverlay from "./LoadingOverlay";
import HistoryDialog from "./HistoryDialog";

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

interface IssueDataInterface {
    issue_id: string;
    issue_isbn: string;
    issue_title: string;
    issue_email: string;
    issue_to: string;
    issue_status: string;
    issue_by: string;
    issue_at: string;
    return_by: string;
    return_at: string;
}

function Home() {
    const [isAndroid, setIsAndroid] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState(false)
    const [email, setEmail] = useState('')
    const [addBookDialogOpen, setAddBookDialogOpen] = useState<boolean>(false);
    const [isBookDetailsOpen, setIsBookDetailsOpen] = useState<boolean>(false);
    const [isHistoryDialog, setIsHistoryDialog] = useState(false)
    const [books, setBooks] = useState<BookDataInterface[]>([])
    const [booksDisplayed, setBooksDisplayed] = useState<BookDataInterface[]>([])
    const [issueData, setIssueData] = useState<IssueDataInterface[]>([])
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

    const fetchBooks = async () =>{
        setLoading(true)
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        axios.get(`${apiUrl}/books/fetch`).then((response) =>{
            if(response.data && response.data.length > 0){
                    setBooks(response.data)
                    setBooksDisplayed(response.data)
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

    const fetchIssueData = () => {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        axios.post(`${apiUrl}/issue/fetch`, {'issue_to': ''}).then((response) =>{
            if(response.data && response.data.length > 0){
                    setIssueData(response.data)
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
            <LoadingOverlay open={loading} />
            <Header handleAddDialog = {() => setAddBookDialogOpen(true)} handleHistoryDialog={() => setIsHistoryDialog(true)} fetchBookData={filterBooks} fetchIssueData={fetchIssueData}/>
            { books && (<HomeCardLayout bookData = {booksDisplayed} email={email} fetchData={filterBooks} setIsBookDetailsOpen={setIsBookDetailsOpen}/>)}
            { error && (<Box sx={{height: '100%', width: '100%', display: 'flex', textAlign: "center", justifyItems: "center", fontSize: '2rem'}}>No Item Found</Box>)}
            { addBookDialogOpen && (<AddBookDialog open = {addBookDialogOpen} onClose = {() => {setAddBookDialogOpen(false);}} user_email={email} fetchBooks={fetchBooks}/> )}
            { isBookDetailsOpen && (<BookDetailsDialog open = {isBookDetailsOpen} fetchBooks={fetchBooks}
                onClose={()=> {setIsBookDetailsOpen(false); setBookDetails({book_isbn: '',book_title: '',book_author: '',book_publisher: '',book_category: '',copy_count: 0,issued_count: 0,book_description: '',book_status: '',});}}
                bookDetails={bookDetails} user_email={email} isAdmin={isAdmin}/>)}
            { isHistoryDialog && (<HistoryDialog open={isHistoryDialog} onClose={() => {setIsHistoryDialog(false)}} user_email={email} isAdmin={isAdmin} issueData={issueData} fetchBooks={fetchBooks} fetchIssueData={fetchIssueData}/>)}
        </Box>
    );
}
export default Home;