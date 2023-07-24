import { deleteGame, editGame, addGame } from "./gamesReducer";
import { deleteReview, editReview, addReview } from "./reviewsReducer";


/*-Action Types-*/
const GET_ALL_ENTRIES = 'entries/GetAllEntries';
const GET_ENTRY = 'entries/GetEntry';
const ADD_ENTRY = 'entries/AddEntry';
const EDIT_ENTRY = 'entries/EditEntry';
const DELETE_ENTRY = 'entries/DeleteEntry';

/*-Get All Entries-*/
export const getAllEntries = (entries) => {
    return {
        type: GET_ALL_ENTRIES,
        entries: entries
    }
}

/*-Get Entry-*/
export const getEntry = (entry) => {
    return {
        type: GET_ENTRY,
        entry
    }
}

/*-Add Entry-*/
export const addEntry = (entry) => {
    return {
        type: ADD_ENTRY,
        entry
    }
}

/*-Edit Entry-*/
export const editEntry = (entry) => {
    return {
        type: EDIT_ENTRY,
        entry
    }
}

/*-Delete Entry-*/
export const deleteEntry = (entryId) => {
    return {
        type: DELETE_ENTRY,
        payload: entryId
    }
}


/*-Thunks-*/

/*-Get All Entries Thunk-*/
export const thunkAllEntries = () => async (dispatch) => {
  try {
      const response = await fetch('/api/entries/all');
      const entries = await response.json();
      console.log('API Response:', entries); // Check the response from the API
      dispatch(getAllEntries(entries));
      console.log('After dispatch', entries);

      return Promise.resolve(); // Resolve the promise when the operation is done
  } catch (error) {
      console.error('Error fetching entries:', error);

      return Promise.reject(error); // Reject the promise if an error occurs
  }
};
/*-Get Entry Thunk-*/
export const thunkEntry = (entryId) => async (dispatch, getState) => {
    const response = await fetch(`/api/entries/${entryId}`);
    const entry = await response.json();
    dispatch(getEntry(entry));
}

// thunkCreateGame
export const thunkCreateGame = (gameData) => async (dispatch) => {
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      const game = await response.json();
      dispatch(addGame(game));
      console.log("Created game:", game);
      return game;
    } catch (error) {
      console.error('Error creating game:', error.message);
      throw error;
    }
  };

  // thunkCreateEntry
  export const thunkCreateEntry = (entryData) => async (dispatch) => {
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData),
      });

      if (!response.ok) {
        throw new Error('Failed to create entry');
      }

      const entry = await response.json();
      dispatch(addEntry(entry))
      return entry;
    } catch (error) {
      console.error('Error creating entry:', error.message);
      throw error;
    }
  };

  // thunkCreateReview
  export const thunkCreateReview = (reviewData) => async (dispatch) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to create review');
      }

      const review = await response.json();
      dispatch(addReview(review));
      return review;
    } catch (error) {
      console.error('Error creating review:', error.message);
      throw error;
    }
  };


  export const thunkEditEntry = (entryId, entry) => async (dispatch) => {
    try {
        const response = await fetch(`/api/entries/${entryId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const entryToEdit = await response.json();
        dispatch(editEntry(entryToEdit));

        return { payload: entryToEdit };
    } catch (err) {
        return { error: err.message };
    }
};

export const thunkEditGame = (gameId, game) => async (dispatch) => {
    try {
        const response = await fetch(`/api/games/${gameId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(game)
        });

        if (!response.ok) {
            throw new Error('Failed to update game');
        }

        const gameToEdit = await response.json();
        dispatch(editGame(gameToEdit));

        return { payload: gameToEdit };
    } catch (err) {
        return { error: err.message };
    }
};

export const thunkEditReview = (reviewId, review) => async (dispatch) => {
    try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review)
        });

        if (!response.ok) {
            throw new Error('Failed to update review');
        }

        const reviewToEdit = await response.json();
        dispatch(editReview(reviewToEdit));

        return { payload: reviewToEdit };
    } catch (err) {
        return { error: err.message };
    }
};

export const thunkDeleteEntry = (entryId) => async (dispatch) => {
    try {
      const response = await fetch(`/api/entries/${entryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      // If the API is configured to cascade delete reviews, you don't need to dispatch deleteReview action separately.
      dispatch(deleteEntry(entryId));

      return { payload: entryId };
    } catch (err) {
      console.error(err.message);
    }
  };

const initialState = {
    allEntries: {},
    singleEntry: {},
};


/*-Reducer-*/
const entryReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_ENTRY:
            return {
                ...state,
                singleEntry: action.entry
            }
        case GET_ALL_ENTRIES:
            console.log('Redux state after GET_ALL_ENTRIES:', action.entries);
            return {
                ...state,
                allEntries: action.entries
            };
        case ADD_ENTRY:
            return {
                ...state,
                allEntries: {
                    ...state.allEntries,
                    [action.entry.id]: action.entry
                }
            };
        case EDIT_ENTRY:
            return {
                ...state,
                allEntries:{
                    ...state.allEntries,
                    [action.entry.id]: action.entry
                }
            };
            case DELETE_ENTRY:
                const { [action.payload]: removedEntry, ...restEntries } = state.allEntries;
                return {
                    ...state,
                    allEntries: restEntries,
                };
        default:
            return state;
    }
}

export default entryReducer;
