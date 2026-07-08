import { Dialog, DialogContent, DialogActions, Button, Box, Typography, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import Logo_Black from './assets/Logo_Green_Black_White_Back.png';
import { useEffect, useState } from 'react';

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

interface MuiAddBookDialogProps {
  open: boolean;
  onClose: () => void;
  bookDetails : BookDataInterface;
  user_email: string;
  isAdmin: boolean;
}

const BookDetailsDialog = ({ open, onClose, bookDetails , user_email, isAdmin }: MuiAddBookDialogProps) => {
    const [issueDialog, setIssueDialog] = useState(false);
    const [signUp, setSignUp] = useState(false)
    const [issueName, setIssueName] = useState('');
    const [issueEmail, setIssueEmail] = useState('');
    const [issueMobile, setIssueMobile] = useState('');
    const [otp, setOtp] = useState('')
    const [isEmailVerified, setIsEmailVerified] = useState(false)
    const [token, setToken] = useState('')
    const assets = {
          Logo_Black: Logo_Black,
    };
    const handleBookDetail = async () =>{
        setIssueDialog(true);
        if(!isAdmin){
            setIssueEmail(user_email);
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
            await axios.post(`${apiUrl}/otp`, {"email": user_email, "signup": false}).then((response)=>{
                    if(response.data.Authenticated){
                        setIsEmailVerified(true)
                        alert('OTP sent successfully!!!')
                        setToken(response.data.Token)
                    }
                }).catch((error)=>{
                        console.log("Error While Verifying Email" + error.response?.data)
                })
        }
    }
    const handleIssueBook = async () =>{
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        if(isEmailVerified){
            if(!isAdmin && otp.trim() !== ''){
                await axios.post(`${apiUrl}/verify-otp`, {'issue_isbn': bookDetails.book_isbn, 'issue_title': bookDetails.book_title, 'issue_status': bookDetails.book_status, "signup": false, "forgot": false, 'Token': token, 'otp': otp, 'issue': false}).then((response)=>{
                    if(response.data.Authenticated){
                        alert('Book Request for' + bookDetails.book_title + ' Sent Successfully.')
                    }
                }).catch((error)=>{
                    console.log("Error While Issueing Book" + error.response?.data)
                })
            }
            else if(isAdmin && otp.trim() !== '' && !signUp){
                    await axios.post(`${apiUrl}/verify-otp`, {'issue_isbn': bookDetails.book_isbn, 'issue_title': bookDetails.book_title, 'issue_status': bookDetails.book_status, 'issue_by': user_email, "signup": false, "forgot": false, 'Token': token, 'otp': otp, 'issue': true}).then((response)=>{
                    if(response.data.Authenticated){
                        alert(bookDetails.book_title + ' is issued to ' + issueName)
                    }}).catch((error)=>{
                        console.log("Error While Issueing Book" + error.response?.data)
                    })
            }
            else if(isAdmin && signUp){
                await axios.post(`${apiUrl}/verify-otp`, {'user_name': issueName, 'user_email': issueEmail, 'user_mobile': issueMobile, 'issue_email' : issueEmail, 'issue_to': issueName, 'issue_isbn': bookDetails.book_isbn, 'issue_title': bookDetails.book_title, 'issue_status': bookDetails.book_status, 'issue_by': user_email, "signup": true, "forgot": false, 'Token': token, 'otp': otp, 'issue': true}).then((response)=>{
                    if(response.data.Authenticated){
                        alert(bookDetails.book_title + ' is issued to ' + issueName)
                    }}).catch((error)=>{
                        console.log("Error While Verifying Email" + error.response?.data)
                    })
            }
        }
        else{
            if(isAdmin && issueEmail.trim() !== '' && !signUp){
                    await axios.post(`${apiUrl}/otp`, {"email": issueEmail, "signup": false}).then((response)=>{
                    if(response.data.Authenticated){
                        setIsEmailVerified(true)
                        alert('OTP sent successfully!!!')
                        setToken(response.data.Token)
                    }}).catch((error)=>{
                        console.log("Error While Verifying Email" + error.response?.data)
                    })
            }
            else if(isAdmin && signUp){
                await axios.post(`${apiUrl}/otp`, {"email": issueEmail, "signup": true}).then((response)=>{
                    if(response.data.Authenticated){
                        setIsEmailVerified(true)
                        alert('OTP sent successfully!!!')
                        setToken(response.data.Token)
                    }}).catch((error)=>{
                        console.log("Error While Verifying Email" + error.response?.data)
                    })
            }
        }

    }

    const handleIssueButton = () =>{

    }

    return (
        <Dialog open={open} 
        onClose={() => {onClose}} 
        fullWidth maxWidth={false} 
        disableRestoreFocus
        slotProps={{
            paper: {
                sx: {
                    minHeight: {xs: '180px',sm: '200px', md:'220px', lg: '240px'},
                    width: {xs: '400px', sm: '400px', md: '340px', lg: '365px'}, 
                    maxWidth: 'calc(100% - 32px)',
                    margin: 'auto',
                    borderRadius: 2.7,
                }
            }
        }}>
        
        <DialogContent >
            <Box sx={{
                width: '100%',
                textAlign: 'center',
                backgroundColor: '#000000',
                color: '#ffffff',
                py: 0.5,
                mb: 1,
                borderRadius: 2,
                fontSize: {xs: '1rem', sm: '1rem', md: '1rem', lg: '1rem'}
            }}>
                {bookDetails.book_isbn}
            </Box>

            <Box sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection:'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                
            }}>
                <Typography 
                    sx={{ 
                    textAlign: 'center',
                    fontWeight: 'bold', 
                    fontSize: {xs: '1rem', sm: '1rem', md: '0.8rem', lg: '0.8rem'},
                    color: '#27CF54',
                    overflow: 'hidden',
                }}>
                    {bookDetails.book_title}
                </Typography>
                <Typography 
                    sx={{ fontStyle:'italic',
                        fontWeight:'Semibold',
                        textAlign: 'right',
                        fontSize: {xs: '1rem', sm: '1rem', md: '0.75rem', lg: '0.77rem'}, 
                        color:"#000000",
                        overflow: 'hidden',
                        pr: 0.5,
                        mb: 0.5,
                }}>
                        {"- " + bookDetails.book_author}
                </Typography>
            </Box>
            <Box component='img'
                src={assets.Logo_Black}
                sx={{ 
                width: '100%', 
                height: { xs: '185px', sm: '180px', md: '155px', lg: '165px'}, 
                bgcolor: 'transparent', 
                mb: 1,
                objectFit: 'contain',
                borderRadius: 1,
            }}/>
            <Box sx={{
                flexGrow: 1,
                display: 'block',
                flexDirection:'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                
            }}>
                <Box sx={{
                        height: 'auto',
                        width:'100%',
                        maxHeight: {xs: '108px', sm: '107px', md: '68px',lg:'80.5px'}, 
                        overflowY: 'auto',
                        color: '#000000',
                        flexGrow: 1,
                        textAlign: 'justify',
                        fontWeight: '400',
                        fontSize: {xs: '1rem', sm: '1rem', md: '0.7rem', lg: '0.7rem'}, 
                        lineHeight: 1.1,
                        mb: 2,
                    }}>
                        <Box component='span' 
                            sx={{ color: '#27CF54',
                                fontSize: {xs: '1rem', sm: '1rem', md: '0.72rem', lg: '0.75rem'}, 
                                fontStyle: 'normal',
                            }}>
                            Description - {" "}
                        </Box> {bookDetails.book_description}
                    </Box>
                <Box sx={{
                    width:'100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start'
                }}>
                    <Typography 
                        sx={{ fontStyle: 'italic', 
                            fontWeight:'Semibold',
                            fontSize: {xs: '1rem', sm: '1rem', md: '0.75rem', lg: '0.77rem'}, 
                            color:"#27CF54",
                            overflow: 'hidden',
                            pr: 0.5
                    }}>
                        <Box component='span' 
                            sx={{ color: '#000000',
                                fontWeight: 'Semibold',
                                fontSize: {xs: '1rem', sm: '1rem', md: '0.72rem', lg: '0.75rem'}, 
                                fontStyle: 'normal',
                            }}>
                            Publisher - 
                        </Box>
                        {" " + bookDetails.book_publisher}
                    </Typography>
                </Box>
                <Box sx={{
                    width:'100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    mt:1,
                }}>
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pr: 0.5
                    }}>
                        <Box sx={{
                            width: '100%',
                            textAlign: 'center',
                            backgroundColor: '#27CF54',
                            color: '#ffffff',
                            px: 0.5,
                            py: 0.5,
                            fontSize: {xs: '0.9rem', sm: '0.9rem', md: '0.8rem', lg: '0.8rem'},
                            fontWeight: 'bold',
                            lineHeight: 1.5,
                            borderTopLeftRadius: 9,
                            borderBottomLeftRadius: 9,
                        }}>
                            {bookDetails.copy_count}<br/>Available
                        </Box>
                    </Box>
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pl: 0.5
                    }}>
                        <Box sx={{
                            width: '100%',
                            textAlign: 'center',
                            backgroundColor: '#000000',
                            color: '#ffffff',
                            px: 0.5,
                            py: 0.5,
                            fontSize: {xs: '0.9rem', sm: '0.9rem', md: '0.8rem', lg: '0.8rem'},
                            fontWeight: 'bold',
                            lineHeight: 1.5,
                            borderBottomRightRadius: 9,
                            borderTopRightRadius: 9,
                        }}>
                            {bookDetails.issued_count}<br/>Issued
                        </Box>
                    </Box>
                </Box>
            </Box>
        </DialogContent>
        
        <DialogActions sx={{
            px: "20px",
            pb: "20px",
            mt: -0.75,
        }}>
        <Box sx={{
            width:'100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
            <Button onClick={onClose} sx={{
                width: '100%',
                borderRadius: 1.8,
                color: '#ffffff',
                backgroundColor: '#000000',
                mr: 1,
            }}>
                Cancel
            </Button>

            <Button onClick={handleBookDetail}
            disabled = {bookDetails.book_status != "Available"}
            sx={{
                width: '100%',
                borderRadius: 1.8,
                color: '#000000',
                backgroundColor: '#27CF54',
                ml: 1,
            }}>
                {isAdmin ? ("Issue") : ("Borrow")}
            </Button>
        </Box>
        </DialogActions>

        <Dialog open={issueDialog} 
        onClose={(e,reason)=>{ 
            if (reason === 'backdropClick') return;
            setIssueDialog(false)
        }} 
        fullWidth maxWidth={false} 
        disableRestoreFocus
            slotProps={{
                paper: {
                sx: {
                    width: {xs: '355px', sm: '355px', md: '325px', lg: '355px'}, 
                    maxWidth: {xs:'calc(100% - 32px)', sm: 'calc(100% - 32px)'},
                    minHeight: {xs: '285px', sm: '285px', md: '285px', lg: '285px'}, 
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
                {(isAdmin && signUp) ? "SignUp" : "OTP Verification"}
            </DialogTitle>

            <DialogContent sx={{ px:'24px', pt: '20px', pb: '9px' }}>
                {(isAdmin && signUp) && (<TextField placeholder='Name'
                    fullWidth 
                    value={issueName}
                    onChange={(e)=>setIssueName(e.target.value)}
                    sx={{
                    mt: 3,
                    "& .MuiInputBase-root": { 
                        height : {xs : '50px', sm: '50px', md: '36px', lg: '44px'}, 
                        fontSize: { xs: '1rem', sm: '1rem', md: '0.9rem', lg: '0.9rem' } ,
                        borderRadius: { xs: 2.5, sm: 2.5, md: 2.5, lg: 2.5 },
                        bordercolor: 'primary.main',
                        }, 
                }}/>)}
                <TextField placeholder={isEmailVerified ? "Enter OTP" : "Email"}
                    type={isEmailVerified ? "tel" : "text"}
                    fullWidth 
                    value={isEmailVerified ? otp : issueEmail}
                    onChange={isEmailVerified ? (e)=>setOtp(e.target.value):(e)=>setIssueEmail(e.target.value)}
                    slotProps={{
                        htmlInput :{
                            maxLength: isEmailVerified ? 6: null,
                        }
                    }}
                    sx={{
                    mt: 2.85,
                    "& .MuiInputBase-root": { 
                        height : {xs : '50px', sm: '50px', md: '36px', lg: '44px'}, 
                        fontSize: { xs: '1rem', sm: '1rem', md: '0.9rem', lg: '0.9rem' } ,
                        borderRadius: { xs: 2.5, sm: 2.5, md: 2.5, lg: 2.5 },
                        bordercolor: 'primary.main',
                        }, 
                }}/>
                {(isAdmin && signUp) && (<TextField placeholder='Mobile'
                    type="tel"
                    fullWidth 
                    value={issueMobile}
                    onChange={(e)=>setIssueMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    slotProps={{
                        htmlInput :{
                            maxLength: 10,
                        }
                    }}
                    sx={{
                    mt: 2.85,
                    "& .MuiInputBase-root": { 
                        height : {xs : '50px', sm: '50px', md: '36px', lg: '44px'}, 
                        fontSize: { xs: '1rem', sm: '1rem', md: '0.9rem', lg: '0.9rem' } ,
                        borderRadius: { xs: 2.5, sm: 2.5, md: 2.5, lg: 2.5 },
                        bordercolor: 'primary.main',
                        }, 
                }}/>)}
                {!isEmailVerified &&
                (<Typography onClick={()=>{
                    setIssueEmail('');
                    setIssueMobile('');
                    setIssueName('');
                    if(signUp){
                        setSignUp(false);
                    }else{
                        setSignUp(true);
                    }
                }}
                    sx={{ mt: 0.5, fontWeight: 'semibold', textAlign: 'right', color: 'primary.main', fontSize: '0.75rem', '&:hover': { color: '#09BF18', textDecoration: 'underline' }, cursor: 'pointer',}}>
                        {(isAdmin && signUp) ? "OTP Verification" : "Add Account"}
                    </Typography>)}
            </DialogContent>
            <DialogActions sx={{
                px: "24px",
                pb: "20px",
                mt: 1,
            }}>
                <Box sx={{
                    width:'100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <Button onClick={()=>{setIssueDialog(false);}} 
                        sx={{
                            width: '100%',
                            borderRadius: 2.5,
                            color: '#ffffff',
                            backgroundColor: '#000000',
                            mr: 1,
                            py: 0.7
                    }}>
                        Cancel
                    </Button>

                    <Button
                    onClick={()=>{
                        handleIssueBook()
                    }}
                    disabled = {isEmailVerified ? (otp.trim().length < 6) :(signUp?(issueEmail.trim() === '' || issueName === '' || issueMobile.length < 10) : (issueEmail.trim() === ''))}
                    sx={{
                        width: '100%',
                        borderRadius: 2.5,
                        color: '#000000',
                        backgroundColor: '#27CF54',
                        ml: 1,
                    }}>
                        {isEmailVerified ? "Submit" : (signUp ? "SignUp" : "Send OTP" )}
                    </Button>
                </Box>
            </DialogActions>
            
        </Dialog>
        </Dialog>
    );
};
export default BookDetailsDialog;