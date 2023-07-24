
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkAllEntries, thunkDeleteEntry, thunkEditEntry, thunkEditReview, thunkEditGame } from '../../store/entryReducer';
import { thunkAllGames, thunkDeleteGame } from '../../store/gamesReducer';
import { thunkAllReviews, thunkDeleteReview } from '../../store/reviewsReducer';
import { deleteEntry } from '../../store/entryReducer';
import './Home.css';
import EntryModal from '../EntryModal/EntryModal';
import OpenModalButton from '../OpenModalButton';
import EntryForm from '../EntryForm/EntryForm';


const Home = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const allEntries = useSelector((state) => state.entries.allEntries.entries);
    console.log('All Entries Use Selector', allEntries)
    const allGames = useSelector((state) => state.games.allGames.games);
    console.log('All Games from home', allGames);
    const allReviews = useSelector((state) => state.reviews.allReviews?.reviews);

    console.log('ALL REVIEWS from home', allReviews);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 5;
    const [shouldRefetch, setShouldRefetch] = useState(false);
    const [editingId, setEntryBeingEdited] = useState(null);
    const [reviewsLoaded, setReviewsLoaded] = useState(false);
    const [selectedEntryData, setSelectedEntryData] = useState(null);

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
          setReviewsLoaded(true);
          console.log("Data loaded, loading:", loading, "reviewsLoaded:", reviewsLoaded);
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message);
        });
      }, [dispatch, shouldRefetch, currentPage]);

    useEffect(() => {
      console.log("Data loaded2, loading:", loading, "reviewsLoaded:", reviewsLoaded);
    }, [loading, reviewsLoaded]);

    useEffect(() => {
      dispatch(thunkAllEntries());
    }, [dispatch, editingId]);


    if (loading || !reviewsLoaded) {
      return <p>Loading...</p>;
    }


    if (!allGames) {
        return <p>Loading...</p>;
      }

    if(error) {
        return <p>Error: {error}</p>
    }

    const handleEditEntry = (entryId) => {
      if (allEntries && allGames && allReviews) {
      setEntryBeingEdited(entryId);
      // Find the selected entry data from allEntries based on the entryId
      const selectedEntry = allEntries.find((entry) => entry.id === entryId);
      // Find the corresponding game data from allGames based on the game_id of the selected entry
      const selectedGame = allGames.find((game) => game.id === selectedEntry?.game_id);

      // Check if reviews are loaded before finding the corresponding review
      if (allReviews.length > 0) {
        // Find the corresponding review data from allReviews based on the game_id of the selected entry
        const selectedReview = allReviews.find((review) => review.game_id === selectedEntry?.game_id);

        // Combine the selected entry, game, and review data into a single object
        setSelectedEntryData({
          ...selectedEntry,
          ...selectedGame,
          ...selectedReview,
        });
      } else {
        setSelectedEntryData({
          ...selectedEntry,
          ...selectedGame
        });
      }
    };
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
          // First, delete the entry using the thunkDeleteEntry thunk
          await dispatch(thunkDeleteEntry(entry.id));

          // Find the game associated with the entry
          const game = allGames.find((game) => game.id === entry.game_id);

          if (game) {
            // If the game is found, delete the game and its reviews using the thunkDeleteGame and thunkDeleteReview thunks
            await Promise.all([
              dispatch(thunkDeleteGame(game.id)),
              dispatch(thunkDeleteReview(game.id)),
            ]);
          }

          // All deletions were successful, you can now trigger a re-fetch of data
          setShouldRefetch(!shouldRefetch);
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
            modalComponent={<EntryModal onClose={() => {console.log('Entry modal closed'); setShouldRefetch(!shouldRefetch);}} />}
            buttonText="New Entry!"
          />
              <h2>Entry Stuff Goes Here</h2>
              {currentEntries.length === 0 ? (
             <div className="entries-item-placeholder">
             <p>No entries found.</p>
           </div>
          ) : (
            currentEntries.map((entry) => {

              if (entry.id === editingId) {

                return (
                  <div key={entry.id}>
                    <EntryForm
                      initialFormData={selectedEntryData}
                      onSubmit={async (updatedEntry) => {
                        await dispatch(thunkEditEntry(updatedEntry));
                        setEntryBeingEdited(null); // Stop editing when the form is submitted.
                        setShouldRefetch(!shouldRefetch); // Trigger fetching again
                      }}

                      onCancel={() => setEntryBeingEdited(null)} // Stop editing when the form is cancelled.
                    />
                  </div>
                );
              } else {



                    const game = allGames.find((game) => game.id === entry?.game_id);
                    const review = allReviews.find((review) => review.game_id === entry?.game_id);
                    const hasReview = review && typeof review === 'object';




                    console.log('Entry:', entry);
                    console.log('All Reviews:', allReviews);
                    console.log('Review:', review);

                    return (
                      <div key={entry.id} className="entries-item">
                          <button
                onClick={async () => {
                  handleEditEntry(entry.id);
                  setShouldRefetch(!shouldRefetch); // Trigger fetching again
                }}
              >
                Edit
              </button>
              <button
  onClick={() => handleDeleteEntry(entry.id)}
>
  Delete
</button>
                        <p>{console.log(entry, 'entry here?')}</p>

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
                        <p>{console.log(entry.progress, 'entry progress??')}</p>
                        <p>Progress Note: {entry.progress_note}</p>
                        <p>{console.log(entry.progress_note, 'entry progress note??')}</p>
                        <p>Now Playing: {entry.is_now_playing ? 'Yes' : 'No'}</p>
                        <p>Wishlist: {entry.wishlist ? 'Yes' : 'No'}</p>
                        {hasReview ? (
                  <>
                    {review?.rating !== null ? (
                      <p>Rating: {review.rating}</p>
                    ) : (
                      <p>No rating available.</p>
                    )}
                    {review && review.review_text !== '' ? (
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
                    }
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
