export interface Course {
    id: string;
    name: string;
    holes: number; // number of holes in the course
    par: number[]; // array of par values for each hole
  }
  
  export interface Player {
    id: string;
    name: string;
  }
  
  export interface Score {
    playerId: string;
    holeNumber: number;
    score: number;
  }
  
  export interface Scorecard {
    id: string;
    courseId: string;
    players: Player[];
    scores: Score[]; // one entry per score update
    date: string;
  }