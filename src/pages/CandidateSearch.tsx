import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser} from '../api/API';
import { Candidate } from "../interfaces/Candidate.interface";

const CandidateSearch: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [_savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);

    useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      const data = await searchGithub();
      if (data.length === 0) {
        setError('No candidates available.');
      } else {
        setCandidates(data);
        setError(null);
      }
      setLoading(false);
    };

    fetchCandidates();
  }, []);
 

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      if (candidates.length > 0) {
        const candidateDetails = await searchGithubUser(candidates[currentIndex].login);
        console.log(candidateDetails);
        setCurrentCandidate(candidateDetails);
    }
    };
   fetchCandidateDetails();
  }, [candidates, currentIndex]);

  const handleSave = () => {
    if (currentCandidate) {
      const candidateToSave = currentCandidate;
      const savedCandidatesFromStorage = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
  
      if (!savedCandidatesFromStorage.find((c: Candidate) => c.id === candidateToSave.id)) {
        savedCandidatesFromStorage.push(candidateToSave);
        localStorage.setItem('savedCandidates', JSON.stringify(savedCandidatesFromStorage));
  
        setSavedCandidates(savedCandidatesFromStorage);
      }
      moveToNextCandidate();
    }
  };

  const handleSkip = () => {
    moveToNextCandidate();
  };

  const moveToNextCandidate = () => {
    if (currentIndex + 1 < candidates.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setError('No more candidates available.');
    }
  };

  if (loading) {
    return <p>Loading candidates...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="candidate-search">
      {currentCandidate ? (
        <div className="candidate-card">
          <img src={currentCandidate.avatar_url} alt={`${currentCandidate.login}'s avatar`} width={100} />
          <h2>{currentCandidate.login}</h2>
          <p><strong>Location:</strong> {currentCandidate.location || 'N/A'}</p>
          <p><strong>Email:</strong> {currentCandidate.email || 'N/A'}</p>
          <p><strong>Company:</strong> {currentCandidate.company || 'N/A'}</p>
          <p><strong>Bio:</strong> need to complete</p>
          <div className="buttons">
            <button onClick={handleSave}>+</button>
            <button onClick={handleSkip}>-</button>
          </div>
        </div>
      ) : (
        <p>No candidate to display.</p>
      )}
    </div>
  );
};

export default CandidateSearch;
