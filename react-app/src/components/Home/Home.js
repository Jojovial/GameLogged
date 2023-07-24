import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkAllEntries, thunkDeleteEntry, thunkEditEntry } from '../../store/entryReducer';
import { thunkAllGames, thunkDeleteGame } from '../../store/gamesReducer';
import { thunkAllReviews, thunkDeleteReview, thunkDeleteReviewsForGame } from '../../store/reviewsReducer';
import './Home.css';
import EntryModal from '../EntryModal/EntryModal';
import OpenModalButton from '../OpenModalButton';
import EntryForm from '../EntryForm/EntryForm';

const Home = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const allEntries = useSelector((state) => state.entries.allEntries.entries);
  console.log('entries for review', allEntries);
  const allGames = useSelector((state) => state.games.allGames.games);
  console.log('games for review', allGames);
  const allReviews = useSelector((state) => state.reviews.allReviews?.reviews);
  console.log('reviews', allReviews);

  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [editingId, setEntryBeingEdited] = useState(null);
  const [currentEntries, setCurrentEntries] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      dispatch(thunkAllEntries()),
      dispatch(thunkAllGames()),
      dispatch(thunkAllReviews()),
    ])
    .then(() => {
      setLoading(false);
    })
    .catch((err) => {
      setLoading(false);
      setError(err.message);
    });
  }, [dispatch, shouldRefetch, currentPage]);

  const handleEditEntry = (entryId) => {
    setEntryBeingEdited(entryId);
  };



  const handleDeleteEntry = (entryId) => {
    const entry = allEntries.find((entry) => entry.id === entryId);

    if (!entry) {
      console.error('Entry not found');
      return;
    }

    if (window.confirm('Are you sure you want to delete this entry?')) {
      // First, delete the entry using the thunkDeleteEntry thunk
      dispatch(thunkDeleteEntry(entry.id))
        .then(() => {
          // Find the game associated with the entry
          const game = allGames.find((game) => game.id === entry.game_id);

          if (game) {
            // If the game is found, delete the game and its reviews using the thunkDeleteGame and thunkDeleteReview thunks
            dispatch(thunkDeleteGame(game.id))
              .then(() => {
                dispatch(thunkDeleteReview(game.id))
                  .then(() => {
                    // All deletions were successful, you can now trigger a re-fetch of data
                    setShouldRefetch(!shouldRefetch);
                  })
                  .catch((error) => {
                    console.error('Error deleting review:', error);
                  });
              })
              .catch((error) => {
                console.error('Error deleting game:', error);
              });
          } else {
            // No associated game found, trigger a re-fetch of data
            setShouldRefetch(!shouldRefetch);
          }
        })
        .catch((error) => {
          console.error('Error deleting entry:', error);
        });
    }
  };


  const findEntryReview = (gameId) => {
    if (!allReviews || allReviews.length === 0) {
      return null;
    }

    // Find the corresponding review data from allReviews based on the gameId
    const review = allReviews.find((review) => review.game_id === gameId);
    return review || null;
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  useEffect(() => {
    // Calculate the currentEntries when allEntries is available and has data
    if (allEntries && allEntries.length > 0) {

      setCurrentEntries(allEntries.slice(indexOfFirstEntry, indexOfLastEntry));
    }
  }, [currentPage, allEntries]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="home-container">
      <h2>Home</h2>
      <div className="home-wrapper">
        <div className="home-entries">
          <OpenModalButton
            modalComponent={
              <EntryModal
                onClose={() => {
                  console.log('Entry modal closed');
                  setShouldRefetch(!shouldRefetch);
                }}
              />
            }
            buttonText="New Entry!"
          />
          <h2>Entry Stuff Goes Here</h2>
          {currentEntries.length === 0 ? (
            <div className="entries-item-placeholder">
              <p>No entries found.</p>
            </div>
          ) : (
            currentEntries.map((entry) => {
              const game = allGames.find((game) => game.id === entry?.game_id);
              const reviewsForEntry = allReviews.filter((review) => review.game_id === entry?.game_id);
              // Assuming you only want to display one review per entry, you can use reviewsForEntry[0] to get the first review
              const review = reviewsForEntry[0];
              const hasReview = review && typeof review === 'object';


              return (
                <div key={entry.id} className="entries-item">
                  <button
                    onClick={() => {
                      handleEditEntry(entry.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
  onClick={() => handleDeleteEntry(entry.id)}
>
  Delete
</button>
                  <h3>{game ? game.name : 'No Game Name'}</h3>
                  {game ? (
                    <>
                      <p>System: {game.system || 'No System Available'}</p>
                      <p>Region: {game.region || 'No Region Available'}</p>
                    </>
                  ) : (
                    <p>Loading game information...</p>
                  )}
                  <p>Progress: {entry.progress}</p>
                  <p>Progress Note: {entry.progress_note}</p>
                  <p>Now Playing: {entry.is_now_playing ? 'Yes' : 'No'}</p>
                  <p>Wishlist: {entry.wishlist ? 'Yes' : 'No'}</p>
                  {hasReview ? (
                    <>
                      <p>Rating: {review.rating}</p>
                      <p>Review: {review.review_text || 'No review available.'}</p>
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
    </div>
  );
};

export default Home;
