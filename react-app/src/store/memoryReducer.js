/*-Action Types-*/
const GET_ALL_MEMORYCARDS = 'memories/GetAllMemoryCards';
const GET_MEMORYCARD = 'memories/GetMemoryCard';
const ADD_MEMORYCARD = 'memories/AddMemoryCard';
const EDIT_MEMORYCARD = 'memories/EditMemoryCard';
const DELETE_MEMORYCARD = 'memories/DeleteMemoryCard';

/*-Get all Memories-*/
export const getAllMemoryCards = (memoryCards) => {
    return {
        type: GET_ALL_MEMORYCARDS,
        memoryCards: memoryCards
    }
}

/*-Get Memory Card-*/
export const getMemoryCard = (memoryCard) => {
    return {
        type: GET_MEMORYCARD,
        memoryCard
    }
}

/*-Add Memory Card-*/
export const addMemoryCard = (memoryCard) => {
    return {
        type: ADD_MEMORYCARD,
        memoryCard
    }
}

/*-Edit Memory Card-*/
export const editMemoryCard = (memoryCard) => {
    return {
        type: EDIT_MEMORYCARD,
        memoryCard
    }
}

/*-Delete Memory Card-*/
export const deleteMemoryCard = (memoryCardId) => {
    return {
        type: DELETE_MEMORYCARD,
        payload: memoryCardId
    }
}

/*-Thunks-*/

/*-Get All Memory Card Thunks-*/
export const thunkAllMemoryCards = () => async (dispatch) => {
    try {
        const response = await fetch('/api/memory/all');
        const memoryCards = await response.json();
        dispatch(getAllMemoryCards(memoryCards));
    } catch (error) {
        console.log('Getting Memory Cards', error.message);
        throw error;
    }
}

/*-Get Memory Card Thunk-*/
export const thunkMemoryCard = (memoryCardId) => async (dispatch) => {
    const response = await fetch(`/api/memory/${memoryCardId}`);
    const memoryCard = await response.json();
    dispatch(getMemoryCard(memoryCard));
}

/*-Add Memory Card Thunk-*/
export const thunkAddMemoryCard = (memoryCardData) => async (dispatch) => {
    try {
        const response = await fetch('/api/memory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(memoryCardData)
        })
        if(!response.ok) {
            throw new Error('Failed to create memory card');
        }

        const memoryCard = await response.json();
        dispatch(addMemoryCard(memoryCard));
        return memoryCard;
    } catch (error) {
        console.error('Error creating memory card:', error.message);
        throw error;
    }
}

/*-Edit Memory Card Thunk-*/
export const thunkEditMemoryCard = (memoryCardId, memoryCard) => async (dispatch) => {
    try {
        const response = await fetch(`/api/memory/${memoryCardId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(memoryCard)
        })

        if(!response.ok){
            throw new Error('Network response was not ok')
        }

        const memoryCardToEdit = await response.json();
        dispatch(editMemoryCard(memoryCardToEdit));
        return { payload: memoryCardToEdit };
    } catch (err) {
        return { error: err.message };
    }
}

/*-Delete MemoryCard Thunk-*/
export const thunkDeleteMemoryCard = (memoryCardId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/memory/${memoryCardId}`, {
            method: 'DELETE'
        })

        if(!response.ok) {
            throw new Error('Failed to delete memory card')
        }

        dispatch(deleteMemoryCard(memoryCardId));
        return { payload: memoryCardId }
    } catch ( err) {
        console.log(err.message)
    }
}

const initialState = {
    allMemoryCards: {},
    singleMemoryCard: {}
}

/*-Reducer-*/
const memoryCardReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_MEMORYCARD:
            return {
                ...state,
                singleMemoryCard: action.memoryCard
            }
        case GET_ALL_MEMORYCARDS:
            return {
                ...state,
                allMemoryCards: action.memoryCards
            }
        case ADD_MEMORYCARD:
            return {
                ...state,
                allMemoryCards: {
                    ...state.allMemoryCards,
                    [action.memoryCard.id]: action.memoryCard
                }
            }
        case EDIT_MEMORYCARD:
            return {
                ...state,
                allMemoryCards: {
                    ...state.allMemoryCards,
                    [action.memoryCard.id]: action.memoryCard
                }
            }
        case DELETE_MEMORYCARD:
            const { [action.payload]: removedMemoryCard, ...restMemoryCards} = state.allMemoryCards;
            return {
                ...state,
                allMemoryCards: restMemoryCards
            };
        default:
            return state;
    }
}

export default memoryCardReducer;
