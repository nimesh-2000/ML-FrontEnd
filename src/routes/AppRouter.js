import React from 'react';
import { Routes, Route } from "react-router-dom";
import GetFeedBackFrom from '../GetFeedBackFrom';
import AdminFeedbackAnalysis from '../AdminFeedbackAnalysis';

export const AppRouter = () => {
  return (
    <>   
            <Routes>
               <Route exact path="/" element={<GetFeedBackFrom/>}/>
               <Route path="/admin" element={<AdminFeedbackAnalysis/>}/>
            </Routes>
        </>
  );
};

