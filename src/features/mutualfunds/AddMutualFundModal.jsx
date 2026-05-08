import React from "react";

const AddMutualFundModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;
  // Implement modal UI and form fields for mutual fund entry
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Add Mutual Fund</h2>
        {/* Form fields go here */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AddMutualFundModal;
