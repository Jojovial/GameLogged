import React, { useState } from 'react';
import EntryForm from '../EntryForm/EntryForm';
import { thunkEditEntry, thunkAllEntries } from '../../store/entryReducer';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

const EditEntryModal = ({ selectedEntryData, onCancel}) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const onSubmit = async (updatedEntry) => {
    try {
      await dispatch(thunkEditEntry(updatedEntry.id, updatedEntry));
      await dispatch(thunkAllEntries());
      onCancel();
      closeModal();
    } catch(error) {
      console.error("Error updating entry:", error)
    } finally {
      setIsModalVisible(false);
    }

  }
  if (!selectedEntryData) {
      return null;
    }

  return (
    <div className="edit-entry-modal">
      <h2>Edit Entry</h2>
      <EntryForm
        initialFormData={selectedEntryData}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </div>
  );
};

export default EditEntryModal;
