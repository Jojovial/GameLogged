

/*-Action Types-*/
const GET_ALL_COMMENTS = 'comments/GetAllComments';
const GET_COMMENT = 'comments/GetComment';
const ADD_COMMENT = 'comments/AddComment';
const EDIT_COMMENT = 'comments/EditComment';
const DELETE_COMMENT = 'comments/DeleteComment';

/*-Get All Comments-*/
export const getAllComments = (comments) => {
    return {
        type: GET_ALL_COMMENTS,
        comments: comments
    }
}

/*-Get Comment-*/
export const getComment = (comment) => {
    return {
        type: GET_COMMENT,
        comment
    }
}

/*-Add Comment-*/
export const addComment = (comment) => {
    return {
        type: ADD_COMMENT,
        comment
    }
}

/*-Edit Comment-*/
export const editComment = (comment) => {
    return {
        type: EDIT_COMMENT,
        comment
    }
}

/*-Delete Comment-*/
export const deleteComment = (commentId) => {
    return {
        type: DELETE_COMMENT,
        payload: commentId
    }
}

/*-Thunks-*/

/*-Get All Comments Thunk-*/
export const thunkAllComments = () => async (dispatch) => {
    try {
        const response = await fetch('/api/comments/all');
        const comments = await response.json();
        dispatch(getAllComments(comments));
    } catch(error) {
        console.log('Error creating comment', error.message);
        throw error;
    }
}

/*-Get Comment Thunk-*/
export const thunkComment = (commentId) => async (dispatch, getState) => {
    const response = await fetch(`/api/comments/${commentId}`);
    const comment = await response.json();
    dispatch(getComment(comment));
}

/*-Add Comment Thunk-*/
export const thunkAddComment = (commentData) => async (dispatch) => {
    try {
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentData),
        });

        if(!response.ok) {
            throw new Error('Failed to create comment');
        }

        const comment = await response.json();
        dispatch(addComment(comment));
        return comment;
    } catch (error) {
        console.error('Error creating comment:', error.message);
        throw error;
    }
}

/*-Edit Comment Thunk-*/
export const thunkEditComment = (commentId, comment) => async (dispatch) => {
    try {
        const response = await fetch(`/api/comments/${commentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comment)
        })

        if(!response.ok) {
            throw new Error('Network response was not ok');
        }

        const commentToEdit = await response.json();
        dispatch(editComment(commentToEdit));
        return { payload: commentToEdit };
    } catch (err) {
        return { error: err.message };
    }
}

/*-Delete Comment Thunk-*/
export const thunkDeleteComment = (commentId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/comments/${commentId}`, {
            method: 'DELETE',
        })

        if(!response.ok) {
            throw new Error('Failed to delete comment');
        }

        dispatch(deleteComment(commentId));
        return { payload: commentId }
    } catch (err) {
        console.error(err.message);
    }
}

const initialState = {
    allComments: {},
    singleComment: {}
}

/*-Reducer-*/
const commentReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_COMMENT:
            return {
                ...state,
                singleComment: action.comment
            }
        case GET_ALL_COMMENTS:
            return {
                ...state,
                allComments: action.comments
            };
        case ADD_COMMENT:
            return {
                ...state,
                allComments: {
                    ...state.allComments,
                    [action.comment.id]: action.comment
                }
            }
        case EDIT_COMMENT:
            return {
                ...state,
                allComments:{
                    ...state.allComments,
                    [action.comment.id]: action.comment
                }
            }
        case DELETE_COMMENT:
            const { [action.payload]: removedComment, ...restComments} = state.allComments;
            return {
                ...state,
                allComments: restComments
            };
        default:
            return state;
    }
}

export default commentReducer;
