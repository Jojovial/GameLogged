import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkAllEntries } from '../../store/entryReducer';
import { thunkAllGames } from '../../store/gamesReducer';
import './Home.css';


const Home = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const allEntries = useSelector((state) => state.entries.allEntries.entries);
    console.log('All Entries Use Selector', allEntries)
    const allGames = useSelector((state) => state.games.allGames.games);
    console.log('All Games from home', allGames);

    useEffect(() => {
        setLoading(true);
        setError(null);
        dispatch(thunkAllEntries())
          .then(() => {
            dispatch(thunkAllGames()); // Dispatch thunkAllGames to fetch game data
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            setError(err.message);
          });
      }, [dispatch]);

    if(loading) {
        return <p> Loading...</p>
    }

    if(error) {
        return <p>Error: {error}</p>
    }

    return (
        <div className="home-container">
          <h2>Home</h2>
          <div className="home-wrapper">
            <div className="home-entries">
                <div className="home-new-entry-button">
                    <button>New Entry!</button>
                </div>
              <h2>Entry Stuff Goes Here</h2>
              {allEntries.length === 0 ? (
                <p>No entries found.</p>
              ) : (
                allEntries.map((entry) => {
                    // Find the game with the matching game_id from allGames
                    const game = allGames.find((game) => game.id === entry.game_id);

                    return (
                      <div key={entry.id} className="entries-item">
                        <p>{console.log(entry, 'entry here?')}</p>
                        <h3>{game ? game.name : 'No Game Name'}</h3>
                        <p>Progress: {entry.progress}</p>
                        <p>{console.log(entry.progress, 'entry progress??')}</p>
                        <p>Progress Note: {entry.progress_note}</p>
                        <p>{console.log(entry.progress_note, 'entry progress note??')}</p>
                        <p>Now Playing: {entry.is_now_playing ? 'Yes' : 'No'}</p>
                        <p>Wishlist: {entry.wishlist ? 'Yes' : 'No'}</p>
                      </div>
                    );
                  })
                )}
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
