import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkAllEntries } from '../../store/entryReducer';
import './EntryPage.css';


const EntryPage = () => {
    const dispatch = useDispatch();
    const allEntries = useSelector((state) => state.entries.allEntries.entries);

    useEffect(() => {
        dispatch(thunkAllEntries());
    }, [dispatch]);
    return (
        <div className="entry-container">
        <h2>All Entries</h2>
        <div className="entry-list">
            {allEntries.map((entry) => (
                <div key={entry.id} className="entry">
                    <h3>{entry.game_name || 'No Game Name'}</h3>
                    <p>System: {entry.system || 'No System Available'}</p>
                    <p>Region: {entry.region || 'No Region Available'}</p>
                    {/* Add other entry information */}
                </div>
            ))}
        </div>
    </div>
);
}

export default EntryPage;
