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
];