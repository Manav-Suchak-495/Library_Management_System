import { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import Logo_Black from './assets/Logo_Black_White.png';
import { LocalLibraryRounded} from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
interface Header_Interface {
    handleAddDialog: () => void;
    fetchData: ({ queryFilter }: { queryFilter: string }) => void
}
function Header( { handleAddDialog, fetchData } : Header_Interface ){
    const [isAndroid, setIsAndroid] = useState<boolean>(false);
    const [search, setSearch] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const assets = {
          Logo_Black: Logo_Black,
      };

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor;
        if (/android|iphone|ipad|ipod/i.test(userAgent)) {
            setIsAndroid(true);
        }
    }, []);

    useEffect(() =>{
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        axios.post(`${apiUrl}/isAdmin`,{Token: sessionStorage.getItem('Token')}).then((response) =>{
            setIsAdmin(response.data.isAdmin)
        })
        .catch(() => {
            setIsAdmin(false)
        })
    },[])

    return(
        <Box
        sx={{
            width: '100%',
            height: {xs: '64px', sm: '65px', md: '65px', lg: '70px'},
            //borderRadius: {xs: 0, sm: 0, md: 4, lg: 4},
            bgcolor: '#27CF54',
            gap: 0,
            display: 'flex',
            position: 'sticky',
            top: 0,
            zIndex: '1100',
            boxSizing: 'border-box',
            outline: 'none',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: {xs:'4px solid', sm:'4px solid', md:' 4px solid', lg:'5px solid'},
            pl: {xs: 0, sm: 0, md: 0, lg: 0},
            pr: {xs: 0, sm: 0, md: 2, lg: 3},
            mb: 4,  
            borderColor: '#000000 !important',
            }}>
            <Box component="img"
            src={assets.Logo_Black}
            sx={{
                height: '100%',
                width: 'auto',
                objectFit: 'contain'
            }}/>
            <TextField variant='outlined' 
                placeholder="Search" 
                value={search}
                onChange={(e)=> {
                    setSearch(e.target.value)
                    fetchData({"queryFilter":e.target.value})
                }}
                slotProps={{
                input: {
                    startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{
                        color: '#000000',
                        fontSize: '1.2rem'
                        }}/>
                    </InputAdornment>
                    ),
                },
                }}
                sx={{
                ml: {xs: 0, sm: 0, md: 2, lg:2},
                mr: {xs: 0, sm: 0, md: 0, lg:0},
                width: {xs: '100%', sm: '100%', md: '55%', lg:'55%'},
                "& .MuiInputBase-root": { 
                        height : {xs: '40px', sm: '40px', md: '34px', lg: '38px'}, 
                        fontSize: {md: '0.9rem', lg: '0.9rem' } ,
                        borderRadius: {xs:3, sm:3, md: 3, lg: 3 },
                        backgroundColor: '#FFFFFF',
                        border: '0'
                        }, 
            }}
            />
            <Box sx={{
                display: "flex",
                flexDirection: 'row'
            }}>
                {(!isAndroid && isAdmin &&
                <Button onClick={handleAddDialog} sx={{
                height: {xs:'60px', sm: '60px', md: '40px', lg:'45px'},
                width: {xs:'64px', sm: '64px', md: '40px', lg:'45px'},
                aspectRatio: '1/1',
                textAlign: 'right',
                minWidth: 0,
                p: 1,
                borderLeft: '0',
                color: '#000000',
                borderRadius: {xs: 0, sm: 0, md: 2, lg:2},
                backgroundColor: {xs: 'primary.main', sm: 'primary.main', md: '#FFFFFF', lg:'#FFFFFF'},
                fontSize: '0.9rem',
                fontStyle: 'Bold',         
                }}>
                <AddIcon sx={{ stroke: "#000000", strokeWidth: 0.18}}/>
                </Button>)}
                <Button sx={{
                height: {xs:'60px', sm: '60px', md: '40px', lg:'45px'},
                width: {xs:'64px', sm: '64px', md: '40px', lg:'45px'},
                aspectRatio: '1/1',
                textAlign: 'right',
                minWidth: 0,
                p: 1,
                borderLeft: '0',
                ml:{xs: 0, sm: 0, md: 2, lg: 2},
                color: '#000000',
                borderRadius: {xs: 0, sm: 0, md: 2, lg:2},
                backgroundColor: {xs: 'primary.main', sm: 'primary.main', md: '#FFFFFF', lg:'#FFFFFF'},
                fontSize: '0.9rem',
                fontStyle: 'Bold',         
                }}>
                    <LocalLibraryRounded/>
                </Button>
            </Box>
        </Box>
    )
}
export default Header;