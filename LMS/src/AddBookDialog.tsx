import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';

interface MuiAddBookDialogProps {
  open: boolean;
  onClose: () => void;
  user_email: string;
}

interface BookDataInterface {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  copyCount: string;
  finalCopyCount: number;
  description: string;
}
interface FormErrors {
      isbn?: string;
      title?: string;
      author?: string;
      publisher?: string;
      description?: string;
    }
const AddBookDialog = ({ open, onClose, user_email }: MuiAddBookDialogProps) => {
  
const categories = [
  "Action & Adventure",
  "Architecture",
  "Arts & Photography",
  "Biography",
  "Business & Economics",
  "Comic",
  "Computer Science & IT",
  "Engineering & Technology",
  "Fantasy",
  "History",
  "Journals",
  "Languages & Linguistics",
  "Manga",
  "Mathematics",
  "Medical & Health Sciences",
  "Mystery & Thriller",
  "Non-Fiction",
  "Philosophy & Psychology",
  "Romance",
  "Sci-Fi",
  "Science",
  "Technology"
];
    const [bookData, setBookData] = useState<BookDataInterface>({
      isbn: '',
      title: '',
      author: '',
      publisher: '',
      category: 'Journals',
      copyCount: '1',
      finalCopyCount: 1,
      description: ''
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    

  const validateAddBookForm = () => {
    const tempErrors: FormErrors = {};

    if (!bookData.isbn || bookData.isbn.trim().length === 0) {
      tempErrors.isbn = "ISBN is required.";
    }
    else if (bookData.isbn.length < 10 || bookData.isbn.length > 15) {
      tempErrors.isbn = "ISBN must be between 10 and 15 characters.";
    }

    if (!bookData.title || bookData.title.trim().length === 0) {
      tempErrors.title = "Book Title is required.";
    } 
    else if (bookData.title.length > 50) {
      tempErrors.title = "Title cannot exceed 50 characters.";
    }

    if (!bookData.author || bookData.author.trim().length === 0) {
      tempErrors.author = "Author name is required.";
    } 
    else if (bookData.author.length > 50) {
      tempErrors.author = "Author name cannot exceed 50 characters.";
    }
    if (!bookData.publisher || bookData.publisher.trim().length === 0) {
      tempErrors.publisher = "Publisher name is required.";
    } 
    else if (bookData.publisher.length > 50) {
      tempErrors.publisher = "Publisher name cannot exceed 50 characters.";
    } 
    if (bookData.publisher.length > 120) {
      tempErrors.publisher = "Description cannot exceed 120 characters.";
    }
    
    setFormErrors(tempErrors)
    return Object.keys(tempErrors).length === 0;
  }

  const handleAddBook = async () =>{
    if(validateAddBookForm()){
      try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
            await axios.query(`${apiUrl}/books/add`, {...bookData, "issuedCount": 0, "status": "A", "addedBy": user_email});
            alert("Book added successfully!");
            setBookData({ isbn: '', title: '', author: '', publisher: '', category: '', copyCount: '1', finalCopyCount: 1, description: '' });
            setFormErrors({});
            onClose()
        } catch (err) {
            console.error("Submission failed", err);
        }

    }
  }

  return (
    <Dialog open={open} onClose={() => {onClose}} fullWidth maxWidth={false} 
      slotProps={{
        paper: {
          sx: {
            width: '418px', 
            maxWidth: 'calc(100% - 32px)',
            margin: 'auto',
            borderRadius: 2.7,
          }
        }
      }}>
      <DialogTitle sx={{
        fontSize: '1.5rem',
        fontStyle: 'Bold',
        color: '#000000',
        textAlign: 'center',
        borderBottom: '3px solid',
        borderColor: '#000000'
      }}>
        Add Book
      </DialogTitle>
      
      <DialogContent sx={{ px:'24px', pt: '20px', pb: '9px' }}>
        <TextField placeholder='Book ISBN'
          value={bookData.isbn}
          onChange={(e) => { setBookData({...bookData, isbn: e.target.value})}}
          error={Boolean(formErrors.isbn)}
          helperText={formErrors.isbn}
          fullWidth 
          sx={{
            mt: 3,
            "& .MuiInputBase-root": { 
              height : {xs : '50px', sm: '50px', md: '36px', lg: '44px'}, 
              fontSize: { xs: '1rem', sm: '1rem', md: '0.9rem', lg: '0.9rem' } ,
              borderRadius: { xs: 2.5, sm: 2.5, md: 2.5, lg: 2.5 },
              bordercolor: 'primary.main',
              }, 
        }} />

        <TextField placeholder='Book Title'
          fullWidth 
          value={bookData.title}
          onChange={(e) => { const cleanText = e.target.value.replace(/[^a-zA-Z\s]/g, ''); setBookData({...bookData, title:cleanText})}}
          error={Boolean(formErrors.title)}
          helperText={formErrors.title}
          sx={{
            mt: 2.7,
            "& .MuiInputBase-root": { 
              height : {xs : '50px', sm: '50px', md: '36px', lg: '44px'}, 
              fontSize: { xs: '1rem', sm: '1rem', md: '0.9rem', lg: '0.9rem' } ,
              borderRadius: { xs: 2.5, sm: 2.5, md: 2.5, lg: 2.5 },
              bordercolor: 'primary.main',
              }, 
            }} />

        <TextField placeholder='Author'
          fullWidth 
          value={bookData.author}
          onChange={(e) => { const cleanText = e.target.value.replace(/[^a-zA-Z\s]/g, ''); setBookData({...bookData, author:cleanText})}}
          error={Boolean(formErrors.author)}
          helperText={formErrors.author}
          sx={{
            mt: 2.7,
            "& .MuiInputBase-root": { 
              height : {xs : '50px', sm: '50px', md: '36px', lg: '44px'}, 
              fontSize: { xs: '1rem', sm: '1rem', md: '0.9rem', lg: '0.9rem' } ,
              borderRadius: { xs: 2.5, sm: 2.5, md: 2.5, lg: 2.5 },
              bordercolor: 'primary.main',
              }, 
            }} />

        <TextField placeholder='Publisher'
          fullWidth 
          value={bookData.publisher}
          onChange={(e) => { const cleanText = e.target.value.replace(/[^a-zA-Z\s]/g, ''); setBookData({...bookData, publisher:cleanText})}}
          error={Boolean(formErrors.publisher)}
          helperText={formErrors.publisher}
          sx={{
            mt: 2.7,
            "& .MuiInputBase-root": { 
              height : {xs : '50px', sm: '50px', md: '36px', lg: '44px'}, 
              fontSize: { xs: '1rem', sm: '1rem', md: '0.9rem', lg: '0.9rem' } ,
              borderRadius: { xs: 2.5, sm: 2.5, md: 2.5, lg: 2.5 },
              bordercolor: 'primary.main',
              }, 
            }} />

        <Select
          fullWidth
          labelId="book-category-label"
          value={bookData.category}
          sx={{
            mt: 2.7,
            height : {xs : '50px', sm: '50px', md: '36px', lg: '44px'}, 
            fontSize: { xs: '1rem', sm: '1rem', md: '0.9rem', lg: '0.9rem' } ,
            borderRadius: { xs: 2.5, sm: 2.5, md: 2.5, lg: 2.5 },
            bordercolor: 'primary.main',
          }}
          onChange={(e) => setBookData({...bookData, category: e.target.value})}>
          {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                  {cat}
              </MenuItem>
          ))}
        </Select>

        <TextField placeholder='No. of Copy'
          fullWidth 
          type='number'
          slotProps={{
            htmlInput: {
                sx: {
                    // For Chrome, Safari, Edge, and Opera
                    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                    },
                    // For Firefox
                    '&[type=number]': {
                        MozAppearance: 'textfield',
                    },
                },
            },
          }}
          value={bookData.copyCount}
          onChange={(e) => { 
            setBookData({...bookData, copyCount: e.target.value})
          }}
          onBlur={(e) => {
            if (!e.target.value || e.target.value.trim() === "") {
              setBookData({ ...bookData, finalCopyCount: 1 , copyCount: '1'});
              return;
            }
            const parsedValue = parseInt(e.target.value, 10);
            if (!isNaN(parsedValue) && parsedValue < 1) {
                setBookData({...bookData, finalCopyCount: 1, copyCount: '1'});
            } else {
                setBookData({...bookData, finalCopyCount: isNaN(parsedValue) ? 0 : parsedValue});
            }
          }}
          sx={{
            mt: 2.7,
            "& .MuiInputBase-root": { 
              height : {xs : '50px', sm: '50px', md: '36px', lg: '44px'}, 
              fontSize: { xs: '1rem', sm: '1rem', md: '0.9rem', lg: '0.9rem' } ,
              borderRadius: { xs: 2.5, sm: 2.5, md: 2.5, lg: 2.5 },
              bordercolor: 'primary.main',
              }, 
          }} />
        
        <TextField placeholder='Description'
          multiline
          fullWidth
          maxRows={2} 
          value={bookData.description}
          onChange={(e) => { setBookData({...bookData, description: e.target.value})}}
          error={Boolean(formErrors.description)}
          helperText={formErrors.description}
          sx={{
            mt: 2.7,
            "& .MuiInputBase-root": { 
              height : {xs : '54px', sm: '54px', md: '45px', lg: '54px'}, 
              fontSize: { xs: '1rem', sm: '1rem', md: '0.9rem', lg: '0.9rem' } ,
              borderRadius: { xs: 2.5, sm: 2.5, md: 2.5, lg: 2.5 },
              bordercolor: 'primary.main',
              }
          }} />
      </DialogContent>
      
      <DialogActions sx={{
        px: '22px',
        pb: '18px'
      }}>
        <Button onClick={onClose} sx={{
          borderRadius: 1.8,
          color: '#ffffff',
          backgroundColor: '#000000',
          height: '36px',
        }}>
          Cancel
        </Button>
        <Button onClick={handleAddBook}
        sx={{
          borderRadius: 1.8,
          color: '#000000',
          backgroundColor: '#27CF54',
          height: '36px'
        }}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default AddBookDialog;