import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PATH from './const'
import Home from './Pages/Home'
import Report from './Pages/Report'
import NoMatch from './Pages/NoMatch'
import AppLayout from './Components/AppLayout/AppLayout'
import {theme} from './Theme/Theme'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import React from 'react'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path={PATH.REPORT} element={<Report />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
