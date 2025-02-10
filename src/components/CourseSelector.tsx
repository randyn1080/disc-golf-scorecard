// src/components/CourseSelector.tsx

import React from "react";
import { Course } from "../models/types";

interface CourseSelectorProps {
  courses: Course[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({
  courses,
  selectedCourseId,
  onSelectCourse,
}) => {
  return (
    <div>
      <label htmlFor="course-select">Select a Course:</label>
      <select
        id="course-select"
        value={selectedCourseId}
        onChange={(e) => onSelectCourse(e.target.value)}
      >
        <option value="">--Choose a Course--</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CourseSelector;