// TODO: Create an interface for the Candidate objects returned by the API
export interface Candidate {
    id: number;
    login: string;
    location: string;
    avatar_url: string;
    email: string | null;
    company: string | null;
    bio: string | null;
  }