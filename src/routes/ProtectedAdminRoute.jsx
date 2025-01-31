import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedAdminRoute = ({children}) => {
    const isAdmin = localStorage.getItem('login_admin')
    if(!isAdmin){
        return <Navigate to='/admin_login'/>
    }
  return children
}

export default ProtectedAdminRoute