import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './routes/router.jsx'
import { RouterProvider } from 'react-router'
import { ToastContainer } from 'react-toastify'
import AuthProvider from './provider/AuthProvider.jsx'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ToastContainer position="top-right" />
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>,
)
