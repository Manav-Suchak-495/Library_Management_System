import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { useState } from "react";

const ForgotPasswordDialog = ({forgotPasswordDialog, setForgotPasswordDialog}: { forgotPasswordDialog: boolean, setForgotPasswordDialog: (args :boolean) => void}) => {
    
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false)
    return(
        <Dialog open={forgotPasswordDialog} onClose={()=>{setForgotPasswordDialog}} fullWidth maxWidth={false} 
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

                        <Button
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