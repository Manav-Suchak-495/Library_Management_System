import { Box, Button, Dialog, DialogActions, DialogContent, InputAdornment, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import Logo_Black from './assets/Logo_Green_Black_White_Back.png';
import { ArrowBackIos, ArrowBackIosNewRounded, AutoStoriesRounded, BookmarkAdd, BookmarkAddedRounded, BookmarkAddRounded, BookmarkRemoveOutlined, BookOnlineRounded, ClassOutlined, CollectionsBookmarkOutlined, CollectionsBookmarkRounded, LibraryAddCheckRounded, MoveToInboxRounded, Search} from "@mui/icons-material";

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
    const[search, setSearch] = useState('')
    const [isSearching, setIsSearching] = useState(false);


    const [isLoading, setIsLoading] = useState(Boolean(open));

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
        }, [open]);//, bookDetails?.book_isbn, bookDetails?.book_title, bookDetails?.book_description]);

    return(
        <Dialog open={open} 
        onClose={isLoading ? undefined : onClose} 
        fullWidth maxWidth={false} 
        disableRestoreFocus
        slotProps={{
            paper: {
                sx: {
                    minHeight: {xs: '100dvh',sm: '625px', md:'500px', lg: '555px'},
                    width: {xs: '100dvw', sm: '385px', md: '325px', lg: '360px'}, 
                    maxWidth: 'none',
                    margin: 'auto',
                    borderRadius: {xs: 0, sm:2.7},
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
                    direction: "row",
                    height: {xs: 48, sm: 48, md: 40, lg: 40},
                    pr: isSearching? '8px': '0px',
                    pt: isSearching? '8px': '0px',
                    borderBottom: isSearching ? '3px solid #000000' : 'none'
                }}>
                    <Button onClick={()=>{
                        if(isSearching){
                            setIsSearching(false)
                        }
                        else{
                            onClose()
                        }
                    }} 
                    sx={{
                        position: isSearching ? '':'fixed',
                        zIndex: 1000,
                        alignItems: 'center',
                        height: isSearching? {xs: 36, sm: 36, md: 32, lg: 32} : {xs: 48, sm: 48, md: 40, lg: 40},
                        width: isSearching ? {xs: 36, sm: 36, md: 32, lg: 32} : {xs: 44, sm: 44, md: 40, lg: 40},
                        pr: 1,
                        minWidth: {xs: 40, sm: 44, md: 36, lg: 36},
                        backgroundColor: isSearching ? 'transparent' : '#000000',
                        borderRadius: isSearching ? 8 : {xs: 0, sm:2.7},
                    }}>
                        <ArrowBackIosNewRounded sx={{
                            fontSize: '1rem',
                            textAlign: 'center',
                        }}/>
                    </Button>

                    {isSearching ? 
                    (<TextField variant='outlined' 
                        placeholder="Search" 
                        value={search}
                        onChange={(e)=> {
                            setSearch(e.target.value)
                        }}
                        slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{
                                        color: '#000000',
                                        fontSize: '1rem'
                                    }}/>
                                </InputAdornment>
                            )
                        },
                        }}
                        sx={{
                        width: {xs: '100%', sm: '100%', md: '100%', lg:'100%'},
                        "& .MuiInputBase-root": { 
                            height : {xs: '36px', sm: '36px', md: '32px', lg: '32px'}, 
                            fontSize: {md: '1rem', lg: '1rem' } ,
                            borderRadius: {xs:3, sm:3, md: 2.25, lg: 2.25 },
                            backgroundColor: '#F5F5F5',
                            border: '0'
                        }, 
                        "& .MuiOutlinedInput-notchedOutline": {
                            border: "none", // Removes the border completely
                        },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "none", 
                        },
                    }}/>):(<Box sx={{
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
                    </Box>)}
                    {!!!isSearching && (<Button onClick={()=>{
                        setIsSearching(true)
                    }} 
                    sx={{
                        position: 'absolute',
                        right: {xs: 0.5, sm: 1, md: 2, lg: 2},
                        zIndex: 1000,
                        alignItems: 'center',
                        height: {xs: 48, sm: 48, md: 40, lg: 40},
                        width: {xs: 48, sm: 48, md: 40, lg: 40},
                        minWidth: {xs: 48, sm: 48, md: 40, lg: 40},
                        backgroundColor: '#000000',
                        borderRadius: 2.7,
                    }}>
                        <Search sx={{
                            fontSize: '1rem',
                            textAlign: 'center',
                        }}/>
                    </Button>)}
                </Box>
                {issueData.map((issueDetail)=>(
                    <Box key={issueDetail.issue_id}
                     sx={{
                        width: '100%',
                        height: '65px',
                        backgroundColor: '#ffffff',
                        borderBottom: '3px solid #000000'
                    }}>
                        <Box 
                            sx={{ 
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '60px', 
                            height: { xs: '65px', sm: '65px', md: '65px', lg: '65px'}, 
                            bgcolor: 'transparent', 
                            mb: 1,
                            objectFit: 'contain',
                        }}>
                            <BookmarkAddRounded sx={{ fontSize: '38px'}}/>
                        </Box>
                    </Box>
                ))}
                <Box 
                     sx={{
                        display: 'flex',
                        width: '100%',
                        height: '65px',
                        backgroundColor: '#ffffff',
                        borderBottom: '3px solid #000000'
                    }}>
                        <Box 
                            sx={{ 
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '60px', 
                            height: { xs: '65px', sm: '65px', md: '65px', lg: '65px'}, 
                            bgcolor: 'transparent', 
                            mb: 1,
                            objectFit: 'contain',
                        }}>
                            <BookmarkAddRounded sx={{ fontSize: '38px'}}/>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Box
                            sx={{ 
                                fontWeight: 'bold', 
                                fontSize: {xs: '1rem', sm: '1rem', md: '0.9rem', lg: '0.9rem'},
                                ml: 0.5,
                                color: '#27CF54',
                                overflow: 'hidden',
                            }}>
                                One Piece
                            </Box>
                            <Box
                            sx={{  
                                fontSize: {xs: '1rem', sm: '1rem', md: '0.8rem', lg: '0.8rem'},
                                ml: 0.5,
                                color: '#000000',
                                overflow: 'hidden',
                            }}>
                                One Piece
                            </Box>
                        </Box>
                    </Box>
            </DialogContent>
        </Box>
        </Dialog>
    )
}
export default HistoryDialog