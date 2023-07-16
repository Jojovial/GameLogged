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
        entries: entries.entries
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
    const response = await fetch('/api/entries');
    const entries = await response.json();
    dispatch(getAllEntries(entries));
}

/*-Get Entry Thunk-*/
export const thunkEntry = (entryId) => async (dispatch, getState) => {
    const response = await fetch(`/api/entries/${entryId}`);
    const entry = await response.json();
    dispatch(getEntry(entry));
}

/*-Add Entry Thunk-*/
export const thunkAddEntry = (entry) => async (dispatch) => {
    let response;
    try {
        response = await fetch ('/api/entries', {
            method: 'POST',
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
        });

        if (response.ok) {
            const entryResponse = await response.json();
            dispatch(addEntry(entryResponse));
            return entryResponse;
        }
    } catch (err) {
        const errors = await err.json();
        return errors;
    }
}

/*-Edit An Entry Thunk-*/
export const thunkEditEntry = (entryId, entry) => async (dispatch) => {
    try {
        const response = await fetch(`/api/entries/${entryId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
        });

        if(!response.ok) {
            throw new Error('Network response was not ok');
        }

        const entryToEdit = await response.json();
        dispatch(editEntry(entryToEdit));

        return { payload: entryToEdit };
    } catch (err) {
        return { error: err.message };
    }
}

/*Delete an Entry-*/
export const thunkDeleteEntry = (entryId) => async (dispatch) => {
    let response;
    try {
        response = await fetch(`/api/entries/${entryId}`, {
            method: 'DELETE'
        });
        const deleteEntryResponse = await response.json();
        if (response.ok) {
            dispatch(deleteEntry(entryId));
            return deleteEntryResponse;
        } else {
            throw new Error(deleteEntryResponse.message || 'Unable to delete entry');

        }
    } catch (err) {
        console.error(err.message);
    }
}


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
            return {
                ...state,
                allEntries: {
                    ...action.entries
                }
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
            const entryToDelete = { ...state.allEntries };
            delete entryToDelete[action.payload];
            return {
                ...state,
                allEntries: entryToDelete
            };
        default:
            return state;
    }
}

export default entryReducer;
