/*-Action Types-*/
const GET_ALL_GAMES = 'games/GetAllGames';
const GET_GAME = 'games/GetGame';
const ADD_GAME = 'games/AddGame';
const EDIT_GAME = 'games/EditGame';
const DELETE_GAME = 'games/DeleteGame';

/*-Get All Games-*/
export const getAllGames = (games) => {
    return {
        type: GET_ALL_GAMES,
        games: games
    }
}

/*-Get Game-*/
export const getGame = (game) => {
    return {
        type: GET_GAME,
        game
    }
}

/*-Add Game-*/
export const addGame = (game) => {
    return {
        type: ADD_GAME,
        game
    }
}

/*-Edit Game-*/
export const editGame = (game) => {
    return {
        type: EDIT_GAME,
        game
    }
}

/*-Delete Game-*/
export const deleteGame = (gameId) => {
    return {
        type: DELETE_GAME,
        paylod: gameId
    }
}


/*-Thunks-*/

/*-Get All Games Thunk-*/
export const thunkAllGames = () => async (dispatch) => {
    try {
        const response = await fetch('/api/entries/games/all');
        const games = await response.json();
        console.log('Fetched Games:', games); // Check if the data is received correctly
        dispatch(getAllGames(games));
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

/*-Get Game Thunk-*/
export const thunkGame = (gameId) => async (dispatch, getState) => {
    const response = await fetch(`/api/games/${gameId}`);
    const game = await response.json();
    dispatch(getGame(game));
}

/*-Add Game Thunk-*/
export const thunkAddGame = (game) => async (dispatch) => {
    let response;
    try {
        response = await fetch('/api/games', {
            method: 'POST',
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify(game)
        });

        if(response.ok) {
            const gameResponse = await response.json();
            dispatch(addGame(gameResponse));
            return gameResponse;
        }
    } catch (err) {
        const errors = await err.json();
        return errors;
    }
}

/*-Edit A Game Thunk-*/
export const thunkEditGame = (gameId, game) => async (dispatch) => {
    try {
        const response = await fetch(`/api/games/${gameId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(game)
        });

        if(!response.ok) {
            throw new Error('Network response was not ok');
        }

        const gameToEdit = await response.json();
        dispatch(editGame(gameToEdit));

        return { payload: gameToEdit }

    } catch (err) {
        return { error: err.message };
    }
}


/*-Delete a Game Thunk-*/
export const thunkDeleteGame = (gameId) => async (dispatch) => {
    let response;
    try {
        response = await fetch(`/api/games/${gameId}`, {
            method: 'DELETE'
        });
        const deleteGameResponse = await response.json();
        if (response.ok) {
            dispatch(deleteGame(gameId));
            return deleteGameResponse;
        } else {
            throw new Error(deleteGameResponse.message || 'Unable to delete game.');
        }
    } catch (err) {
        console.error(err.message);
    }
}


const initialState = {
    allGames: {},
    singleGame: {},
};


/*-Reducer-*/
const gamesReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_GAME:
            return {
                ...state,
                singleGame: action.game
            }
        case GET_ALL_GAMES:
            return {
                ...state,
                allGames: {
                    ...action.games
                }
            };
        case ADD_GAME:
            return {
                ...state,
                allGames: {
                    ...state.allGames,
                    [action.game.id]: action.game
                }
            };
        case EDIT_GAME:
            return {
                ...state,
                allGames: {
                    ...state.allGames,
                    [action.game.id]: action.game
                }
            }
        case DELETE_GAME:
            const gameToDelete = { ...state.allGames };
            delete gameToDelete[action.payload];
            return {
                ...state,
                allGames: gameToDelete
            };
        default:
            return state;
    }
}

export default gamesReducer;
