import React from 'react';
import EntryForm from '../EntryForm/EntryForm';

const EditEntryModal = ({ selectedEntryData, onSubmit, onCancel}) => {
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
