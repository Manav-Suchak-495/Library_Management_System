import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material"
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordDialog = ({forgotPasswordDialog, setForgotPasswordDialog}: { forgotPasswordDialog: boolean, setForgotPasswordDialog: (args :boolean) => void}) => {
    
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false)
    const [token, setToken] = useState('')
    const navigate = useNavigate()

    const handleForgotPassword = async () => {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        if(!isEmailVerified){
            await axios.post(`${apiUrl}/otp`, {"email": email, "signup": false}).then((response)=>{
                if(response.data.Authenticated){
                    alert('OTP sent successfully!!!')
                    setIsEmailVerified(true)
                    setToken(response.data.Token)
                }
            }).catch((error)=>{
                console.log("Error While Verifying Email" + error.response?.data)
            })
        }
        else{
            await axios.post(`${apiUrl}/verify-otp`, {"Token": token, "forgot": true, "otp": otp}).then((response)=>{
                if(response.data.Authenticated){
                    console.log('Login successful');
                    sessionStorage.setItem("Token", response.data.Token);
                    setToken(response.data.Token)
                    setForgotPasswordDialog(false)
                    navigate('/home');
                }
            }).catch((error)=>{
                console.log("Error While Verifying Email" + error.response?.data)
            })
        }
    }
    return(
        <Dialog open={forgotPasswordDialog} onClose={()=>setForgotPasswordDialog} fullWidth maxWidth={false} 
                slotProps={{
                    paper: {
                    sx: {
                        width: {xs: '100%', sm: '350px', md: '315px', lg: '315px'}, 
                        maxWidth: {xs:'calc(100% - 32px)', sm: 'calc(100% - 32px)'},
                        minHeight: {xs: '285px', sm: '285px', md: '265px', lg: '265px'}, 
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
                    OTP Verification
                </DialogTitle>

                <DialogContent sx={{ px:'24px', pt: '20px', pb: '9px' }}>
                    <TextField placeholder={isEmailVerified ? "Enter OTP" : "Email"}
                    type={isEmailVerified ? "tel" : "text"}
                    fullWidth 
                    value={isEmailVerified ? otp : email}
                    onChange={isEmailVerified ? (e)=>setOtp(e.target.value):(e)=>setEmail(e.target.value)}
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
                {isEmailVerified &&
                (<Typography onClick={ async ()=>{
                    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
                    await axios.post(`${apiUrl}/otp`, {"email": email, "signup": false}).then((response)=>{
                        if(response.data.Authenticated){
                            alert('OTP sent successfully!!!')
                            setIsEmailVerified(true)
                            setToken(response.data.Token)
                        }}).catch((error)=>{
                            console.log("Error While Verifying Email" + error.response?.data)
                        })
                }}
                    sx={{ mt: 0.5, fontWeight: 'semibold', textAlign: 'right', color: 'primary.main', fontSize: '0.75rem', '&:hover': { color: '#09BF18', textDecoration: 'underline' }, cursor: 'pointer',}}>
                        Resend OTP
                </Typography>)}
                </DialogContent>
                <DialogActions sx={{
                    px: "24px",
                    pb: "20px",
                    mt: -0.75,
                }}>
                    <Box sx={{
                        width:'100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <Button onClick={()=>(setForgotPasswordDialog(false))}
                            sx={{
                                width: '100%',
                                borderRadius: 2.7,
                                color: '#ffffff',
                                backgroundColor: '#000000',
                                mr: 1,
                                py: 0.7
                        }}>
                            Cancel
                        </Button>

                        <Button onClick={()=>{
                            handleForgotPassword()
                        }}
                        disabled = {email.trim() === ''}
                        sx={{
                            width: '100%',
                            borderRadius: 2.7,
                            color: '#000000',
                            backgroundColor: '#27CF54',
                            ml: 1,
                        }}>
                            Send OTP
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
    )
}
export default ForgotPasswordDialog;