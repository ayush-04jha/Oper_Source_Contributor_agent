import React from "react";
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider,Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import LinkDrop from "./components/LinkDrop";
import AiChatBox from "./components/AiChatBox"
import Loading from "./components/Loading";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/pastelink" element={<LinkDrop/>}/>
        <Route path="/chatbox" element={<AiChatBox/>}/>
        <Route path="/loading/:jobId" element={<Loading />}/>
        </>
        
    )
)


createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router = {router}/>
    </React.StrictMode>
       
    
    
    
)
