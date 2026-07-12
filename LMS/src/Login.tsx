import { Box, Button, TextField, Typography, InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Background from './assets/Background.png';
import Logo_Black from './assets/Logo_Black_White.png';
import Logo_Green_Black_White_Back from './assets/Logo_Green_Black_White_Back.png'
import ForgotPasswordDialog from './ForgotPasswordDialog';
import LoadingOverlay from './LoadingOverlay';

function Login({setUserEmail} : {setUserEmail: (arg :string)=>void;}) {
    const [isAndroid, setIsAndroid] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [forgotPasswordDialog, setForgotPasswordDialog] = useState(false);
    const [showError, setShowError] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const assets = {
        backgroundImage: Background,
        Logo_Black: Logo_Black,
        Logo: Logo_Green_Black_White_Back
    };
    useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/android|iphone|ipad|ipod/i.test(userAgent)) {
        setIsAndroid(true);
    }
    }, []);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleOnChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleOnChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };
    const handleLogin = async () => {
            setIsSubmitting(true);
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
            await axios.post(`${apiUrl}/Login`, {"email": email, "password": password}).then((response) =>{
            console.log('Login successful');
            setUserEmail(email)
            sessionStorage.setItem("Token", response.data.Token);
            navigate('/home');
        }).catch ((error)=>{
            console.error('Login failed or network error:', error);
            setShowError(true)
            setEmail('');
            setPassword('');
        }).finally(() => {
            setIsSubmitting(false);
        }) 
    };
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100dvh',
        width: '100%',
        px: { xs: 0, sm: 0, md: 2, lg: 4 },
        boxSizing: 'border-box',
        border: 0,
        outline: 'none',
        backgroundImage: `url(${assets.backgroundImage})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '350px',
        backgroundAttachment: 'fixed',
          }}>
        <LoadingOverlay open={isSubmitting} />
        {(isAndroid && 
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%', backgroundColor: '#FFFFFF',  }}>
            <Box component="img" 
                src={assets.Logo} 
                sx={{height: '54px',
                display: { xs: 'block', sm: 'none' },
                position: 'fixed',
                width: 'auto',
                objectFit: 'fill',
                ml: 2,
                mt: 1,
                borderBottom: '3px solid black'
            }}/>
        </Box>
        )}
        <Box
        sx={{
          width: { xs: '100dvw', sm: 'auto', md: 'auto', lg: 'auto' },
          maxWidth: { xs: '100%', sm: '360px', md: '320px', lg: '320px' },
          height: { xs: '100dvh', sm: 'auto', md: 'auto', lg: 'auto' },
          minHeight: { xs: '100dvh', sm: 'auto' },
          borderRadius: {xs: 0, sm: 4, md: 4, lg: 4},
          bgcolor: '#ffffff',
          gap: 0,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          outline: 'none',
          justifyContent: 'center',
          alignItems: 'center',
          border: {xs:'0px solid',
            sm:'3.6px solid', 
            md:'3.6px solid',
            lg:'3.6px solid'},
          borderColor: '#000000 !important',
          px: 4,
          pt: 2,
          boxShadow: {sm:'7px 7px 0px rgba(0, 0, 0, 1)'}}}>
            <Typography sx={{ mb: 3 , fontWeight: 'bold', textAlign: 'center', color: 'black', fontSize: '2.4rem' }}>
                Login
            </Typography>
            <TextField
                label="Username"
                variant="outlined" 
                color="primary"
                fullWidth 
                value={email}
                onChange={handleOnChangeEmail}
                sx={{ mb: {xs: 4, sm: 4, md: 2.25, lg: 2.25}, 
                    "& .MuiInputBase-root": { 
                        height : {xs : '50px', sm: '50px', md: '36px', lg: '44px'}, 
                        fontSize: { xs: '1rem', sm: '1rem', md: '0.9rem', lg: '0.9rem' } ,
                        borderRadius: { xs: 2.5, sm: 2.5, md: 2.5, lg: 2.5 },
                        bordercolor: 'primary.main',
                        }, 
                    '& .MuiInputLabel-root':{
                        fontSize: { xs: '1rem', sm: '1rem', md: '0.9rem', lg: '0.9rem' },
                        transform: {xs:"translate(13px, 13px) scale(1)", sm:"translate(13px, 13px) scale(1)", md:"translate(13px, 8px) scale(1)", lg:"translate(13px, 12px) scale(1)"}
                    },
                    "& .MuiInputLabel-shrink": {
                        transform: {xs:"translate(13px, -9px) scale(0.75)", sm:"translate(13px, -9px) scale(0.75)", md:"translate(13px, -9px) scale(0.75)", lg:"translate(13px, -9px) scale(0.75)"},
                    },
                }
                } />
            <TextField
                label="Password"
                variant="outlined" 
                color="primary"
                type={showPassword ? 'text' : 'password'}
                fullWidth 
                value={password}
                onChange={handleOnChangePassword}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                            <IconButton
                                onClick={handleClickShowPassword}
                                edge="end"
                            >
                                {showPassword ? <Visibility sx = {{ color: 'primary.main' }} /> : <VisibilityOff sx={{ color: '#000000' }} />}
                            </IconButton>
                            </InputAdornment>
                        )
                    },
                }}
                sx={{"& .MuiInputBase-root": { 
                        height : {xs : '50px', sm: '50px', md: '36px', lg: '44px'}, 
                        fontSize: { xs: '1rem', sm: '1rem', md: '0.9rem', lg: '0.9rem' } ,
                        borderRadius: { xs: 2.5, sm: 2.5, md: 2.5, lg: 2.5 },
                        bordercolor: 'primary.main',
                        }, 
                    '& .MuiInputLabel-root':{
                        fontSize: { xs: '1rem', sm: '1rem', md: '0.9rem', lg: '0.9rem' },
                        transform: {xs:"translate(13px, 13px) scale(1)", sm:"translate(13px, 13px) scale(1)", md:"translate(13px, 8px) scale(1)", lg:"translate(13px, 12px) scale(1)"}
                    },
                    "& .MuiInputLabel-shrink": {
                        transform: {xs:"translate(13px, -9px) scale(0.75)", sm:"translate(13px, -9px) scale(0.75)", md:"translate(13px, -9px) scale(0.75)", lg:"translate(13px, -9px) scale(0.75)"},
                    },
                    
                }
                } />
                <Box sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 0,
                }}>
                    <Typography onClick={()=>{setForgotPasswordDialog(true); setEmail(''); setPassword('')}}
                    sx={{ mt: 0.5, fontWeight: 'semibold', textAlign: 'right', color: 'primary.main', fontSize: '0.75rem', '&:hover': { color: '#09BF18', textDecoration: 'underline' }, cursor: 'pointer',}}>
                        Forgot Password?
                    </Typography>
                </Box>
            <Button color='primary'
                variant='contained' 
                onClick={handleLogin}
                disabled={isSubmitting}
                sx={{ mt: 3,
                    mb: 5, 
                    width: '100%', 
                    height: { xs: 50, sm: 40, md: 40, lg: 40 }, 
                    fontSize: { xs: '1rem', sm: '1rem', md: '1rem', lg: '1rem' }, 
                    borderRadius: { xs: 2.5, sm: 2.5, md: 2.5, lg: 2.5 },
                    boxShadow: ' 3px 4px 0px 0px rgba(0, 0, 0, 1)', 
                    border: '1.5px solid',
                    borderColor: '#000000 !important',
                    fontWeight: 'bold',
                }}>
                Login
            </Button>
        </Box>
        {forgotPasswordDialog && (<ForgotPasswordDialog forgotPasswordDialog={forgotPasswordDialog} setForgotPasswordDialog={() => {setForgotPasswordDialog(false)}} setUserEmail={setUserEmail}/>)}
        {showError && <Dialog
            open={showError}
            onClose={() => setShowError(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title" sx={{ color: 'primary.main' }}>
          {"Login Failed"}
        </DialogTitle>
        
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Invalid username or password. Please verify your credentials and try again.
          </DialogContentText>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setShowError(false)} autoFocus variant="outlined" color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>}
    </Box>
  );
}
export default Login;