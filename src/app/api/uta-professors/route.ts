import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const alpha = searchParams.get("alpha");

  if (!alpha) {
    return NextResponse.json(
      { error: "Alpha parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.web.uta.edu/DM/courses/instructors?alpha=${alpha}&sortby=LName`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "MAVGrades/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`UTA API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error fetching UTA professor data:", error);
    return NextResponse.json(
      { error: "Failed to fetch UTA professor data" },
      { status: 500 }
    );
  }
}
