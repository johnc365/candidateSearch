import { useState, useEffect } from 'react';
import { searchGithub} from '../api/API';
import { Candidate } from "../interfaces/Candidate.interface";

const CandidateSearch: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('savedCandidates');
    if (saved) {
      setSavedCandidates(JSON.parse(saved));
    }
  }, []);

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
    localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
  }, [savedCandidates]);

  const handleSave = () => {
    if (candidates[currentIndex]) {
      const candidateToSave = candidates[currentIndex];
      
      if (!savedCandidates.find((c) => c.id === candidateToSave.id)) {
        setSavedCandidates([...savedCandidates, candidateToSave]);
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

  const currentCandidate = candidates[currentIndex];

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
