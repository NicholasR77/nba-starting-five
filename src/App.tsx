import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import StartingFive from './views/StartingFive';
import Compositions from './views/Compositions';

function App() {
    return (
        <BrowserRouter>
            <div className='App'>
                <Routes>
                    <Route path='/' element={<StartingFive />}></Route>
                    <Route path='/compositions' element={<Compositions />}></Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
