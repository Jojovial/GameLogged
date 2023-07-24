import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkEditEntry, thunkEditGame, thunkEditReview } from '../../store/entryReducer';
import { thunkAllEntries } from '../../store/entryReducer';
import './EntryForm.css';

const EntryForm = ({initialFormData, onSubmit, onCancel}) => {
    console.log('before useState',initialFormData);
    const dispatch = useDispatch();
    const [formVisible, setFormVisible] = useState(true);
    const [updatedEntry, setUpdatedEntry] = useState(null);
    const [formData, setFormData] = useState({ ...initialFormData });
    console.log('initial form data that we need',initialFormData);
    useEffect(() => {
        console.log("initialFormData has changed", initialFormData);
        setFormData({...initialFormData});
    }, [initialFormData]);
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





    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData((prevData) => ({
          ...prevData,
          [name]: newValue,
        }));
      };

      const handleRatingChange = (rating) => {
        setFormData((prevData) => ({
          ...prevData,
          rating: rating,
        }));
      };

      const handleCancel = () => {
        // For example, if you want to reset the form fields to their initial values when the user cancels:
        setFormData({ ...initialFormData });
        onCancel();
        setFormVisible(false);
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(thunkEditEntry(initialFormData.id, formData));

            const gameDataChanged = initialFormData.name !== formData.name || initialFormData.system !== formData.system || initialFormData.region !== formData.region;
            if (gameDataChanged) {
              await dispatch(thunkEditGame(initialFormData.game_id, formData));
            }

            const reviewDataChanged = initialFormData.rating !== formData.rating || initialFormData.review_text !== formData.review_text;
            if (reviewDataChanged) {
              await dispatch(thunkEditReview(initialFormData.review_id, formData));
            }
            await onSubmit(formData);
          } catch (error) {
            console.error("Error updating entry:", error);
          } finally {
            setFormVisible(false);
          }
      };
      if (!formVisible) {
        return null;
      }
      console.log('data being typed',formData);

      return (
        <form onSubmit={handleSubmit} className="entry-form">
          {/* Game Name */}
          <label htmlFor="name">Game Name:</label>
          <input
            type="text"
            id="entry-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* System */}
          <label htmlFor="system">System:</label>
          <select
            id="entry-system"
            name="system"
            value={formData.system}
            onChange={handleChange}
            required
          >
            {SYSTEM_CHOICES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* Region */}
          <label htmlFor="region">Region:</label>
          <select
            id="entry-region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
          >
            {REGION_CHOICES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* Progress */}
          <label htmlFor="progress">Progress:</label>
          <select
            id="entry-progress"
            name="progress"
            value={formData.progress}
            onChange={handleChange}
            required
          >
            {PROGRESS_CHOICES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* Progress Note */}
          <label htmlFor="progress_note">Progress Note:</label>
          <input
            type="text"
            id="entry-progress-note"
            name="progress_note"
            value={formData.progress_note}
            onChange={handleChange}
          />

          {/* Rating */}
          <div className="rating-slider">
            <p>Rating: {formData.rating}</p>
            <div className="stars">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={
                    index < formData.rating ? 'star active' : 'star'
                  }
                  onClick={() => handleRatingChange(index + 1)}
                >
                  {index + 1} &#9733;
                </span>
              ))}
            </div>
          </div>

          {/* Review */}
          <label htmlFor="review_text">Review:</label>
          <input
            type="text"
            id="entry-review"
            name="review_text"
            value={formData.review_text}
            onChange={handleChange}
          />

          {/* Wishlist */}
          <label htmlFor="wishlist">Wishlist:</label>
          <input
            type="checkbox"
            id="entry-wishlist"
            name="wishlist"
            checked={formData.wishlist}
            onChange={handleChange}
          />

          {/* Now Playing */}
          <label htmlFor="is_now_playing">Now Playing?:</label>
          <input
            type="checkbox"
            id="entry-is-now-playing"
            name="is_now_playing"
            checked={formData.is_now_playing}
            onChange={handleChange}
          />

          <button type="submit">Update</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
          {updatedEntry && (
        <p style={{ color: 'green' }}>Entry has been successfully updated!</p>
      )}
        </form>
      );
    };

export default EntryForm;
