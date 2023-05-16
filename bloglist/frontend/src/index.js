import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { NotificationContextProvider } from './NotificationContext'
import { UserContextProvider } from './UserContext'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter as Router } from 'react-router-dom'
import { Container } from '@mui/material'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <Container>
    <Router>
      <QueryClientProvider client={queryClient}>
        <NotificationContextProvider>
          <UserContextProvider>
            <App />
          </UserContextProvider>
        </NotificationContextProvider>
      </QueryClientProvider>
    </Router>
  </Container>
)