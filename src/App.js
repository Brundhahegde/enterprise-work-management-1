import React, { useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppRoutes from "./AppRoutes"; // or your main routes/layout

function App() {
  const [mode, setMode] = useState("light");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Add a theme toggle wherever you want (e.g., in AppBar): */}
      <AppRoutes setMode={setMode} mode={mode} />
    </ThemeProvider>
  );
}

export default App;
