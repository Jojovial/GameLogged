import React from 'react';
import { useDispatch } from 'react-redux';
import { thunkDeleteMemoryCard, thunkAllMemoryCards } from '../../store/memoryReducer';
import { useModal } from '../../context/Modal';
import './DeleteMemoryCardModal.css';

const DeleteMemorycardModal = ({memoryCard, onCancel}) => {
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    const handleDelete = async() => {
        await dispatch(thunkDeleteMemoryCard(memoryCard.id));
        await dispatch(thunkAllMemoryCards());
        closeModal();
    }
    return (
        <div className="delete-memorycard-modal">
            <h2>Delete Memory Card?</h2>
            <p>Are you sure you want to delete this memory card?</p>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    )
}

export default DeleteMemorycardModal;
