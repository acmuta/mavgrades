import os
import csv
import json

# Edited by Parmesh
courses_info = {}
def csv_to_list_of_dicts(filename):
  with open(filename, 'r') as file:
    reader = csv.DictReader(file)
    for row in reader:
      courses_info[row['code']] = row['title']

# Copyright (c) 2024 Ryan Lahlou
# This script reads all CSV files in the current directory and cleans + combines them into a single JSON file.

def csv_to_combined_json(directory):
  total_data = []
  unique_years = set()
  unique_semesters = set()
  unique_careers = set()
  unique_instructors = set()
  unique_subjectIds = set()
  unique_courseNumbers = set()
  unique_sectionNumbers = set()
  unique_gpas = set()
    
  for filename in os.listdir(directory):
    if filename.endswith(".csv"):
      file_path = os.path.join(directory, filename)
      combined_data = []
      
      with open(file_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
          try:
            row["subject_id"] = row.pop("Subject")
          except KeyError:
            print("Warning: Subject not found")
          
          try: 
            row["course_number"] = row.pop("Catalog Number")
          except KeyError:
            print("Warning: Catalog Number not found")

          # Edited by Parmesh
          try:
            course_code = row["subject_id"] + " " + row["course_number"]
            if course_code in courses_info.keys():
              row["course_title"] = courses_info[course_code]
            else:
              row["course_title"] = ""
              print(f"Warning: Course Title not found for {course_code}")
          except KeyError:
            print(f"Warning: Course Title not found for {course_code} (KeyError)")
          # end of edit
          try:
            row["section_number"] = row.pop("Section Number")
          except KeyError:
            print("Warning: Section Number not found")
          
          # add row R, and set to 0, if it doesn't exist
          try:
            if "R" not in row:
              row["R"] = 0
          except KeyError:
            print("Error: R couldn't be added")
          
          try:
            row["grades"] = {"A": row["A"], "B": row["B"], "C": row["C"], "D": row["D"], "F": row["F"], "I": row["I"], "P": row["P"], "Q": row["Q"], "W": row["W"], "Z": row["Z"], "R": row["R"]}
            row.pop("A")
            row.pop("B")
            row.pop("C")
            row.pop("D")
            row.pop("F")
            row.pop("I")
            row.pop("P")
            row.pop("Q")
            row.pop("W")
            row.pop("Z")
            row.pop("R")
          except KeyError:
            print("Warning: Grades not found")
            
          try: 
            row["grades_count"] = row.pop("Total Grades")
          except KeyError:
            print("Warning: Total Grades not found")
            
          try:
            row["year"] = row["Term"].split(" ")[0]
          except KeyError:
            print("Warning: Year not found")
            
          try: 
            row["semester"] = row["Term"].split(" ")[1]
            row.pop("Term")
          except KeyError:
            print("Warning: Semester or Term not found")
            
          try: 
            row["career"] = row.pop("Course Career")
            row.pop("Academic Career")
          except KeyError:
            print("Warning: Course Career or Academic Career not found")
          
          try: 
            row["instructor1"] = "".join(row.pop("Primary Instructor First Name") + " " + row.pop("Primary Instructor Last Name"))
          except KeyError:
            print("Warning: Primary Instructor not found")
          
          try:
            instructors = row.pop("Non Primary Instructors").split(", ")
            for i in range(1, 5):
              if i <= len(instructors):
                row[f"instructor{i+1}"] = instructors[i-1]
              else:
                row[f"instructor{i+1}"] = ""
          except KeyError:
            print("Warning: Non Primary Instructor(s) not found")
            
          # If instructor 1 is empty, move all values down one, if instructor 2 is empty, move all values down one, etc.
          for i in range(1, 5):
            instructor_row = row[f"instructor{i}"].lower().strip()
            # row1 == " ", row1 == "NO INSTRUCTOR"
            if instructor_row == "" or instructor_row == " " or (instructor_row.count("no") and instructor_row.count("instructor")):
              for j in range(i, 4):
                row[f"instructor{j}"] = row[f"instructor{j+1}"]
              row[f"instructor{6-i}"] = ""
            
          try:
              row.pop("\ufeffAcademic Year")  # Handles BOM-prefixed name
          except KeyError:
              try:
                  row.pop("Academic Year")  # Handles normal name
              except KeyError:
                  print("Warning: Academic Year not removed")
            
          # Compute course_gpa and drop_percent
          try:
            grades_counts = {}
            for grade in ["A", "B", "C", "D", "F", "I", "P", "Q", "W", "Z", "R"]:
              grades_counts[grade] = int(row["grades"].get(grade, 0))

            A_count = grades_counts["A"]
            B_count = grades_counts["B"]
            C_count = grades_counts["C"]
            D_count = grades_counts["D"]
            F_count = grades_counts["F"]
            I_count = grades_counts["I"]
            P_count = grades_counts["P"]
            Q_count = grades_counts["Q"]
            W_count = grades_counts["W"]
            Z_count = grades_counts["Z"]
            R_count = grades_counts["R"]

            # Kevin F 3/31/26: Removed P and R from course_gpa calculation to reflect UTA's grading policy: https://catalog.uta.edu/academicregulations/grades/ 
            total_students = A_count + B_count + C_count + D_count + F_count

            total_grade_points = (
                A_count*4 + B_count*3 + C_count*2 + D_count*1 + F_count*0
            )

            if total_students > 0:
              course_gpa = total_grade_points / total_students
            else:
              course_gpa = None
              
            total_attempted = (
                A_count + B_count + C_count + D_count + F_count +
                I_count + P_count + W_count + Q_count + Z_count + R_count
            )

            if total_attempted > 0:
              drop_percent = (W_count + Q_count) / total_attempted * 100
            else:
              drop_percent = None

            row["course_gpa"] = round(course_gpa, 2) if course_gpa is not None else None
            row["drop_percent"] = round(drop_percent, 2) if drop_percent is not None else None
            
            # if course_gpa is None:
            #   print(f"Warning: no course_gpa for {row['subject_id']} {row['course_number']} {row['section_number']}")
            #   print(row)
            
            if drop_percent is None:
              print(f"Warning: no drop_percent for {row['subject_id']} {row['course_number']} {row['section_number']}")
          except Exception as e:
            print(f"Error computing course_gpa and drop_percent: {e}")
              
          # Update unique values sets
          unique_years.add(row["year"])
          unique_semesters.add(row["semester"])
          unique_careers.add(row["career"])
          unique_subjectIds.add(row["subject_id"])
          unique_courseNumbers.add(row["course_number"])
          unique_sectionNumbers.add(row["section_number"])
          unique_gpas.add(row["course_gpa"])

          for i in range(1, 6):
              instructor = row.get(f"instructor{i}", "").strip()
              if instructor:
                  unique_instructors.add(instructor)
              
          combined_data.append(row)

      print(f"Processed {filename}")
      total_data.append(combined_data)
      
      # write to individual files by sem-year pair
      with open(f"public/data/{str(filename).split('.')[0]}.json", "w", encoding="utf-8") as json_file:
        json.dump(combined_data, json_file, indent=2)
    
    # write to a single file
    with open(current_directory+"/public/data/allgradedata.json", "w", encoding="utf-8") as json_file:
        json.dump(total_data, json_file, indent=2)
    
    # get config values
    unique_values = {
      "year": sorted(unique_years),
      "semester": sorted(unique_semesters),
      "career": sorted(unique_careers),
      "instructor": sorted(unique_instructors),
      "subjectId": sorted(unique_subjectIds),
      "courseNumber": sorted(unique_courseNumbers),
      "sectionNumber": sorted(unique_sectionNumbers),
      "gpa": sorted(g for g in unique_gpas if g is not None)
    }

    with open(f"{current_directory}/public/data/config.js", "w", encoding="utf-8") as f:
      f.write("export const config_data = ")
      json.dump(unique_values, f, indent=2)


if __name__ == "__main__":
  current_directory = os.getcwd()
  csv_to_list_of_dicts(current_directory+"/public/data/courses_data.csv")
  csv_to_combined_json(current_directory+"/public/data/raw")
