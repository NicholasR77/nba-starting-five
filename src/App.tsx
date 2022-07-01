import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import Home from './views/Home';
import Compositions from './views/Compositions';

function App() {
    return (
        <BrowserRouter>
            <div className='App'>
                <Routes>
                    <Route path='/' element={<Home />}></Route>
                    <Route path='/compositions' element={<Compositions />}></Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
