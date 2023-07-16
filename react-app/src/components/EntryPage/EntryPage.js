import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './EntryPage.css';


const EntryPage = () => {
    const dispatch = useDispatch();

    return (
        <div className="entry-container">
            <h2>Dummy Text </h2>
            <div className="entry">

            </div>
        </div>
    )
}

export default EntryPage;
