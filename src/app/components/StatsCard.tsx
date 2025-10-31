import { useState, useEffect, useRef } from "react";
import BarChart from "./BarChart";
import { GradesInfoCard } from "./GradesInfoCard";
import ProfessorRating from "./ProfessorRating";
import Image from "next/image";

// Map Tailwind CSS classes to hex codes if needed
const tailwindColors: { [key: string]: string } = {
  "border-t-blue-400": "#60A5FA",
  "border-t-green-400": "#34D399",
  "border-t-orange-400": "#FBBF24",
  "border-t-teal-400": "#2DD4BF",
  "border-t-rose-400": "#FB7185",
  "border-t-yellow-400": "#FDE047",
};

// Interface for UTA professor data
interface UTAProfessor {
  userName: string;
  instructorName: string;
  nameProfileLink: string;
  email: string;
  workingTitle: string;
}

const StatsCard = ({
  selectedItems,
  selectedProfessor,
}: {
  selectedItems: Map<string, any>;
  selectedProfessor?: string;
}) => {
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [utaProfessors, setUtaProfessors] = useState<{
    [key: string]: UTAProfessor;
  }>({});
  const infoBoxRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const aggregatedData = Array.from(selectedItems.values());

  const colorClasses = [
    "border-t-blue-400",
    "border-t-green-400",
    "border-t-orange-400",
    "border-t-teal-400",
    "border-t-rose-400",
    "border-t-yellow-400",
  ];

  // Determine the line color (use the first color class or a default)
  const lineColor =
    tailwindColors[colorClasses[0]] || colorClasses[0] || "#57D2DD";

  const getRMPUrl = (professorName: string) => {
    return `https://www.ratemyprofessors.com/search/professors/1343?q=${encodeURIComponent(
      professorName
    )}`;
  };

  // Function to extract last name from full professor name
  const extractLastName = (fullName: string): string => {
    const parts = fullName.trim().split(" ");
    return parts[parts.length - 1];
  };

  // Function to fetch UTA professor data
  const fetchUTAProfessor = async (
    professorName: string
  ): Promise<UTAProfessor | null> => {
    try {
      const lastName = extractLastName(professorName);
      const firstLetter = lastName.charAt(0).toUpperCase();

      console.log(
        `Fetching UTA data for professor: ${professorName}, lastName: ${lastName}, firstLetter: ${firstLetter}`
      );

      const response = await fetch(`/api/uta-professors?alpha=${firstLetter}`);

      if (!response.ok) {
        throw new Error("Failed to fetch UTA professor data");
      }

      const professors: UTAProfessor[] = await response.json();
      console.log(
        `Found ${professors.length} professors for letter ${firstLetter}`
      );

      // Find the professor by matching the last name
      const matchedProfessor = professors.find((prof) =>
        prof.instructorName.toLowerCase().includes(lastName.toLowerCase())
      );

      console.log(`Matched professor:`, matchedProfessor);
      return matchedProfessor || null;
    } catch (error) {
      console.error("Error fetching UTA professor data:", error);
      return null;
    }
  };

  // Effect to fetch UTA professor data for all professors in aggregatedData
  useEffect(() => {
    const fetchAllProfessors = async () => {
      const professorPromises = aggregatedData
        .filter((data) => data?.instructor1)
        .map(async (data) => {
          const professorName = data.instructor1;
          if (!utaProfessors[professorName]) {
            const utaProf = await fetchUTAProfessor(professorName);
            if (utaProf) {
              return { [professorName]: utaProf };
            }
          }
          return null;
        });

      const results = await Promise.all(professorPromises);
      const newProfessors = results.reduce((acc, result) => {
        if (result) {
          return { ...acc, ...result };
        }
        return acc;
      }, {} as { [key: string]: UTAProfessor });

      if (newProfessors && Object.keys(newProfessors).length > 0) {
        setUtaProfessors((prev) => ({ ...prev, ...newProfessors }));
      }
    };

    if (aggregatedData.length > 0) {
      fetchAllProfessors();
    }
  }, [aggregatedData]);

  const InfoBox = ({
    label,
    value,
    colorClass,
    isProf = false,
  }: {
    label: string;
    value: string | number;
    colorClass: string;
    isProf?: boolean;
  }) => {
    const textColor = tailwindColors[colorClass] || "#FFFFFF";
    const utaProf = isProf ? utaProfessors[value.toString()] : null;

    return (
      <div
        className={`flex flex-col bg-gray-200 bg-opacity-10 p-3 gap-2 w-1/3 rounded-lg font-bold drop-shadow-lg border-t-4 ${colorClass} hover:drop-shadow-xl transition-transform ease-in-out duration-300`}
      >
        <span className="text-white text-xs sm:text-base">{label}</span>
        <div className="flex items-center gap-1">
          <span className="text-sm sm:text-lg" style={{ color: textColor }}>
            {value}
          </span>
          {isProf && (
            <div className="flex items-center gap-1 ml-[5%]">
              {utaProf && (
                <a
                  href={utaProf.nameProfileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors"
                  title={`View ${value} UTA Profile`}
                >
                  <Image
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAADPUlEQVR4nO2cy2oUQRSGPxUkXqKgogY3iiRRFwY34iMIutMYIupS3YgbfYGshARECSZmDIi+gXHnAyQEQUEENyJqFDJxIyZioqGksAZ0MCE9092nevr/4N8MQ50+p6rreqpBCCGEEEIIIYQQQgghhBAiHrYB54EKMA1UgaWgavhtDOgH2q0ftpXoBsaB74BboxaAB0Cn9cMXmc3AEPAzQeDr5d+OQaDN2pmi0Qm8aiLw9ZoCOqydKgrHQp/uUtYM0GPtXBFafjWD4Nf0UW/CyrQBLzMMfk3Pw/gi6hjKIfg1DdQbLzvdTc52kmpeXdG/jOcY/JpGjBpblCvcBYMK8Da1YubP9oIzUp9164uBimEF3Ld2PgamDStg0tr5GJgzrIBZa+djYNGwAn5YOx8Di6oAW+bUBdkyrUHYljHDChg19j0K+g0r4Jy18zHQbrgVsdXa+TJvxlWsnY6JrnCAnlfw/dT3oLXTsTGYYwXcsnY21iPJyZyOJDdZOxsre4EPGQb/M7DP2snY6QkpJFlkRBy1dq4odIRkqrSC77s2JWY1MCYMhAP0RgO/FAZcpSY2+TaMJFyszYd5vqaaKa+Y+8L+zVQ4TFkMmg2/jYbtBa1whRBCCFEsDgPbMyzfl30ow/ILyQ7gJvAizOF7M7TVG2x4WzeC7dJyYIUF1t0MbQ7/Z8F2D9hPidgF3FklH6ia0XaxL/PLCjb9s9wGdtLiXFolCO4vXc7A9pU12PU5Shdo0VY/kWAvZw7YnaL9PQkTwJ600ttwIuzFJ93JnAA2pGDfl/G0AfvvgeMUnDMJPzHg6vQIWN+E/XXhkwXNJO/6vKVCchFYbsJ5F/QsHFU20u010vLrtVzEccHPt3+l4LwL+hQG0Y1rsO3/czWc/6Zl39/gPEtBOJ1hjs9MmMufCrfqtwR1BbvDGZ0n16aq3m70932/ZhQAF4G+AUeIFH8K9TqCILmM9SZcrY2OxxEEx+Wkh0TGyQiC4nJWNOOBT/l4F0FAXM56G0u6y/UIguGMdI0ISHO+7Qom77s5ruQyx5Vc5riSyxxXcpnjSi5zXMlljiu5zHEllzmu5BJCCCGEEEIIIYQQQgghhGA1fgNFTgVKFFEfrwAAAABJRU5ErkJggg=="
                    alt="UTA Profile"
                    width="28"
                    height="28"
                    className="mr-1 filter invert"
                  />
                </a>
              )}
              <a
                href={getRMPUrl(value.toString())}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                title={`View ${value} on Rate My Professor`}
              >
                <Image
                  src="rmp.svg"
                  alt="RMP"
                  width="30"
                  height="30"
                  className="mr-1"
                />
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showInfoBox &&
        infoBoxRef.current &&
        !infoBoxRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowInfoBox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInfoBox]);

  // Check if multiple professors are selected
  const isComparingMode = selectedItems.size > 1;

  return (
    <div className="w-full lg:w-2/3 mt-10 mx-auto relative">
      {aggregatedData.length > 0 && aggregatedData[0] ? (
        <div className="flex flex-col p-4 rounded-lg shadow-md h-full gap-4 bg-gray-200 bg-opacity-10 mb-6 relative">
          {/* Info Button */}
          <button
            ref={buttonRef}
            className="absolute top-4 right-4 text-white bg-gray-400 bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center font-bold z-20"
            title="Info"
            onClick={() => setShowInfoBox((prev) => !prev)}
            // style={{ backgroundColor: lineColor }}
          >
            i
          </button>
          {/* Info Box Modal */}
          {showInfoBox && (
            <div
              ref={infoBoxRef}
              className="absolute top-12 right-4 bg-gray-500 p-4 rounded-lg shadow-lg w-72 border border-gray-300 z-10"
            >
              <GradesInfoCard />
            </div>
          )}
          <h2 className="text-xl sm:text-2xl mt-4 font-extrabold mb-1 text-center text-white drop-shadow-md">
            {aggregatedData[0]?.subject_id && aggregatedData[0]?.course_number
              ? `${aggregatedData[0].subject_id} ${
                  aggregatedData[0].course_number
                } ${
                  aggregatedData[0].course_title
                    ? aggregatedData[0].course_title
                    : ""
                }`
              : "Course Information"}
          </h2>
          <div className="border-b-4 rounded border-gray-500 w-1/2 mx-auto mb-3 px-10"></div>{" "}
          {/* Render differently depending on the number of items */}
          {aggregatedData.length === 1 ? (
            <div className="flex flex-col gap-4 mr-0.5 ml-0.5">
              <div className="flex flex-row gap-4 justify-evenly">
                {aggregatedData[0]?.instructor1 && (
                  <InfoBox
                    label="PROFESSOR"
                    value={aggregatedData[0].instructor1}
                    colorClass={colorClasses[0]}
                    isProf={true}
                  />
                )}
                {aggregatedData[0]?.year && (
                  <InfoBox
                    label="SECTION"
                    value={`${aggregatedData[0].semester} ${aggregatedData[0].year}-${aggregatedData[0]?.section_number}`}
                    colorClass={colorClasses[1]}
                  />
                )}
                {aggregatedData[0]?.grades_count && (
                  <InfoBox
                    label="TOTAL STUDENTS"
                    value={aggregatedData[0].grades_count}
                    colorClass={colorClasses[2]}
                  />
                )}
              </div>
              <div className="flex flex-row gap-4 justify-evenly">
                {aggregatedData[0]?.section_number && (
                  <InfoBox
                    label="PASS RATE"
                    value={`${Math.ceil(
                      ((Number(aggregatedData[0].grades_A) +
                        Number(aggregatedData[0].grades_B) +
                        Number(aggregatedData[0].grades_C) +
                        Number(aggregatedData[0].grades_P)) /
                        Number(aggregatedData[0].grades_count)) *
                        100
                    )}%`}
                    colorClass={colorClasses[3]}
                  />
                )}
                {aggregatedData[0]?.course_gpa && (
                  <InfoBox
                    label="AVERAGE GRADE"
                    value={Math.floor(aggregatedData[0].course_gpa * 25) + `%`}
                    colorClass={colorClasses[4]}
                  />
                )}
                {aggregatedData[0]?.grades_count && (
                  <InfoBox
                    label="WITHDRAWAL RATE"
                    value={`${Math.ceil(
                      ((Number(aggregatedData[0].grades_W) +
                        Number(aggregatedData[0].grades_Q)) /
                        Number(aggregatedData[0].grades_count)) *
                        100
                    )}%`}
                    colorClass={colorClasses[5]}
                  />
                )}
              </div>
            </div>
          ) : (
            // Multiple items, display as lines
            aggregatedData.map((sectionData, index) => {
              const colorClass = colorClasses[index % colorClasses.length];
              return (
                <div
                  key={index}
                  className={`flex flex-col sm:flex-row justify-center sm:-mr-20 gap-1 bg-opacity-10 hover:drop-shadow-xl transition-transform ease-in-out duration-300`}
                >
                  <div className="lg:ml-14 md:ml-14 w-full flex flex-row gap-2 justify-center">
                    {sectionData?.instructor1 && (
                      <InfoBox
                        label="PROFESSOR"
                        value={sectionData.instructor1}
                        colorClass={colorClass}
                        isProf={true}
                      />
                    )}
                    {sectionData?.year && (
                      <InfoBox
                        label="SECTION"
                        value={`${sectionData.semester} ${sectionData.year}-${sectionData.section_number}`}
                        colorClass={colorClass}
                      />
                    )}
                    {sectionData?.grades_count && (
                      <InfoBox
                        label="TOTAL STUDENTS"
                        value={sectionData.grades_count}
                        colorClass={colorClass}
                      />
                    )}
                  </div>
                  <div className="w-full flex flex-row gap-2 justify-center sm:justify-normal sm:ml-1">
                    {sectionData?.section_number && (
                      <InfoBox
                        label="PASS RATE"
                        value={`${Math.ceil(
                          ((Number(sectionData.grades_A) +
                            Number(sectionData.grades_B) +
                            Number(sectionData.grades_C)) /
                            Number(sectionData.grades_count)) *
                            100
                        )}%`}
                        colorClass={colorClass}
                      />
                    )}
                    {sectionData?.course_gpa && (
                      <InfoBox
                        label="AVERAGE GRADE"
                        value={`${Math.floor(sectionData.course_gpa * 25)}%`}
                        colorClass={colorClass}
                      />
                    )}
                  </div>
                </div>
              );
            })
          )}
          {/* Pass the grades and colors to the BarChart */}
          <BarChart grades={aggregatedData} colors={colorClasses} />
          {/* Only show the professor rating if it's not in comparing mode */}
          {!isComparingMode && selectedProfessor && (
            <ProfessorRating professorName={selectedProfessor} />
          )}
        </div>
      ) : (
        <div className="bg-gray-200 bg-opacity-10 rounded-lg shadow-md p-4 text-center">
          <p className="text-white">
            Select a professor or course to see more information.
          </p>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
