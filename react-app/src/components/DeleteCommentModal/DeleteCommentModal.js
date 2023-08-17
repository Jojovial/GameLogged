import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import { thunkDeleteComment, thunkAllComments } from '../../store/commentReducer';
import { useModal } from '../../context/Modal';
import './DeleteCommentModal.css';
const DeleteCommentModal = ({comment, onDelete, onCancel}) => {
    const dispatch = useDispatch();
    const {closeModal } = useModal();
    const handleDelete = async() => {
        await dispatch(thunkDeleteComment(comment.id));
        await dispatch(thunkAllComments());
        closeModal();
    }

    return (
        <div className="delete-comment-modal">
            <h2>Delete Comment</h2>
            <p>Are you sure you want to delete this comment?</p>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    )
}

export default DeleteCommentModal;
