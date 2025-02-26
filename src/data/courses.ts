// src/data/courses.ts

import { Course } from "../models/types";

export const courses: Course[] = [
  {
    id: "course1",
    name: "Sunnyvale Disc Golf",
    holes: 18,
    par: [3, 3, 4, 3, 3, 4, 3, 3, 4, 3, 3, 4, 3, 3, 4, 3, 3, 4],
  },
  {
    id: "course2",
    name: "Mountain View Park",
    holes: 9,
    par: [3, 3, 4, 3, 3, 4, 3, 3, 4],
  },
  {
    id: "course3",
    name: "Palo Alto Disc Golf",
    holes: 18,
    par: [3, 4, 3, 5, 3, 4, 3, 3, 4, 3, 3, 4, 5, 3, 4, 3, 3, 4],
  },
  {
    id: "course4",
    name: "Redwood City Course",
    holes: 18,
    par: [4, 3, 4, 3, 5, 4, 3, 3, 4, 3, 4, 4, 3, 3, 5, 3, 4, 4],
  },
  {
    id: "course5",
    name: "San Jose Disc Golf",
    holes: 9,
    par: [3, 4, 3, 3, 4, 3, 4, 3, 4],
  },
  {
    id: "course6",
    name: "Golden Gate Park",
    holes: 18,
    par: [3, 4, 5, 3, 3, 4, 3, 4, 4, 3, 3, 5, 4, 3, 4, 3, 3, 4],
  },
];