import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { thunkCreateEntry, thunkCreateGame, thunkCreateReview } from "../../store/entryReducer";

const EntryModal = ({ editMode, initialFormData }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    system: "",
    region: "",
    progress: "",
    progress_note: "",
    is_now_playing: false,
    wishlist: false,
    rating: 0,
    review_text: "",
  });

  const [enums, setEnums] = useState({
    System: [],
    Region: [],
    Progress: [],
  });

  useEffect(() => {
    fetch("/api/enums")
      .then((response) => response.json())
      .then((data) => {
        console.log("Enums data:", data);
        setEnums(data);
      });
  }, []);


  useEffect(() => {
    if (editMode && initialFormData) {
      setFormData(initialFormData);
    } else {
      // Set default values for the form fields
      setFormData({
        progress: "",
        progress_note: "",
        is_now_playing: false,
        wishlist: false,
        name: "",
        system: "",
        region: "",
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

    if (name === "progress") {
      // Check if the selected value is a valid Progress enum value
      if (enums.Progress.includes(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      } else {
        // Log an error or handle invalid progress value
        console.error("Invalid progress value:", value);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };


  const handleCreateGame = async () => {
    try {
      const gameData = {
        name: formData.name,
        system: formData.system,
        region: formData.region,
      };
      const responseGame = await dispatch(thunkCreateGame(gameData));
      return responseGame.game_id;
    } catch (error) {
      console.error("Error creating game:", error);
      throw error;
    }
  };


  const handleCreateEntry = async (gameId) => {
    try {
      const entryData = {
        progress: formData.progress,
        progress_note: formData.progress_note,
        is_now_playing: formData.is_now_playing,
        wishlist: formData.wishlist,
        game_id: gameId,
      };
      const responseEntry = await dispatch(thunkCreateEntry(entryData));
      return responseEntry.id;
    } catch (error) {
      console.error("Error creating entry:", error);
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
      await dispatch(thunkCreateReview(reviewData));
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gameId = await handleCreateGame();
      const entryId = await handleCreateEntry(gameId);
      await handleCreateReview(entryId, gameId);
      closeModal();
    } catch (error) {
      console.error("Error creating/updating entry:", error);
      // Handle the error, e.g., show an error message to the user
      throw error; // or show an error message and prevent form submission
    }
  };


  const handleRatingChange = (rating) => {
    setFormData((prevData) => ({
      ...prevData,
      review_rating: rating,
    }));
  };

    return (
        <div className="entry-modal">
            <form onSubmit={handleSubmit}>
            <label htmlFor="name">Game Name:</label>
            <input
                type="text"
                id="entry-name-modal"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <label htmlFor="system">System:</label>
            <select
                id="entry-system-modal"
                name="system"
                value={formData.system}
                onChange={handleChange}
                required
            >
                {enums.System.map((systemOption) => (
                    <option key={systemOption} value={systemOption}>
                        {systemOption}
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
            >
                {enums.Region.map((regionOption) => (
                    <option key={regionOption} value={regionOption}>
                        {regionOption}
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
            >
                {enums.Progress.map((progressOption) => (
                    <option key={progressOption} value={progressOption}>
                        {progressOption}
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
            />
             <div className="rating-slider">
          <p>Rating: {formData.rating}</p>
          <div className="stars">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={index < formData.rating ? "star active" : "star"}
                onClick={() => handleRatingChange(index + 1)}
              >
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
            />
            <label htmlFor="wishlist">Wishlist:</label>
            <input
                type="checkbox"
                id="entry-wishlist-modal"
                name="wishlist"
                checked={formData.wishlist}
                onChange={handleChange}
            />
            <label htmlFor="is_now_playing">Now Playing?:</label>
            <input
                type="checkbox"
                id="entry-is-now-playing-modal"
                name="is_now_playing"
                checked={formData.is_now_playing}
                onChange={handleChange}
            />
            <button type="submit">{editMode ? "Update" : "Create"}</button>
         </form>
        </div>
    )
};

export default EntryModal;
