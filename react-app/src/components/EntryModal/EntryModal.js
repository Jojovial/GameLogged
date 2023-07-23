import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { thunkCreateEntry, thunkCreateGame, thunkCreateReview } from "../../store/entryReducer";
import { thunkAllEntries } from "../../store/entryReducer";
import { thunkAllGames } from "../../store/gamesReducer";
import { thunkAllReviews } from "../../store/reviewsReducer";
import { thunkEditEntry } from '../../store/entryReducer';
import './EntryModal.css';

const EntryModal = ({ editMode, initialFormData }) => {
  const dispatch = useDispatch();
  const [tempRating, setTempRating] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false)
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





  useEffect(() => {
    if (editMode && initialFormData) {
      console.log("Initial form data:", initialFormData);
      // If in edit mode and there is initialFormData, set the form fields with the initial data
      setFormData({
        name: initialFormData.name,
        system: initialFormData.system,
        region: initialFormData.region,
        progress: initialFormData.progress,
        progress_note: initialFormData.progress_note,
        is_now_playing: initialFormData.is_now_playing,
        wishlist: initialFormData.wishlist,
        rating: initialFormData.rating,
        review_text: initialFormData.review_text,
      });
      console.log('Edit Data', initialFormData);
    } else {
      // Set default values for the form fields
      setFormData({
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
    }
  }, [editMode, initialFormData]);
  const closeModal = () => {
    // Close the modal by setting the state to false
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };


  const handleCreateGame = async () => {
    try {
      const gameData = {
        name: formData.name,
        system: formData.system,
        region: formData.region,
      };

      const response = await fetch('/api/entries/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      if (responseData.game && responseData.game.id) {
        return responseData.game.id;
      } else {
        throw new Error('Invalid response data: game id is missing.');
      }
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  };


  const handleCreateEntry = async (gameId) => {
    try {
      const entryData = {
        name: formData.name,
        progress: formData.progress,
        progress_note: formData.progress_note,
        is_now_playing: formData.is_now_playing,
        wishlist: formData.wishlist,
        game_id: gameId,
      };

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

  const handleCreateReview = async (entryId, gameId) => {
    try {
      const reviewData = {
        entry_id: entryId,
        game_id: gameId,
        rating: formData.rating,
        review_text: formData.review_text,
      };

      const response = await fetch('/api/entries/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      // No need to return anything since this function doesn't need to return any data
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        // If in edit mode, dispatch a thunk to update the existing entry instead of creating a new one.
        await dispatch(thunkEditEntry(initialFormData.id, formData)); // Use the entryToEdit.id as the entryId
      } else {
        // Create a new entry
        const gameId = await handleCreateGame();
        const entryId = await handleCreateEntry(gameId);
        await handleCreateReview(entryId, gameId);
      }

      // Fetch the latest data after creating/updating the entry
      dispatch(thunkAllEntries());
      dispatch(thunkAllGames());
      dispatch(thunkAllReviews());

      closeModal();
    } catch (error) {
      console.error("Error creating/updating entry:", error);
      // Handle the error, e.g., show an error message to the user
      // You can use the setError state to display an error message on the modal.
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
            <button type="submit">{editMode ? "Update" : "Create"}</button>
         </form>
        </div>
    )
};

export default EntryModal;
