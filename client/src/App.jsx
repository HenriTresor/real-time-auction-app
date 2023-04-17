import React, { useState, useContext } from "react"
import Header from "./components/Header"
import Aside from "./components/Aside"
import { Routes, Route } from 'react-router-dom'
import Dashboard from "./pages/Dashboard"
import AvailableAuctions from "./pages/AvailableAuctions"
import AuctionContext from "./context/Auctions"
import SingleAuction from "./pages/SingleAuction"
import Signup from "./pages/Signup"
import AuthProvider from "./context/AuthProvider"
import Login from "./pages/Login"
import NewAuction from "./pages/NewAuction"

function App() {

  let [isAsideActive, setIsAsideActive] = useState(false)

  return (
    <>
      <AuthProvider>
        <Header setIsAsideActive={setIsAsideActive} isAsideActive={isAsideActive} />
        {isAsideActive && <Aside setIsAsideActive={setIsAsideActive} />}
      </AuthProvider>
      <Routes>
        <Route path="/" element={
          <>
            <AuthProvider>
              <AuctionContext>
                <Dashboard />
              </AuctionContext>
            </AuthProvider>
          </>
        } />
        <Route path="/auctions" element={

          <>
            <AuctionContext>
              <AvailableAuctions />
            </AuctionContext>
          </>
        } />
        <Route path="/auctions/auction/:id" element={

          <>
            <AuctionContext>
              <AuthProvider>
                <SingleAuction />
              </AuthProvider>
            </AuctionContext>
          </>
        } />

        <Route path='/signup' element={

          <AuthProvider>
            <Signup />
          </AuthProvider>
        } />
        <Route path='/login' element={

          <AuthProvider>
            <Login />
          </AuthProvider>
        } />

        <Route path="new-auction" element={
          <AuthProvider>
            <AuctionContext>
              <NewAuction />
            </AuctionContext>
          </AuthProvider>

        } />
      </Routes>
    </>
  )
}

export default App
