

/*-Action Types-*/
const GET_ALL_REVIEWS = 'reviews/GetAllReviews';
const GET_REVIEW = 'reviews/GetReview';
const ADD_REVIEW = 'reviews/AddReview';
const EDIT_REVIEW = 'reviews/EditReview';
const DELETE_REVIEW = 'reviews/DeleteReview';

/*-Get All Reviews-*/
export const getAllReviews = (reviews) => {
    return {
        type: GET_ALL_REVIEWS,
        reviews: reviews
    }
}


/*-Get Review-*/
export const getReview = (review) => {
    return {
        type: GET_REVIEW,
        review
    }
}

/*-Add Review-*/
export const addReview = (review) => {
    return {
        type: ADD_REVIEW,
        review
    }
}

/*-Edit Review-*/
export const editReview = (review) => {
    return {
        type: EDIT_REVIEW,
        review
    }
}


/*-Delete Review-*/
export const deleteReview = (reviewId) => {
    return {
        type: DELETE_REVIEW,
        payload: reviewId
    }
}


/*-Thunks-*/

/*-Get All Reviews Thunk-*/
export const thunkAllReviews = () => async (dispatch) => {
    const response = await fetch('/api/entries/reviews/all');
    const reviews = await response.json();
    dispatch(getAllReviews(reviews));
}

/*-Get Review Thunk-*/
export const thunkReview = (reviewId) => async (dispatch, getState) => {
    const response = await fetch(`/api/reviews/${reviewId}`);
    const review = await response.json();
    dispatch(getReview(review));
}

/*-Add Review Thunk-*/
export const thunkAddReview = (review) => async (dispatch) => {
    let response;
    try {
        response = await fetch('/api/reviews', {
            method: 'POST',
            headers:{ 'Content-Type': 'application/json'},
            body: JSON.stringify(review)
        });

        if(response.ok) {
            const reviewResponse = await response.json();
            dispatch(addReview(reviewResponse));
            return reviewResponse;
        }

    } catch (err) {
        const errors = await err.json();
        return errors;
    }
}


/*-Edit A Review Thunk-*/
export const thunkEditReview = (reviewId, review) => async (dispatch) => {
    try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(review)
        });

        if(!response.ok) {
            throw new Error('Network response was ot ok.');
        }

        const reviewToEdit = await response.json();
        dispatch(editReview(reviewToEdit));

        return { payload: reviewToEdit }
    } catch (err) {
        return {error: err.message}
    }
}

/*-Delete a Review Thunk-*/
export const thunkDeleteReview = (reviewId) => async (dispatch) => {
    let response;
    try {
        response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE'
        });
        const deleteReviewResponse = await response.json();
        if (response.ok) {
            dispatch(deleteReview(reviewId));
            return deleteReviewResponse;
        } else {
            throw new Error(deleteReviewResponse.message || 'Unable to delete review');
        }
    } catch (err) {
        console.error(err.message);
    }
}


const initialState = {
    allReviews: {},
    singleReview: {},
};

/*-Reducer-*/
const reviewsReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_REVIEW:
            return {
                ...state,
                singleReview: action.review
            }
        case GET_ALL_REVIEWS:
            return {
                ...state,
                allReviews: action.reviews

            }
        case ADD_REVIEW:
            return {
                ...state,
                allReviews: {
                    ...state.allReviews,
                    [action.review.id]: action.review
                }
            }
        case EDIT_REVIEW:
            return {
                ...state,
                allReviews: {
                    ...state.allReviews,
                    [action.review.id]: action.review
                }
            }
            case DELETE_REVIEW:
                const { [action.payload]: _, ...remainingReviews } = state.allReviews;
                return {
                  ...state,
                  allReviews: remainingReviews,
                };
        default:
            return state;
    }
}

export default reviewsReducer;
