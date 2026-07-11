import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import Logo_Black from './assets/Logo_Green_Black_White_Back.png';
import { ArrowBackIos, ArrowBackIosNewRounded, AutoStoriesRounded, BookmarkAdd, BookmarkAddedRounded, BookmarkAddRounded, BookmarkRemoveOutlined, BookOnlineRounded, ClassOutlined, CollectionsBookmarkOutlined, CollectionsBookmarkRounded, LibraryAddCheckRounded, MoveToInboxRounded, Search} from "@mui/icons-material";
import axios from "axios";

interface HistoryBookDialogInterface{
    open: boolean;
    onClose: () => void;
    user_email: string;
    isAdmin: boolean;
    issueData: IssueDataInterface[];
    fetchIssueData: () => void;
    fetchBooks: () => void;
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

const HistoryDialog = ({ open, onClose , user_email, isAdmin, issueData, fetchBooks, fetchIssueData }: HistoryBookDialogInterface)=>{
    const[search, setSearch] = useState('')
    const [isSearching, setIsSearching] = useState(false);
    const [issueId, setIssueId] = useState('')
    const [issueIsbn, setIssueIsbn] = useState('')
    const [issueTitle, setIssueTitle] = useState('')
    const [issueTo, setIssueTo] = useState('')
    const [issueEmail, setIssueEmail] = useState('')
    const [issueStatus, setIssueStatus] = useState('')
    const [issueBy, setIssueBy] = useState('')
    const [issueAt, setIssueAt] = useState(Date)
    const [returnBy, setReturnBy] = useState('')
    const [returnAt, setReturnAt] = useState(Date)

    const [isLoading, setIsLoading] = useState(Boolean(open));
    const [isIssueDetailsDialog, setIsIssueDetailsDialog] = useState(false)

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
    const handleIssueUpdate = async ()=>{
        if(issueStatus != '' && (issueStatus == 'Pending' || issueStatus == 'Issued')){
            setIsLoading(true);
            var status = ''
            if(issueStatus == 'Issued'){
                status = 'Returned';
            }
            else if(issueStatus == 'Pending'){
                status = 'Issued'

            }
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
            await axios.post(`${apiUrl}/issue/update`, {'issue_status': issueStatus, 'issue_id': issueId, 'admin': user_email, 'issue_isbn': issueIsbn}).then((response)=>{
                if(response.data.update){
                    alert("Issue update successfull!");
                    fetchBooks()
                }    
            }).catch((err)=>{
                console.error("Update failed", err);
            }).finally(()=>{
                    setIsLoading(false);
                    setIsIssueDetailsDialog(false)
                    fetchIssueData()
            })
        }
        else{
            setIsIssueDetailsDialog(false)
        }
    }

    return(
        <>
            <Dialog open={open} 
            onClose={isLoading ? undefined : onClose} 
            fullWidth maxWidth={false} 
            disableRestoreFocus
            slotProps={{
                paper: {
                    sx: {
                        minHeight: '0',
                        maxHeight: '100dvh',
                        width: {xs: '100dvw', sm: '387px', md: '297px', lg: '324px'}, 
                        maxWidth: 'none',
                        margin: 'auto',
                        borderRadius: {xs: 0, sm: 2.7},
                        backgroundColor: '#FFFFFF',
                        overflow: 'hidden'
                    }
                }
            }}>
            <DialogTitle sx={{
                display: "flex",
                    flexDirection: "row",
                    height: {xs: 48, sm: 48, md: 40, lg: 40},
                    pl: '0px',
                    pb: '0px',
                    pr: isSearching? '8px': '0px',
                    pt: isSearching? '9px': '0px',
                    borderBottom: isSearching ? '2.7px solid #000000' : 'none',
                    backgroundColor: isSearching ? '#FFFFFF':'#000000',
                    width: '100%',
                    flexShrink: 0,
                    position: 'relative',
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
                            position: isSearching ? 'relative':'absolute',
                            zIndex: 1000,
                            alignItems: 'center',
                            height: isSearching? {xs: 40, sm: 40, md: 32, lg: 32} : {xs: 48, sm: 48, md: 40, lg: 40},
                            width: isSearching ? {xs: 40, sm: 40, md: 32, lg: 32} : {xs: 48, sm: 48, md: 40, lg: 40},
                            pr: 1,
                            minWidth: {xs: 40, sm: 40, md: 36, lg: 36},
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
                                height : {xs: '40px', sm: '40px', md: '32px', lg: '32px'}, 
                                fontSize: {md: '1rem', lg: '1rem' } ,
                                borderRadius: {xs:2.5, sm:2.5, md: 2.25, lg: 2.25 },
                                backgroundColor: '#F5F5F5',
                                border: '0',
                                mr: '10px'
                            }, 
                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "none", // Removes the border completely
                            },
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                border: "none", 
                            },
                        }}/>):(<Typography sx={{
                            height: {xs: 48, sm: 48, md: 40, lg: 40},
                            width: '100%',
                            textAlign: 'center',
                            alignContent: 'center',
                            position: 'sticky',
                            top: 0,
                            zIndex: 2,
                            backgroundColor: '#000000',
                            color: '#ffffff',
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: {xs: 0, sm: 2.7},
                            fontSize: {xs: '1.1rem', sm: '1.1rem', md: '1.1rem', lg: '1.1rem'}
                        }}>
                            History
                        </Typography>)}
                        {!!!isSearching && (<Box sx={{
                            
                            position: 'absolute',
                            right: {xs: 0.5, sm: 1, md: 2, lg: 2},
                            top: 0,
                            zIndex: 1000,
                        }}><Button onClick={()=>{
                            setIsSearching(true)
                        }} 
                        sx={{
                            position: 'sticky',
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
                        </Button></Box>)}
            </DialogTitle>
            <DialogContent 
                sx={{ padding: 0, 
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: {xs: '100dvh',sm: '537px', md:'432px', lg: '487px'},
                    maxHeight: {xs: '100dvh',sm: '537px', md:'432px', lg: '487px'},
                    width: {xs: '100dvw', sm: '387px', md: '297px', lg: '324px'}, 
                    maxWidth: 'none',
            }}>
                        {issueData.map((issueDetail)=>(
                            <Box key={issueDetail.issue_id}
                            onClick={()=>{
                                const issueAtDate = (issueAt || issueAt === '') ? '' : new Date(issueDetail.issue_at)
                                const issueAtIst = (issueAtDate && !isNaN(issueAtDate.getTime())) ? issueAtDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false}): '';
                                const returnAtDate = (issueAt || issueAt === '') ? '' : new Date(issueDetail.issue_at)
                                const returnAtIst = (issueAtDate && !isNaN(issueAtDate.getTime())) ? issueAtDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false}): '';
                                setIssueId(issueDetail.issue_id)
                                setIssueIsbn(issueDetail.issue_isbn)
                                setIssueTitle(issueDetail.issue_title)
                                setIssueEmail(issueDetail.issue_email)
                                setIssueTo(issueDetail.issue_to)
                                setIssueBy(issueDetail.issue_by)
                                setIssueAt(issueAtIst)
                                setReturnBy(issueDetail.return_by)
                                setReturnAt(returnAtIst)
                                setIssueStatus(issueDetail.issue_status)
                                setIsIssueDetailsDialog(true)
                            }}
                            sx={{
                                display: 'flex',
                                width: '100%',
                                height: {xs: '67.5px', sm: '65px',md:'60px', lg: '67.5px'},
                                backgroundColor: '#FFFFFF',
                                borderBottom: '2.5px solid #000000',
                                mt: 0
                            }}>
                                <Box 
                                    sx={{ 
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: {xs: '47px', sm: '47px',md:'45px', lg: '50px'},
                                    height: { xs: '47px', sm: '47px', md: '45px', lg: '50px'}, 
                                    bgcolor: '#F7FFF9', 
                                    objectFit: 'contain',
                                    boxShadow: '0px 0px 4px rgba(0,0,0,0.18)',
                                    borderRadius: 2.7,
                                    mt: {xs: '10px', sm: '8.5px',md: '7px', lg: '8.5px'},
                                    ml: {xs: '12px', sm: '10px',md: '8px', lg: '10px'}
                                }}>
                                    <BookmarkAddRounded sx={{ fontSize: {xs:'28px',sm: '28px',md: '26px', lg: '30px'}}}/>
                                </Box>
                                
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <Typography
                                    sx={{ 
                                        height: {xs:'18px', sm: '18px',md: '16px',lg: '17px'},
                                        lineHeight: 1,
                                        fontWeight: 'bold', 
                                        fontSize: {xs: '1rem', sm: '1rem', md: '0.75rem', lg: '0.85rem'},
                                        ml: 1.25,
                                        mt: {xs: 2.09, sm: 1.75, md: 1.75, lg:2.05},
                                        color: '#27CF54',
                                        overflow: 'hidden',
                                    }}>
                                        {issueDetail.issue_title}
                                    </Typography>
                                    <Typography
                                    sx={{  
                                        height: {xs:'14px', sm: '14px',md: '12px',lg: '12.5px'},
                                        lineHeight: 1,
                                        fontSize: {xs: '0.85rem', sm: '0.75rem', md: '0.6rem', lg: '0.67rem'},
                                        fontWeight: '465',
                                        ml: 1.25,
                                        mt: {xs: 0.27, sm: 0.25, md: 0.2, lg:0.4},
                                        color: '#000000',
                                        overflow: 'hidden',
                                    }}>
                                        {issueDetail.issue_to}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                </DialogContent>
            </Dialog>
            {isIssueDetailsDialog && 
            (<Dialog open={isIssueDetailsDialog} 
                onClose={()=>setIsIssueDetailsDialog(false)} 
                fullWidth maxWidth={false} 
                disableRestoreFocus
                slotProps={{
                    paper: {
                        sx: {
                            minHeight: {xs: '255px',sm: '225px', md:'220px', lg: '240px'},
                            width: {xs: '360px', sm: '297px', md: '272px', lg: '297px'}, 
                            maxWidth: 'calc(100% - 64px)',
                            margin: 'auto',
                            borderRadius: 2.7,
                        }
                    }
                }}>
        
            {/*{isLoading && isIssueDetailsDialog && (
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
            )}*/}
            <DialogContent sx={{
                py: '13px',
                px: '13px'
            }}>
                <Box sx={{
                    width: '100%',
                    textAlign: 'center',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    py: {xs: 0.5, sm: 0.7},
                    mb: 1,
                    borderRadius: 2,
                    fontSize: {xs: '1rem', sm: '0.8rem', md: '0.8rem', lg: '0.8rem'}
                }}>
                    {issueId}
                </Box>
                
                <Box sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection:'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    
                }}>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        mt: 0.5,
                    }}>
                        <Typography sx={{
                            fontSize: {xs: '0.9rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem'},
                            pl: 1,
                        }}>
                            Book Isbn:
                        </Typography>
                        <Typography sx={{
                            fontWeight: 'bold',
                            fontSize: {xs: '0.9rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem'},
                            pr: 1,
                        }}> 
                            {issueIsbn}
                        </Typography>
                    </Box>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        mt: 0.15,
                    }}>
                        <Typography sx={{
                            fontSize: {xs: '0.9rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem'},
                            pl: 1,
                        }}>
                            Book Title:
                        </Typography>
                        <Typography sx={{
                            fontWeight: 'bold',
                            fontSize: {xs: '0.9rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem'},
                            pr: 1,
                        }}> 
                            {issueTitle}
                        </Typography>
                    </Box>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        mt: 0.15,
                    }}>
                        <Typography sx={{
                            fontSize: {xs: '0.9rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem'},
                            pl: 1,
                        }}>
                            Issued To:
                        </Typography>
                        <Typography sx={{
                            fontWeight: 'bold',
                            fontSize: {xs: '0.9rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem'},
                            pr: 1,
                        }}> 
                            {issueTo}
                        </Typography>
                    </Box>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        mt: 0.15,
                    }}>
                        <Typography sx={{
                            fontSize: {xs: '0.9rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem'},
                            pl: 1,
                        }}>
                            Status:
                        </Typography>
                        <Typography sx={{
                            fontWeight: 'bold',
                            fontSize: {xs: '0.9rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem'},
                            pr: 1,
                        }}> 
                            {issueStatus}
                        </Typography>
                    </Box>
                    
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        mt: 0.15,
                    }}>
                        <Typography sx={{
                            fontSize: {xs: '0.9rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem'},
                            pl: 1,
                        }}>
                            Issued By:
                        </Typography>
                        <Typography sx={{
                            fontWeight: 'bold',
                            fontSize: {xs: '0.9rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem'},
                            pr: 1,
                        }}> 
                            {issueBy}
                        </Typography>
                    </Box>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        mt: 0.15,
                    }}>
                        <Typography sx={{
                            fontSize: {xs: '0.9rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem'},
                            pl: 1,
                        }}>
                            Issued At:
                        </Typography>
                        <Typography sx={{
                            fontWeight: 'bold',
                            fontSize: {xs: '0.9rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem'},
                            pr: 1,
                        }}> 
                            {issueAt}
                        </Typography>
                    </Box>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        mt: 0.15,
                    }}>
                        <Typography sx={{
                            fontSize: {xs: '0.9rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem'},
                            pl: 1,
                        }}>
                            Returned To:
                        </Typography>
                        <Typography sx={{
                            fontWeight: 'Bold',
                            fontSize: {xs: '0.9rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem'},
                            pr: 1,
                        }}> 
                            {returnBy}
                        </Typography>
                    </Box>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        mt: 0.15,
                    }}>
                        <Typography sx={{
                            fontSize: {xs: '0.9rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem'},
                            pl: 1,
                        }}>
                            Returned At:
                        </Typography>
                        <Typography sx={{
                            fontWeight: 'Bold',
                            fontSize: {xs: '0.9rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem'},
                            pr: 1,
                        }}> 
                            {returnAt}
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
            
            <DialogActions sx={{
                py: '13px',
                px: '13px',
                mt: -0.75,
            }}>
                <Box sx={{
                    width:'100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <Button onClick={(e)=>{
                        setIsIssueDetailsDialog(false)
                    }} sx={{
                        width: '100%',
                        borderRadius: 1.8,
                        color: '#ffffff',
                        backgroundColor: '#000000',
                        mr: 1,
                        fontSize: {xs: '1rem', sm: '0.8rem', md: '0.8rem', lg: '0.8rem'}
                    }}>
                        Cancel
                    </Button>

                    <Button onClick={handleIssueUpdate}
                    sx={{
                        width: '100%',
                        borderRadius: 1.8,
                        color: '#000000',
                        backgroundColor: '#27CF54',
                        ml: 1,
                        fontSize: {xs: '1rem', sm: '0.8rem', md: '0.8rem', lg: '0.8rem'}
                    }}>
                        {isAdmin ? (issueStatus === 'Pending' ? "Issue" : issueStatus === 'Issued' ? "Return" : "Ok") : ("Ok")}
                    </Button>
                </Box>
            </DialogActions>
            </Dialog>)}
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
        </>
    )
}
export default HistoryDialog