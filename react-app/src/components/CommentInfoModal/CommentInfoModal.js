import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkEditComment, thunkAllComments } from '../../store/commentReducer';
import { useModal } from '../../context/Modal';
import './CommentInfoModal.css';
const EditCommentModal = ({comment}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [editedComment, setEditedComment] = useState(comment.comment_text);
   const handleEdit = async () => {
        try {
            const updatedComment = { ...comment, comment_text: editedComment };
            await dispatch(thunkEditComment(updatedComment.id, updatedComment));
            await dispatch(thunkAllComments());
            closeModal();
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };
    return (
        <div className="edit-comments-modal">
            <div className="comment-info">
                <textarea
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                    className="edit-comment-textarea"
                />
            </div>
            <div className="comments-edit-buttons">
                <button className="comment-edit-button" onClick={handleEdit}>
                    Edit
                </button>
                <button className="comment-cancel-button" onClick={closeModal}>
                    Cancel
                </button>
            </div>
        </div>
    )
};

export default EditCommentModal;
