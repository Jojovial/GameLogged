import React from 'react';

const DeleteEntryModal = ({ entryId, onDelete, onCancel }) => {
  return (
    <div className="delete-entry-modal">
      <h2>Delete Entry</h2>
      <p>Are you sure you want to delete this entry?</p>
      <button onClick={() => onDelete(entryId)}>Delete</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default DeleteEntryModal;
