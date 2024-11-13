import { NextRequest, NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import fetch from "node-fetch";

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

async function getDatabaseConnection() {
  if (!db) {
    db = await open({
      filename: './public/data/grades.sqlite',
      driver: sqlite3.Database,
    });
  }
  return db;
}

async function trackSearchInGA(query: string | null, course: string | null, professor: string | null) {
  const GA_TRACKING_ID = "G-DENV8F61LB";
  console.log("Tracking GA Event", { query, course, professor });
  await fetch("https://www.google-analytics.com/collect", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      v: "1",  // Protocol version
      tid: GA_TRACKING_ID,
      cid: "101",  // Client ID (Static for server-side)
      t: "event",  // Event type
      ec: "Search",  // Event category
      ea: "query",  // Event action
      el: query || course || professor || "",
      ev: "1", 
    }),
  });
}

export async function GET(request: NextRequest) {
  const db = await getDatabaseConnection();
  const searchParams = new URL(request.url).searchParams;
  const searchInput = searchParams.get("query") || "";
  const course = searchParams.get("course") || "";
  const professor = searchParams.get("professor") || "";
  const sort = searchParams.get("sort") || "course_number";
  const direction = searchParams.get("direction") || "asc";

  let suggestions = [];
  let courses = [];

  try {
    if (searchInput || course || professor) {
      await trackSearchInGA(searchInput, course, professor);
    }

    if (searchInput) {
      const input = searchInput.trim().toLowerCase();
      
      // Fetch matching course suggestions and professor names
      suggestions = await db.all(
        `SELECT DISTINCT 
            subject_id || ' ' || course_number || ' ' || course_title AS suggestion, 
            'course' AS type,
            CASE 
                WHEN LOWER(subject_id || ' ' || course_number || course_title) = LOWER(?) THEN 1
                WHEN INSTR(LOWER(subject_id || ' ' || course_number || course_title), LOWER(?)) = 1 THEN 2
                WHEN INSTR(LOWER(subject_id || ' ' || course_number || course_title), LOWER(?)) > 0 THEN 3
                ELSE 4
            END AS score
         FROM allgrades
         WHERE INSTR(LOWER(subject_id || ' ' || course_number || course_title), ?) > 0
         UNION 
         SELECT DISTINCT 
            instructor1 AS suggestion, 
            'professor' AS type,
            CASE 
                WHEN LOWER(instructor1) = LOWER(?) THEN 1
                WHEN INSTR(LOWER(instructor1), LOWER(?)) = 1 THEN 2
                WHEN INSTR(LOWER(instructor1), LOWER(?)) > 0 THEN 3
                ELSE 4
            END AS score
         FROM allgrades
         WHERE INSTR(LOWER(instructor1), ?) > 0

         ORDER BY score, suggestion
         LIMIT 20`,  // Limit to 20 suggestions
        [input, input, input, input, input, input, input, input]
      );
      
    }

    // Fetch course details based on the course parameter
    if (course) {
      const input = course.trim().toLowerCase();
      courses = await db.all(
        `SELECT DISTINCT subject_id, course_number, course_title, instructor1, section_number, semester, year, course_gpa,
          grades_count, grades_A, grades_B, grades_C, grades_D, grades_F, grades_I, grades_P, grades_Q, 
          grades_W, grades_Z, grades_R
          FROM allgrades
          WHERE LOWER(subject_id || ' ' || course_number) = ?
          ORDER BY ${sort} ${direction}`, 
        [input]
      );
    }

    // Fetch courses taught by a professor
    if (professor) {
      const input = professor.trim().toLowerCase();
      courses = await db.all(
        `SELECT DISTINCT subject_id, course_number, course_title, instructor1, section_number, semester, year, course_gpa,
          grades_count, grades_A, grades_B, grades_C, grades_D, grades_F, grades_I, grades_P, grades_Q, 
          grades_W, grades_Z, grades_R
         FROM allgrades
         WHERE LOWER(instructor1) LIKE ?
         ORDER BY ${sort} ${direction}`, 
        [`%${input}%`]
      );
    }

    // Return suggestions or course details based on what's requested
    if (suggestions.length > 0) {
      return NextResponse.json(suggestions);
    } else {
      return NextResponse.json(courses);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
