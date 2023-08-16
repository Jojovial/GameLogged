import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import { thunkAddMemoryCard, thunkAllMemoryCards } from "../../store/memoryReducer";
import { useModal } from "../../context/Modal";

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
        <div>
          <h2>Create Memory Card</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Select Entry:
              <select value={selectedEntry} onChange={(e) => setSelectedEntry(e.target.value)}>
                <option value="">Select an entry</option>
                {entries.map(entry => (
                  <option key={entry.id} value={entry.id}>
                    {entry.game_name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Log Information:
              <textarea value={logInfo} onChange={(e) => setLogInfo(e.target.value)} />
            </label>
            <button type="submit">Create</button>
          </form>
        </div>
      );
    };
export default MemoryCardModal;
