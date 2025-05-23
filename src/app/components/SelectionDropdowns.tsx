import React, { useEffect } from "react";

// TODO: import this from SideBar.tsx
interface SelectionDropdownsProps {
   selectedProfessor: string;
   selectedCourseSubject: string | null;
   selectedYear: string | null;
   setSelectedYear: (year: string | null) => void;
   selectedSemester: string | null;
   setSelectedSemester: (semester: string | null) => void;
   finalFilteredCourses: Array<{
      subject_id: string;
      course_number: string;
      semester: string;
      year: string;
      section_number: string;
   }>;
   selectedCourse: string;
   selectedSection: {
      subject_id: string;
      course_number: string;
      semester: string;
      year: string;
      section_number: string;
   } | null;
   setSelectedSection: (
      section: {
         subject_id: string;
         course_number: string;
         semester: string;
         year: string;
         section_number: string;
      } | null
   ) => void;
   years: string[];
   semesters: string[];
}

const SelectionDropdowns: React.FC<SelectionDropdownsProps> = ({
   selectedProfessor,
   selectedCourseSubject,
   selectedYear,
   setSelectedYear,
   selectedSemester,
   setSelectedSemester,
   finalFilteredCourses,
   selectedCourse,
   selectedSection,
   setSelectedSection,
   years,
   semesters,
}) => {
   // Set the latest year and semester when the professor or course changes
   useEffect(() => {
      const courseMatches = finalFilteredCourses.filter(
         (course) =>
            `${course.subject_id} ${course.course_number}` === selectedCourse
      );

      if (courseMatches.length > 0) {
         // Sort courses to find the latest year and semester
         const sortedCourses = [...courseMatches].sort(
            (a, b) =>
               parseInt(b.year) - parseInt(a.year) ||
               semesters.indexOf(b.semester) - semesters.indexOf(a.semester)
         );

         const latestCourse = sortedCourses[0];

         // Only set year, semester, and section if not already set
         if (!selectedYear) setSelectedYear(latestCourse.year);
         if (!selectedSemester) setSelectedSemester(latestCourse.semester);
         if (!selectedSection) setSelectedSection(latestCourse);
      }
   }, [
      selectedProfessor,
      selectedCourse,
      finalFilteredCourses,
      semesters,
      selectedYear,
      selectedSemester,
      selectedSection,
      setSelectedYear,
      setSelectedSemester,
      setSelectedSection,
   ]);
   return (
      <div>
         <h2 className="text-l text-center text-white font-bold mb-4">
            {`Sections for Professor: ${selectedProfessor}`}
         </h2>
         <div className="border-b-2 rounded border-gray-400 mx-auto mb-4 px-10"></div>{" "}
         {/* Year Dropdown */}
         <div className="mb-4">
            <label
               htmlFor="year"
               className="text-white block font-semibold mb-1"
            >
               Select Year:
            </label>
            <select
               id="year"
               value={selectedYear || ""}
               onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setSelectedSection(null);
                  setSelectedSemester(null);
               }}
               className="border border-gray-400 bg-gray-700 bg-opacity-50 text-white p-2 rounded-lg w-full"
            >
               <option value="" disabled>
                  Select a year
               </option>
               {years.map((year, index) => (
                  <option key={index} value={year}>
                     {year}
                  </option>
               ))}
            </select>
         </div>
         {/* Semester Dropdown */}
         <div className="mb-4">
            <label
               htmlFor="semester"
               className="text-white block font-semibold mb-1"
            >
               Select Semester:
            </label>
            <select
               id="semester"
               value={selectedSemester || ""}
               onChange={(e) => {
                  setSelectedSemester(e.target.value);
                  setSelectedSection(null);
               }}
               className="border border-gray-400 bg-gray-700 bg-opacity-50 text-white p-2 rounded-lg w-full"
               disabled={!selectedYear} // Disable if selectedYear is not set
            >
               <option value="" disabled>
                  Select a semester
               </option>
               {semesters.map((semester, index) => (
                  <option key={index} value={semester}>
                     {semester}
                  </option>
               ))}
            </select>
         </div>
         {/* Section List */}
         {selectedYear && selectedSemester && (
            <div className="mb-4">
               <label
                  htmlFor="sectionDropdown"
                  className="block text-white font-semibold mb-1"
               >
                  Select Section:
               </label>
               <select
                  id="sectionDropdown"
                  value={selectedSection?.section_number || ""}
                  onChange={(e) => {
                     const selectedSectionNumber = e.target.value;
                     const selectedCourse = finalFilteredCourses.filter((course) =>
                        selectedCourseSubject ? course.subject_id === selectedCourseSubject : true
                     )
                     // const selectedCourse = finalFilteredCourses
                     .find(
                        (course) =>
                           course.section_number === selectedSectionNumber &&
                           course.year === selectedYear &&
                           course.semester === selectedSemester
                     );
                     setSelectedSection(selectedCourse || null); // Set the selected section
                  }}
                  className="border border-gray-400 bg-gray-700 bg-opacity-50 text-white p-2 rounded-lg w-full"
               >
                  <option value="" disabled>
                     -- Select a section --
                  </option>
                  {finalFilteredCourses
                     .filter((course) => {
                        const [subjectId, courseNumber] =
                           selectedCourse.split(" ");
                        return (
                           course.subject_id === subjectId &&
                           course.course_number === courseNumber &&
                           course.year === selectedYear &&
                           course.semester === selectedSemester
                        );
                     })
                     .map((course) => (
                        <option
                           key={course.section_number}
                           value={course.section_number}
                        >
                           {course.semester} {course.year} Section:{" "}
                           {course.section_number}
                        </option>
                     ))}
               </select>
            </div>
         )}
      </div>
   );
};

export default SelectionDropdowns;
