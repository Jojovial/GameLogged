import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkAllEntries, thunkDeleteEntry, thunkEditEntry} from '../../store/entryReducer';

import './Home.css';
import EntryModal from '../EntryModal/EntryModal';
import OpenModalButton from '../OpenModalButton';
import DeleteEntryModal from '../DeleteEntryModal/DeleteEntryModal';
import EditEntryModal from '../EditEntryModal/EditEntryModal';

const Home = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const allEntries = useSelector((state) => state.entries.allEntries.entries);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;
  const [deletingEntryId, setDeletingEntryId] = useState(null);
  const [editingEntryId, setEditingEntryId] = useState(null);

  useEffect(() => {
    dispatch(thunkAllEntries())
      .then(() => setLoading(false))
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  }, [dispatch, currentPage]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = allEntries.slice(indexOfFirstEntry, indexOfLastEntry);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="home-container">
      <h2>Home</h2>
      <div className="home-wrapper">
        <div className="home-memory-card">
          <h2>Memory-Card Stuff Goes Here</h2>
        </div>
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
                  <OpenModalButton
                    modalComponent={
                      <EditEntryModal
                        selectedEntryData={entry}
                        onSubmit={async (updatedEntry) => {
                          setEditingEntryId(null);
                        }}
                        onCancel={() => setEditingEntryId(null)}
                      />
                    }
                    buttonText="Edit"
                  />
                   <OpenModalButton
                    modalComponent={
                      <DeleteEntryModal
                        entryId={entry.id}
                        onDelete={async (entryId) => {
                          setDeletingEntryId(null);
                        }}
                        onCancel={() => setDeletingEntryId(null)}
                      />
                    }
                    buttonText="Delete"
                    onButtonClick={() => setDeletingEntryId(entry.id)}
                  />
                  {/* ... (entry details rendering) */}
                </div>
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
        <div className="home-dialogue-box">
          <h2>Dialogue Box Stuff Goes Here</h2>
        </div>
      </div>
    </div>
  );
};

export default Home;
