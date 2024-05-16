import React from "react";
import "./ConfirmationModal.css";

const ConfirmationModal = ({ isOpen, onCancel, onConfirm, wishlistName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onCancel}>
          &times;
        </span>
        <h3>Delete this wishlist?</h3>
        <p>{`"${wishlistName}" will be permanently deleted.`}</p>
        <div className="button-group">
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="delete-button" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
