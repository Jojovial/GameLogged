import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { thunkCreateEntry} from "../../store/entryReducer";
import { thunkAllEntries } from "../../store/entryReducer";
import { useModal } from "../../context/Modal";
import './EntryModal.css';

const EntryModal = () => {
  const dispatch = useDispatch();
  const [tempRating, setTempRating] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { closeModal} = useModal();
  const SYSTEM_CHOICES = [
    "PC",
    "GameCube",
    "GameBoy",
    "GameBoyColor",
    "GameBoyAdvance",
    "Nintendo3DS",
    "Nintendo64",
    "NES",
    "SNES",
    "NintendoSwitch",
    "PlayStation",
    "PlayStation2",
    "PlayStation3",
    "PlayStation4",
    "PlayStation5",
    "PSP",
    "PlayStationVita",
    "Phone",
    "Wii",
    "WiiU",
    "Xbox",
    "Xbox360",
    "XboxOne",
    "Other",
]

const REGION_CHOICES = [
    'NAM',
    'JP',
    'PAL',
    'CN',
    'KR',
    'BR',
    'Other',
]

const PROGRESS_CHOICES = [
    'Unplayed',
    'Unfinished',
    'Beaten',
    'Completed',
]

  const [formData, setFormData] = useState({
    name: "",
    system: SYSTEM_CHOICES[0],
    region: REGION_CHOICES[0],
    progress: PROGRESS_CHOICES[0],
    progress_note: "",
    is_now_playing: false,
    wishlist: false,
    rating: 0,
    review_text: "",
  });


  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    console.log(e.target);
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleCreateEntry = async () => {
    try {
      const entryData = {
        game_name: formData.game_name,
        system: formData.system,
        region: formData.region,
        progress: formData.progress,
        progress_note: formData.progress_note,
        rating: formData.rating,
        review_text: formData.review_text,
        is_now_playing: formData.is_now_playing,
        wishlist: formData.wishlist,
      };

      const createdEntry = await dispatch(thunkCreateEntry(entryData));
      console.log('New entry created:', createdEntry);
      console.log("Entry data to be sent:", entryData);

      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(entryData),
      });

      console.log("Entry creation response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      return responseData.entry.id;
    } catch (error) {
      console.error('Error creating entry:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      await handleCreateEntry();
      dispatch(thunkAllEntries()),



      closeModal();
    } catch (error) {
      console.error("Error creating entry:", error);
      console.log("Server Response:", error.response);
    }
  };


  const handleRatingChange = (rating) => {
    setFormData((prevData) => ({
      ...prevData,
      rating: rating,
    }));
  };

  const handleMouseEnter = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      rating: index + 1,
    }));
  };

  const handleMouseLeave = () => {
    setTempRating(null);
  };

    return (
        <div className="entry-modal">
            <form onSubmit={handleSubmit} className="entry-modal-form">
            <label htmlFor="name">Game Name:</label>
            <input
                type="text"
                id="entry-name-modal"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="entry-modal-game-name"
            />
            <label htmlFor="system">System:</label>
            <select
                id="entry-system-modal"
                name="system"
                value={formData.system}
                onChange={handleChange}
                required
                className="entry-modal-system"
            >
                {SYSTEM_CHOICES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}

            </select>
            <label htmlFor="region">Region:</label>
            <select
                id="entry-region-modal"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="entry-modal-region"
            >
              {REGION_CHOICES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
            </select>
            <label htmlFor="progress">Progress:</label>
            <select
                id="entry-progress-modal"
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                required
                className="entry-modal-progress"
            >
              {PROGRESS_CHOICES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}

            </select>
            <label htmlFor="progress_note">Progress Note:</label>
            <input
                type="text"
                id="entry-progress-note-modal"
                name="progress_note"
                value={formData.progress_note}
                onChange={handleChange}
                className="entry-modal-progress-note"
            />
             <div className="rating-slider">
             <p>
    Rating: {tempRating !== null ? tempRating : formData.rating}
  </p>
  <div className="stars">
    {Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={index < (tempRating ?? formData.rating) ? "star active" : "star"}
        onClick={() => handleRatingChange(index + 1)}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
      >
        {index + 1} {/* Display the rating number */}
        &#9733;
      </span>
    ))}
          </div>
        </div>
            <label htmlFor="review_text">Review:</label>
            <input
                type="text"
                id="entry-review-modal"
                name="review_text"
                value={formData.review_text}
                onChange={handleChange}
                className="entry-modal-review"
            />
            <label htmlFor="wishlist">Wishlist:</label>
            <input
                type="checkbox"
                id="entry-wishlist-modal"
                name="wishlist"
                checked={formData.wishlist}
                onChange={handleChange}
                className="entry-modal-wishlist"
            />
            <label htmlFor="is_now_playing">Now Playing?:</label>
            <input
                type="checkbox"
                id="entry-is-now-playing-modal"
                name="is_now_playing"
                checked={formData.is_now_playing}
                onChange={handleChange}
                className="entry-modal-now-playing"
            />
            <button type="submit">Create</button>
            <button type="button" onClick={closeModal}>
          Cancel
        </button>
         </form>
        </div>
    )

};

export default EntryModal;
