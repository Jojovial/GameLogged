import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { thunkAddComment, thunkAllComments } from '../../store/commentReducer';
import { useModal } from '../../context/Modal';

const CommentModal = () => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [commentText, setCommentText] = useState('');

    const handleCommentChange = (e) => {
        setCommentText(e.target.value);
    }

    const handleCommentSubmit = () => {
        if (commentText.trim() !== '') {
            console.log('Submitting comment:', { comment_text: commentText }); // Check the data being sent
            dispatch(thunkAddComment({ comment_text: commentText }))
                .then(() => {
                    console.log('Comment submitted successfully'); // Check if the thunk is successful
                    dispatch(thunkAllComments());
                    closeModal();
                })
                .catch(error => {
                    console.error('Error submitting comment:', error); // Check if there's an error from the thunk
                });
        }
    }


    return (
        <div className="comments-modal">
            <div className="comment-info">
                <textarea
                    className="create-comment-textarea"
                    value={commentText}
                    onChange={handleCommentChange}
                    placeholder='Enter your comment'
                />
                <button onClick={handleCommentSubmit}>Submit Comment</button>
            </div>

        </div>
    )
};

export default CommentModal;
