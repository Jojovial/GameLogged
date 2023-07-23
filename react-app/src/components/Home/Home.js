import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkAllEntries, thunkDeleteEntry } from '../../store/entryReducer';
import { thunkAllGames } from '../../store/gamesReducer';
import { thunkAllReviews } from '../../store/reviewsReducer';
import { deleteEntry } from '../../store/entryReducer';
import './Home.css';
import EntryModal from '../EntryModal/EntryModal';
import OpenModalButton from '../OpenModalButton';


const Home = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const allEntries = useSelector((state) => state.entries.allEntries.entries);
    console.log('All Entries Use Selector', allEntries)
    const allGames = useSelector((state) => state.games.allGames.games);
    console.log('All Games from home', allGames);
    const allReviews = useSelector((state) => state.reviews.allReviews);
    console.log('ALL REVIEWS from home', allReviews);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 5;
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [entryToEdit, setEntryToEdit] = useState(null);
    const [entryToDelete, setEntryToDelete] = useState(null);
    const reviewsArray = Object.values(allReviews);
    console.log('Reviews Array from home', reviewsArray);
    useEffect(() => {
      setLoading(true);
      setError(null);
      dispatch(thunkAllEntries())
        .then(() => {
          dispatch(thunkAllGames());
          dispatch(thunkAllReviews())
            .then(() => setLoading(false))
            .catch((err) => {
              setLoading(false);
              setError(err.message);
            });
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message);
        });
    }, [dispatch]);

      const handleOpenEditModal = (entry) => {
        setEntryToEdit(entry);
        setEditModalOpen(true)
      };

      const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setEntryToEdit(null);
      };

      const handleOpenDeleteModal = (entry) => {
        setEntryToDelete(entry);
        setDeleteModalOpen(true);
      };

      const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setEntryToDelete(null);
      };

      const handleDeleteEntry = async () => {
        if (entryToDelete) {
          try {
            await dispatch(thunkDeleteEntry(entryToDelete.id));
            setDeleteModalOpen(false);
            setEntryToDelete(null);
            dispatch(thunkAllEntries);
          } catch (error) {
            console.error('Error deleting entry:', error.message);
          }
        }
      };

      if (loading) {
        return <p>Loading...</p>;
      }


    if (!allGames) {
        return <p>Loading...</p>;
      }

    if(error) {
        return <p>Error: {error}</p>
    }

    if (!allReviews || Object.keys(allReviews).length === 0) {
      return <p>No reviews found.</p>;
    }

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = allEntries.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    }

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
            <p>No entries found.</p>
          ) : (
            currentEntries.map((entry) => {

                    const game = allGames.find((game) => game.id === entry.game_id);
                    const review = reviewsArray.find((r) => r.game_id === entry.id);



                    console.log('Entry:', entry);
                    console.log('All Reviews:', allReviews);
                    console.log('Review ID:', entry.id);
                    console.log('Review:', review);

                    return (
                      <div key={entry.id} className="entries-item">
                        <button onClick={() => handleOpenEditModal(entry)}>Edit</button>
                        <button onClick={() => handleOpenDeleteModal(entry)}>Delete</button>
                        <p>{console.log(entry, 'entry here?')}</p>

                        <h3>{game ? game.name : 'No Game Name'}</h3>
                        <p>System: {game.system}</p>
                        <p>Region : {game.region}</p>
                        <p>Progress: {entry.progress}</p>
                        <p>{console.log(entry.progress, 'entry progress??')}</p>
                        <p>Progress Note: {entry.progress_note}</p>
                        <p>{console.log(entry.progress_note, 'entry progress note??')}</p>
                        <p>Now Playing: {entry.is_now_playing ? 'Yes' : 'No'}</p>
                        <p>Wishlist: {entry.wishlist ? 'Yes' : 'No'}</p>
                        {review && typeof review === 'object' ? (
                  <>
                    {review.rating !== null ? (
                      <p>Rating: {review.rating}</p>
                    ) : (
                      <p>No rating available.</p>
                    )}
                    {review.review_text.trim() !== '' ? (
                      <p>Review: {review.review_text}</p>
                    ) : (
                      <p>No review available.</p>
                    )}
                  </>
                ) : (
                  <p>No review available for this entry.</p>
                )}
                      </div>
                    );
                  })
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
           {/* Modal for editing an entry */}
           {editModalOpen && ( 
      <EntryModal
        onClose={handleCloseEditModal}
        editMode={!!entryToEdit}
        initialFormData={entryToEdit}
      />
    )}
       {deleteModalOpen && entryToDelete && (
        <div className="delete-modal">
          <h3>Are you sure you want to delete this entry?</h3>
          <button onClick={handleDeleteEntry}>Delete</button>
          <button onClick={handleCloseDeleteModal}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Home;
