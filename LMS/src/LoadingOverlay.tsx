import { Box, CircularProgress } from '@mui/material';

interface LoadingOverlayProps {
  open: boolean;
}

const LoadingOverlay = ({ open }: LoadingOverlayProps) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
      }}
    >
      <CircularProgress size={48} sx={{ color: '#27CF54' }} />
    </Box>
  );
};

export default LoadingOverlay;
