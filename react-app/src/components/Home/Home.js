import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkAllEntries, thunkDeleteEntry, thunkEditEntry} from '../../store/entryReducer';
import { thunkAllComments } from '../../store/commentReducer';
import { thunkAllMemoryCards } from '../../store/memoryReducer';
import './Home.css';
import EntryModal from '../EntryModal/EntryModal';
import OpenModalButton from '../OpenModalButton';
import DeleteEntryModal from '../DeleteEntryModal/DeleteEntryModal';
import EditEntryModal from '../EditEntryModal/EditEntryModal';
import CommentModal from '../CommentsModal/CommentModal';
import EditCommentModal from '../CommentInfoModal/CommentInfoModal';
import DeleteCommentModal from '../DeleteCommentModal/DeleteCommentModal';
import MemoryCardModal from '../MemoryCardModal/MemoryCardModal';
import EditMemoryCardModal from '../EditMemoryCardModal/EditMemoryCardModal';
import DeleteMemorycardModal from '../DeleteMemoryCardModal/DeleteMemoryCardModal';
const Home = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [loadingMemoryCards, setLoadingMemoryCards] = useState(true);
  const [error, setError] = useState(null);
  const [errorComments, setErrorComments] = useState(null);
  const [errorMemoryCards, setErrorMemoryCards] = useState(null);
  const allEntries = useSelector((state) => state.entries.allEntries.entries);
  const allComments = useSelector((state) => state.comments.allComments.comments);
  console.log('allComments', allComments);
  const allMemoryCards = useSelector((state) => (state.memoryCards.allMemoryCards.memory_cards));
  console.log('allMemoryCards', allMemoryCards);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 4;
  const [deletingEntryId, setDeletingEntryId] = useState(null);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [currentMemoryCardPage, setCurrentMemoryCardPage] = useState(1);
  const memoryCardsPerPage = 2;
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const commentsPerPage = 2;

  useEffect(() => {
    dispatch(thunkAllEntries())
      .then(() => setLoading(false))
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  }, [dispatch, currentPage]);

  useEffect(() => {
    dispatch(thunkAllComments())
      .then(() => setLoadingComments(false))
      .catch((err) => {
        setLoadingComments(false);
        setErrorComments(err.message);
      })
  }, [dispatch]);

  useEffect(() => {
    dispatch(thunkAllMemoryCards())
      .then(() => setLoadingMemoryCards(false))
      .catch((err) => {
        setLoadingMemoryCards(false);
        setErrorMemoryCards(err.message);
      })
  }, [dispatch]);


  const [selectedComment, setSelectedComment] = useState(null);

  const handleCommentClick = (comment) => {
      setSelectedComment(comment);
  };

  const closeCommentInfoModal = () => {
      setSelectedComment(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = allEntries.slice(indexOfFirstEntry, indexOfLastEntry);

  // const indexOfLastMemoryCard = currentMemoryCardPage * memoryCardsPerPage;
  // const indexOfFirstMemoryCard = indexOfLastMemoryCard - memoryCardsPerPage;
  // const currentMemoryCards = allMemoryCards.slice(indexOfFirstMemoryCard, indexOfLastMemoryCard);

  // const indexOfLastComment = currentCommentPage * commentsPerPage;
  // const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  // const currentComments = allComments.slice(indexOfFirstComment, indexOfLastComment);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="home-container">
      <h2>Home</h2>
      <div className="home-wrapper">
        <div className="home-memory-card">
          <h2>Memory-Cards</h2>
          <OpenModalButton
            modalComponent={<MemoryCardModal onClose={() => console.log('Modal closed')} /> }
            buttonText="New Memory Card!"
            />
          {loadingMemoryCards ? (
            <p>Loading memory cards...</p>
          ) : errorMemoryCards ? (
            <p>Error loading memory cards : {errorMemoryCards}</p>
          ) : (
            <div className="memory-cards">
              {console.log('allMemoryCards LOADING', allMemoryCards)}
             {allMemoryCards.map((memoryCard) => (
  <div key={memoryCard.id} className="memorycards">
    {console.log('memorycard log info', memoryCard.log_info)}
    <p>Memory Card: {memoryCard.log_info}</p>
    <div className="memorycard-buttons">
    <p>Memory Card: {memoryCard.log_info}</p>
    <OpenModalButton
      modalComponent={<EditMemoryCardModal memoryCard={memoryCard} onClose={() => {}} />}
      buttonText={"Edit"}
      />
      <OpenModalButton
        modalComponent={<DeleteMemorycardModal memoryCard={memoryCard} onDelete={() => {}} />}
        buttonText={"Delete"}
        />
        </div>
  </div>
))}
          </div>
          )}
        </div>
        <div className="home-entries">
          <div className="upper-entry">

          <h2>Entries</h2>
          <OpenModalButton
            modalComponent={<EntryModal onClose={() => console.log('Entry modal closed')} />}
            buttonText="New Entry!"
          />
          </div>
          <div className="entry-grid">

          {currentEntries.length === 0 ? (
            <div className="entries-item-placeholder">
              <p>No entries found.</p>
            </div>
          ) : (
            currentEntries.map((entry) => (
              <div key={entry.id} className="entries-item">
                <div className="entry-card">
                  {/* Entry details */}
                  <div className="entry-cover">
                      <h3>{entry.game_name || 'No Game Name'}</h3>
                    </div>
                  <div className="entry-details">
                  <p>System: {entry.system || 'No System Available'}</p>
                  <p>Region: {entry.region || 'No Region Available'}</p>
                  <p>Progress: {entry.progress}</p>
                  <p>Progress Note: {entry.progress_note}</p>
                  <p>Now Playing: {entry.is_now_playing ? 'Yes' : 'No'}</p>
                  <p>Wishlist: {entry.wishlist ? 'Yes' : 'No'}</p>
                  {entry.rating !== null ? <p>Rating: {entry.rating}</p> : <p>'No rating available.</p>}
                  {entry.review_text !== '' ? <p>Review: {entry.review_text}</p> : <p>No review available.</p>}
                  <OpenModalButton
                    modalComponent={
                      <EditEntryModal
                        selectedEntryData={entry}
                        onSubmit={async (updatedEntry) => {
                          setEditingEntryId(null);
                        }}
                        onCancel={() => setEditingEntryId(null)}
                      />
                    }
                    buttonText="Edit"
                  />
                   <OpenModalButton
                    modalComponent={
                      <DeleteEntryModal
                        entryId={entry.id}
                        onDelete={async (entryId) => {
                          setDeletingEntryId(null);
                        }}
                        onCancel={() => setDeletingEntryId(null)}
                      />
                    }
                    buttonText="Delete"
                    onButtonClick={() => setDeletingEntryId(entry.id)}
                  />
                  {/* ... (entry details rendering) */}
                </div>
              </div>
          </div>
            ))
          )}
          {/* Pagination controls */}
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>{currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={indexOfLastEntry >= allEntries.length}
            >
              Next
            </button>
          </div>
          </div>
        </div>
        <div className="home-dialogue-box">
          <h2>Dialogue </h2>
          <OpenModalButton
          modalComponent={<CommentModal />}
          buttonText={"Add Comment"}
          />
          {loadingComments ? (
            <p>Loading comments...</p>
          ) :errorComments ? (
            <p>Error loading comments: {errorComments}</p>
          ) : (
            <div className="comments">
            {allComments.map((comment) => (
                <div key={comment.id} className='comment-item'>
                  <div className="comment-background">

                    <p>{comment.comment_text}</p>
                    <div className="comments-details">
                    <p>Comment: {comment.comment_text}</p>
                    <OpenModalButton
                        modalComponent={<EditCommentModal comment={comment} onClose={() => {}} />}
                        buttonText={"Edit"}
                    />
                    <OpenModalButton
                      modalComponent={<DeleteCommentModal comment={comment} onDelete={() => {}} />}
                      buttonText={"Delete"}
                    />
                </div>
                </div>
              </div>
            ))}
        </div>

    )}
</div>

      </div>
    </div>
  );
};

export default Home;
