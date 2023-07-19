import React, {useState, useEffect} from "react";
import { useDispatch } from "react-redux";
import { thunkAddEntry, thunkEditEntry } from "../../store/entryReducer";

const EntryModal = ({ closeModal, editMode, initialFormData }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        progress: '',
        progress_note: '',
        is_now_playing: false,
        wishlist: false,
        name: '',
        system: '',
        region: '',
        rating: 0,
        review_text: ''
    });

    useEffect(() => {
        if(editMode && initialFormData) {
            setFormData(initialFormData)
        }
    }, [editMode, initialFormData])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            dispatch(thunkEditEntry(formData));
        } else {
            dispatch(thunkAddEntry(formData));
        }
        closeModal();
    };

    const handleRatingChange = (rating) => {
        setFormData((prevData) => ({
            ...prevData,
            rating: rating,
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
                {Object.values(System).map((systemOption) => (
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
                {Object.values(Region).map((regionOption) => (
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
                {Object.values(Progress).map((progressOption) => (
                    <option key={progressOption} value={progressOption}>
                        {progressOption}
                    </option>
                ))}
            </select>
            <label htmlFor="progress-note">Progress Note:</label>
            <input
                type="text"
                id="entry-progress-note-modal"
                name="progress-note"
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
            <label htmlFor="review-text">Review:</label>
            <input
                type="text"
                id="entry-review-modal"
                name="review-text"
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
            <label htmlFor="is-now-playing">Now Playing?:</label>
            <input
                type="checkbox"
                id="entry-is-now-playing-modal"
                name="is-now-playing"
                checked={formData.is_now_playing}
                onChange={handleChange}
            />
            <button type="submit">{editMode ? "Update" : "Create"}</button>
         </form>
        </div>
    )
};

export default EntryModal;
