import React from "react";
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider,Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import LinkDrop from "./components/LinkDrop";
import AiChatBox from "./components/AiChatBox"

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/pastelink" element={<LinkDrop/>}/>
        <Route path="/chatbox" element={<AiChatBox/>}/>
        </>
        
    )
)


createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router = {router}/>
    </React.StrictMode>
       
    
    
    
)
