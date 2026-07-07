import { Box, Typography } from "@mui/material";
import Logo_Black from './assets/Logo_Green_Black_White_Back.png'

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
function Home_CardLayout({bookData, email, fetchData, setIsBookDetailsOpen}:{bookData:  BookDataInterface[], email: string, fetchData: (querFilter:{ queryFilter: string }) => void, setIsBookDetailsOpen: (arg: boolean) => void}){
    
  const assets = {
        Logo_Black: Logo_Black,
    };
  return(
      <Box 
        sx={{
          width: '100%',
          maxWidth: '1743px',
          display: 'grid',
          gap: '24px',
          px: { xs: 0, sm: 2, md: 4, lg: 4 },
          boxSizing: 'border-box',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
        }}
      >
        {bookData.map((book) => (
          <Box
            key={book.book_isbn}
            onClick={() => {
              fetchData({queryFilter:book.book_isbn})
              setIsBookDetailsOpen(true);
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start', 
              width: '100%',
              height: '100%',
              bgcolor: '#ffffff',
              px: 1,
              pt: 0.9,
              borderRadius: 3,
              border: { xs: '0px solid #000000',
                sm: '0px solid #000000',
                md: '2px solid #000000',
                lg: '2px solid #000000'
              },
              boxSizing: 'border-box',
              boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
              }
            }}
          >
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
                <Box sx={{
                  textAlign: 'center',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  px: 0.7,
                  borderRadius: 2,
                  fontSize: {xs: '1rem', sm: '1rem', md: '0.8rem', lg: '0.8rem'}
                }}>
                  {book.book_category}
                </Box>
                <Box sx={{
                  height: 0,
                  textAlign: 'center',
                  backgroundColor: book.book_status === "Available" ? '#27FF54' : '#FF0000',
                  px: 0.73,
                  py: 0.75,
                  borderRadius: 6,
                }}/>
            </Box>
            <Box component='img'
              src={assets.Logo_Black}
              
              sx={{ 
                width: '100%', 
                height: { xs: '120px', sm: '155px', md: '165px', lg: '180px'}, 
                bgcolor: '#ffffff', 
                borderRadius: 1,
                mb: 1,
                objectFit: 'contain'
              }} 
            />
            <Box sx={{
              height: '54px',
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}>
              <Typography 
                sx={{ 
                  textAlign: 'center',
                  fontWeight: 'bold', 
                  fontSize: {xs: '1.25rem', sm: '1.25rem', md: '0.8rem', lg: '0.9rem'},
                  color: '#27CF54',
                  overflow: 'hidden',
                }}
              >
                {book.book_title}
              </Typography>
              
            </Box>
            <Box sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: "row",
              justifyContent: "flex-end",
              mb: 0.5,  
            }}>
              <Typography sx={{ fontWeight: 'bold',
                textAlign: 'right',
                fontSize: {xs: '1rem', sm: '1rem', md: '0.65rem', lg: '0.75rem'}, 
                color:"#000000",
                overflow: 'hidden',
                mr: 0.5
              }}>
                - {book.book_author}
              </Typography>
              
            </Box>
          </Box>
        ))}
        
      </Box>
  )
}
export default Home_CardLayout;