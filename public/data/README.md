# UTA Grade Data Info

## License

The data provided within the software is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)** license. The license can be found [here](../../LICENSE).

## Maintenance

1. Add new grade data to the `public/data/raw` directory.
2. In a terminal, run `node run process` to process the raw data and update the `public/data/grades.sqlite` database.
   - Note: This requires Node/NPM and Python to be installed on a machine.
   - Note: If there are dependency errors, run `npm install` in the root directory to install the necessary dependencies.

## Requesting New Grade Data

Email to `publicrecords@uta.edu` with the following template:

```md
Dear Public Records,

I hope this message finds you well. My name is *** INSERT NAME HERE ***, and I am writing on behalf of the Association for Computing Machinery at the University of Texas at Arlington (ACM UTA).

We are requesting access to grade distribution records under the Freedom of Information Act (FOIA) for the purpose of updating MavGrades, a student-run website that displays course grade statistics to enhance academic transparency and assist students with course selection.

We would like to request data on grade distributions for the following semesters:
- Fall 2024
- Spring 2025
- Summer 2025

The dataset should follow the exact CSV structure below to ensure compatibility with our software:
- Academic Year
- Term
- Academic Career
- Course Career
- Primary Instructor First Name
- Primary Instructor Last Name
- Non Primary Instructors
- Subject
- Catalog Number
- Section Number
- A
- B
- C
- D
- F
- I
- P
- Q
- W
- Z
- R
- Total Grades

An example CSV is attached for reference, and previous semester datasets can be viewed here:
https://github.com/acmuta/utagrades/tree/main/public/data.

Please provide each semester’s data as an independent CSV file formatted identically to the attached *** ATTACH A RECENT SEMESTER CSV TO THE EMAIL AND REFERENCE THE SEMESTER HERE *** example.

Thank you very much for your time and assistance.

Best regards,
*** INSERT NAME HERE ***
*** YOUR ROLE ***, Association for Computing Machinery at UTA
```
