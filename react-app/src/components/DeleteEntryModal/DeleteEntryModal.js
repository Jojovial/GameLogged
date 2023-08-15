import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import { thunkDeleteEntry, thunkAllEntries } from '../../store/entryReducer';
import { useModal } from '../../context/Modal';
const DeleteEntryModal = ({ entryId, onDelete, onCancel }) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const { closeModal } = useModal();
  const handleDelete = async () => {
    await dispatch(thunkDeleteEntry(entryId));
    await dispatch(thunkAllEntries());
    onDelete();
    closeModal();
  }
  return (
    <div className="delete-entry-modal">
      <h2>Delete Entry</h2>
      <p>Are you sure you want to delete this entry?</p>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default DeleteEntryModal;
