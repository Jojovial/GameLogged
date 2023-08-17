import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkMemoryCard, thunkAllMemoryCards, thunkEditMemoryCard } from '../../store/memoryReducer';
import { useModal } from '../../context/Modal';

const EditMemoryCardModal = ({memoryCard}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [editedMemoryCard, setEditedMemoryCard] = useState(memoryCard.log_info);
    const handleEdit = async () => {
        try {
            const updatedMemory = { ...memoryCard, log_info: editedMemoryCard};
            await dispatch(thunkEditMemoryCard(updatedMemory.id, updatedMemory));
            await dispatch(thunkAllMemoryCards());
            closeModal();
        } catch (error) {
            console.error("Error updating memory card:", error)
        }
    };
    return (
        <div className="edit-memorycard-modal">
            <div className="memorycard-info">
                <textarea
                    value={editedMemoryCard}
                    onChange={(e) => setEditedMemoryCard(e.target.value)}
                    className="edit-memorycard-textarea"
                />
            </div>
            <div className="memorycard-edit-buttons">
                <button className="memorycard-edit-button" onClick={handleEdit}>
                    Edit
                </button>
                <button className="memorycard-cancel-button" onClick={closeModal}>
                    Cancel
                </button>
            </div>
        </div>
    )
};

export default EditMemoryCardModal;
