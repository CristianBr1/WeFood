import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = ({ text = "Carregando..." }) => (
  <Box
    sx={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f3f4f6",
      gap: 2,
    }}
  >
    <CircularProgress />
    {text && (
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    )}
  </Box>
);

export default Loading;
