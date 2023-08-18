import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import { thunkAddMemoryCard, thunkAllMemoryCards } from "../../store/memoryReducer";
import { useModal } from "../../context/Modal";
import './MemoryCardModal.css';
const MemoryCardModal = () => {
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    const entries = useSelector(state => state.entries.allEntries.entries);

    const [selectedEntry, setSelectedEntry] = useState("");
    const [logInfo, setLogInfo] = useState("");

    useEffect(() => {
        dispatch(thunkAllMemoryCards());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(selectedEntry && logInfo) {
            dispatch(thunkAddMemoryCard({ entry_id: selectedEntry, log_info: logInfo }));
            dispatch(thunkAllMemoryCards());
            closeModal();
        }
    }

    return (
        <div className='memorycard-modal'>
          <h2>Create Memory Card</h2>
          <form onSubmit={handleSubmit} className="memorycard-form">
            <div className="memorycard-modal-info">

            <label>
              Select Entry:
              <select value={selectedEntry} onChange={(e) => setSelectedEntry(e.target.value)} className="memorycard-select">
                <option value="">Select an entry</option>
                {entries.map(entry => (
                  <option key={entry.id} value={entry.id}>
                    {entry.game_name}
                  </option>
                ))}
              </select>
            </label>

              <textarea value={logInfo} onChange={(e) => setLogInfo(e.target.value)} className="memorycard-create-textarea" />

            <button type="submit" className="memorycard-create-button">Create</button>
              </div>
          </form>
        </div>
      );
    };
export default MemoryCardModal;
