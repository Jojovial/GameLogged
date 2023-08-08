
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkAllEntries, thunkDeleteEntry, thunkEditEntry} from '../../store/entryReducer';

import './Home.css';
import EntryModal from '../EntryModal/EntryModal';
import EditEntryModal from '../EditEntryModal/EditEntryModal';
import OpenModalButton from '../OpenModalButton';
import DeleteEntryModal from '../DeleteEntryModal/DeleteEntryModal';


const Home = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const allEntries = useSelector((state) => state.entries.allEntries.entries);
    console.log('All Entries Use Selector', allEntries)
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 5;
    const [editingId, setEntryBeingEdited] = useState(null);
    const [selectedEntryData, setSelectedEntryData] = useState(null);

    useEffect(() => {
      dispatch(thunkAllEntries())
          .then(() => setLoading(false))
          .catch((err) => {
              setLoading(false);
              setError(err.message);
          });
  }, [dispatch, editingId, currentPage]);


    if (loading) {
      return <p>Loading...</p>;
    }


    if(error) {
        return <p>Error: {error}</p>
    }

    const handleEditEntry = (entryId) => {
      setEntryBeingEdited(entryId);
      const selectedEntry = allEntries.find((entry) => entry.id === entryId);
      setSelectedEntryData(selectedEntry);
    };





    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = allEntries.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    }

    const handleDeleteEntry = async (entryId) => {
      const entry = allEntries.find((entry) => entry.id === entryId);

      if (!entry) {
        console.error('Entry not found');
        return;
      }

      if (window.confirm('Are you sure you want to delete this entry?')) {
        try {

          await dispatch(thunkDeleteEntry(entry.id));
        } catch (error) {
          console.error('Error deleting entry or associated data:', error);
        }
      }
    };
    return (
      <div className="home-container">
      <h2>Home</h2>
      <div className="home-wrapper">
        <div className="home-entries">
          <OpenModalButton
            modalComponent={<EntryModal onClose={() => console.log('Entry modal closed')} />}
            buttonText="New Entry!"
          />
          <h2>Entry Stuff Goes Here</h2>
          {currentEntries.length === 0 ? (
            <div className="entries-item-placeholder">
              <p>No entries found.</p>
            </div>
          ) : (
            currentEntries.map((entry) => (
              <div key={entry.id} className="entries-item">
                {entry.id === editingId ? (
                  <div>
                    <EditEntryModal
        selectedEntryData={selectedEntryData}
        onSubmit={async (updatedEntry) => {
          await dispatch(thunkEditEntry(updatedEntry));
          setEntryBeingEdited(null);
          setSelectedEntryData(null);
        }}
        onCancel={() => {
          setEntryBeingEdited(null);
          setSelectedEntryData(null);
        }}
      />
                  </div>
                ) : (
                  <div>
                    {/* Entry details */}
                    <h3>{entry.game_name || 'No Game Name'}</h3>
                    <p>System: {entry.system || 'No System Available'}</p>
                    <p>Region: {entry.region || 'No Region Available'}</p>
                    <p>Progress: {entry.progress}</p>
                    <p>Progress Note: {entry.progress_note}</p>
                    <p>Now Playing: {entry.is_now_playing ? 'Yes' : 'No'}</p>
                    <p>Wishlist: {entry.wishlist ? 'Yes' : 'No'}</p>
                    {entry.rating !== null ? <p>Rating: {entry.rating}</p> : <p>'No rating available.</p>}
                    {entry.review_text !== '' ? <p>Review: {entry.review_text}</p> : <p>No review available.</p>}
                    <button onClick={() => handleEditEntry(entry.id)}>Edit</button>
                    <button onClick={() => handleDeleteEntry(entry.id)}>Delete</button>

                    {/* ... (entry details rendering) */}
                  </div>
                )}
              </div>
            ))
          )}
            {/* Pagination controls */}
            <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>{currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={indexOfLastEntry >= allEntries.length}
            >
              Next
            </button>
            </div>
            </div>
            <div className="home-memory-card">
              <h2>Memory-Card Stuff Goes Here</h2>
            </div>
            <div className="home-dialogue-box">
              <h2>Dialogue Box Stuff Goes Here</h2>
            </div>
          </div>
          {deletingEntryId && (
        <DeleteEntryModal
          entryId={deletingEntryId}
          onDelete={async (entryId) => {
            await dispatch(thunkDeleteEntry(entryId));
            setDeletingEntryId(null);
          }}
          onCancel={() => setDeletingEntryId(null)} 
        />
      )}
    </div>
  );

};

export default Home;
