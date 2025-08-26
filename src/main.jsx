import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
import TokenContextProvider from './Context/TokenContext.jsx'
import ThemeContextProvider from './Context/ThemeContext.jsx'
createRoot(document.getElementById('root')).render(
<TokenContextProvider>
<ThemeContextProvider>
  <StrictMode>
    <App />
  </StrictMode>
</ThemeContextProvider>
</TokenContextProvider>

)
