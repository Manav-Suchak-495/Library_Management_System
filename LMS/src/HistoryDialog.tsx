import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import Logo_Black from './assets/Logo_Green_Black_White_Back.png';

interface HistoryBookDialogInterface{
    open: boolean;
    onClose: () => void;
    user_email: string;
    isAdmin: boolean;
}

const HistoryDialog = ({ open, onClose , user_email, isAdmin }: HistoryBookDialogInterface)=>{
    const [isLoading, setIsLoading] = useState(Boolean(open))

    const assets = {
          Logo_Black: Logo_Black,
    };
    useEffect(() => {
            if (!open) {
                setIsLoading(true);
                return;
            }
    
            //const hasBookData = Boolean(bookDetails?.book_isbn || bookDetails?.book_title || bookDetails?.book_description);
    
            /*if (!hasBookData) {
                setIsLoading(true);
                return;
            }
    
            const timer = window.setTimeout(() => setIsLoading(false), 250);
            return () => window.clearTimeout(timer);*/
        }, [open])//, bookDetails?.book_isbn, bookDetails?.book_title, bookDetails?.book_description]);

    return(
        <Dialog open={open} 
        onClose={isLoading ? undefined : onClose} 
        fullWidth maxWidth={false} 
        disableRestoreFocus
        slotProps={{
            paper: {
                sx: {
                    minHeight: {xs: '180px',sm: '200px', md:'220px', lg: '575px'},
                    width: {xs: '400px', sm: '400px', md: '340px', lg: '375px'}, 
                    maxWidth: 'calc(100% - 32px)',
                    margin: 'auto',
                    borderRadius: 2.7,
                }
            }
        }}>
        
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            {isLoading &&  (
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                }}>
                </Box>
            )}
            <DialogContent sx={{ padding: 0}}>
                <Box sx={{
                    width: '100%',
                    textAlign: 'center',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    py: 1,
                    mb: 1,
                    borderTopLeftRadius: 2,
                    borderTopRightRadius: 2,
                    fontSize: {xs: '1rem', sm: '1rem', md: '1rem', lg: '1rem'}
                }}>
                    History
                </Box>

                <Box sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection:'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    
                }}>
                    
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
                
            </DialogContent>
        </Box>
        </Dialog>
    )
}
export default HistoryDialog