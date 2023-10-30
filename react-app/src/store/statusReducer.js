
/*-Action Types-*/
const GET_ALL_STATUS = 'status/GetAllStatus';
const GET_STATUS = 'status/GetStatus';
const ADD_STATUS = 'status/AddStatus';
const EDIT_STATUS = 'status/EditStatus';
const DELETE_STATUS = 'status/DeleteStatus';

/*-Get All Status-*/
export const getAllStatus = (statuses) => {
    return {
        type: GET_ALL_STATUS,
        statuses: statuses
    }
}

export const getStatus = (status) => {
    return {
        type: GET_STATUS,
        status
    }
}

export const addStatus = (status) => {
    return {
        type : ADD_STATUS,
        status
    }
}

export const editStatus = (status) => {
    return {
        type: EDIT_STATUS,
        status
    }
}

export const deleteStatus = (statusId) => {
    return {
        type: DELETE_STATUS,
        payload: statusId
    }
}


/*Thunks-*/

export const thunkAllStatus = () => async (dispatch) => {
    try {
        const response = await fetch('/api/status/all');
        const statuses = await response.json();
        dispatch(getAllStatus(statuses));
    } catch(error) {
        console.log('Error getting all statuses', error.message);
        throw error;
    }
}

export const thunkStatus = (statusId) => async (dispatch, getState) => {
    const response = await fetch(`/api/status/${statusId}`);
    const status = await response.json();
    dispatch(getStatus(status));
}

export const thunkAddStatus = (statusData) => async (dispatch) => {
    try {
        const response = await fetch('/api/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(statusData),
        });

        if(!response.ok) {
            throw new Error('Failed to create status')
        }

        const status = await response.json();
        dispatch(addStatus(status));
        return status;
    } catch (error) {
        console.error('Error creating status', error.message);
        throw error;
    }
}

export const thunkEditStatus = (statusId, status) => async (dispatch) => {
    try {
        const response = await fetch(`/api/status/${statusId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(status)
        })

        if(!response.ok) {
            throw new Error('Network response was not ok');
        }

        const statusToEdit = await response.json();
        dispatch(editStatus(statusToEdit));
        return { payload: statusToEdit };
    } catch(err) {
        return { error: err.message }
    }
}

export const thunkDeleteStatus = (statusId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/status/${statusId}`, {
            method: 'DELETE',
        })

        if(!response.ok) {
            throw new Error('Failed to delete status');
        }

        dispatch(deleteStatus(statusId));
        return { payload: statusId }
    } catch (err) {
        console.error(err.message);
    }
}

const initialState = {
    allStatus: {},
    singleStatus: {}
}

const statusReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_ALL_STATUS:
            return {
                ...state,
                allStatus: action.status
            }
        case GET_STATUS:
            return {
                ...state,
                singleStatus: action.status
            }
        case ADD_STATUS:
            return {
                ...state,
                allStatus: {
                    ...state.allStatus,
                    [action.status.id]: action.status
                }
            }
        case EDIT_STATUS:
            return {
                ...state,
                allStatus: {
                    ...state.allStatus,
                    [action.status.id]: action.status
                }
            }
        case DELETE_STATUS:
            const { [action.payload]: removedStatus, ...restStatus} = state.allStatus;
            return {
                ...state,
                allStatus: restStatus
            };
        default:
            return state;
    }
}

export default statusReducer;
