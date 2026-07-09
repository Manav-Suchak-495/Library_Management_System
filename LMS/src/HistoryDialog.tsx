import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import Logo_Black from './assets/Logo_Green_Black_White_Back.png';
import { ArrowBackIos, AutoStoriesRounded, ClassOutlined, LibraryAddCheckRounded, MoveToInboxRounded} from "@mui/icons-material";

interface HistoryBookDialogInterface{
    open: boolean;
    onClose: () => void;
    user_email: string;
    isAdmin: boolean;
    issueData: IssueDataInterface[]
}
interface IssueDataInterface {
    issue_id: string;
    issue_isbn: string;
    issue_title: string;
    issue_to: string;
    issue_status: string;
    issue_by: string;
    issue_at: string;
    return_by: string;
    return_at: string;
}

const HistoryDialog = ({ open, onClose , user_email, isAdmin, issueData  }: HistoryBookDialogInterface)=>{
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
                    minHeight: {xs: '575px',sm: '575px', md:'500px', lg: '555px'},
                    width: {xs: '100%', sm: '375px', md: '325px', lg: '360px'}, 
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
                    display: "flex",
                    direction: "row"
                }}>
                    <Button onClick={()=>onClose()} 
                    sx={{
                        position: 'fixed',
                        zIndex: 1000,
                        height: {xs: 48, sm: 48, md: 40, lg: 40},
                        width: 'auto',
                        backgroundColor: '#000000',
                        borderRadius: 2.7,
                    }}>
                        <ArrowBackIos sx={{
                            fontSize: '1rem'
                        }}/>
                    </Button>
                    <Box sx={{
                        height: {xs: 48, sm: 48, md: 40, lg: 40},
                        width: '100%',
                        textAlign: 'center',
                        alignContent: 'center',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 2.7,
                        fontSize: {xs: '1.1rem', sm: '1.1rem', md: '1.1rem', lg: '1.1rem'}
                    }}>
                        History
                    </Box>
                </Box>
                {issueData.map((issueDetail)=>(
                    <Box sx={{
                        width: '100%',
                        height: '70px',
                        backgroundColor: '#ffffff',
                        borderBottom: '3px solid #000000'
                    }}>
                        <Box 
                            sx={{ 
                            width: '100px', 
                            height: { xs: '70px', sm: '70px', md: '70px', lg: '70px'}, 
                            bgcolor: 'transparent', 
                            mb: 1,
                            objectFit: 'contain',
                        }}>
                            <MoveToInboxRounded sx={{ fontSize: 48}}/>
                        </Box>
                    </Box>
                ))}
                
            </DialogContent>
        </Box>
        </Dialog>
    )
}
export default HistoryDialog