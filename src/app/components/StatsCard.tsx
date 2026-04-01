import { useState, useEffect, useRef } from "react";
import BarChart from "./BarChart";
import { GradesInfoCard } from "./GradesInfoCard";
import ProfessorRating from "./ProfessorRating";
import Image from "next/image";
import { Info } from "lucide-react";

// Map Tailwind CSS classes to hex codes if needed
const tailwindColors: { [key: string]: string } = {
  "border-t-blue-400": "#60A5FA",
  "border-t-green-400": "#34D399",
  "border-t-orange-400": "#FBBF24",
  "border-t-teal-400": "#2DD4BF",
  "border-t-rose-400": "#FB7185",
  "border-t-yellow-400": "#FDE047",
};

const StatsCard = ({
  selectedItems,
  selectedProfessor,
}: {
  selectedItems: Map<string, any>;
  selectedProfessor?: string;
}) => {
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [openAverageInfoIndex, setOpenAverageInfoIndex] = useState<number | null>(null);
  const infoBoxRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const averageInfoRef = useRef<HTMLDivElement | null>(null);
  const averageInfoButtonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
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

  const formatGpaValue = (courseGpa: number) => {
    const safeGpa = Number.isFinite(courseGpa)
      ? Math.min(Math.max(courseGpa, 0), 4)
      : 0;
    return `${safeGpa.toFixed(2)}/4.00`;
  };

  const formatGpaPercent = (courseGpa: number) => {
    const safeGpa = Number.isFinite(courseGpa)
      ? Math.min(Math.max(courseGpa, 0), 4)
      : 0;
    return `${Math.floor(safeGpa * 25)}%`;
  };

  const averageGradeExplanation =
    "Course GPA is calculated from the grade distribution using UTA grade points: A=4, B=3, C=2, D=1, F=0. Grades like P, W, Q, I, R, and Z are excluded from GPA per UTA policy. This card shows the GPA directly on a 4.00 scale.";

  const InfoBox = ({
    label,
    value,
    colorClass,
    isProf = false,
    infoIndex,
    onInfoToggle,
    showInfo,
  }: {
    label: string;
    value: string | number;
    colorClass: string;
    isProf?: boolean;
    infoIndex?: number;
    onInfoToggle?: (index: number) => void;
    showInfo?: boolean;
  }) => {
    const textColor = tailwindColors[colorClass] || "#FFFFFF";
    const hasInfo =
      typeof infoIndex === "number" && typeof onInfoToggle === "function";

    return (
      <div
        className={`relative flex flex-col bg-gray-200 bg-opacity-10 p-3 gap-2 w-1/3 rounded-lg font-bold drop-shadow-lg border-t-4 ${colorClass} hover:drop-shadow-xl transition-transform ease-in-out duration-300`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-white text-xs sm:text-base">{label}</span>
          {hasInfo && (
            <button
              ref={(el) => {
                if (el && typeof infoIndex === "number") {
                  averageInfoButtonRefs.current.set(infoIndex, el);
                }
              }}
              type="button"
              className="text-white/80 hover:text-white transition-colors"
              title="How this is calculated"
              aria-label="How average grade is calculated"
              onClick={() => onInfoToggle(infoIndex)}
            >
              <Info size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm sm:text-lg" style={{ color: textColor }}>
            {value}
          </span>
          {isProf && (
            <a
              href={getRMPUrl(value.toString())}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-[5%] text-white hover:text-gray-300 transition-colors"
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
          )}
        </div>
        {hasInfo && showInfo && (
          <div
            ref={averageInfoRef}
            className="absolute top-9 right-2 w-64 bg-gray-700 border border-gray-400 rounded-md p-3 text-xs text-gray-100 normal-case z-30"
          >
            <p>{averageGradeExplanation}</p>
            <a
              href="https://catalog.uta.edu/academicregulations/grades/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-300 hover:text-blue-200 underline"
            >
              View UTA grading policy
            </a>
          </div>
        )}
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

      if (openAverageInfoIndex !== null) {
        const currentButton = averageInfoButtonRefs.current.get(openAverageInfoIndex);
        const clickedOutsideAveragePopover =
          averageInfoRef.current &&
          !averageInfoRef.current.contains(event.target as Node);
        const clickedOutsideAverageButton =
          !currentButton || !currentButton.contains(event.target as Node);

        if (clickedOutsideAveragePopover && clickedOutsideAverageButton) {
          setOpenAverageInfoIndex(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInfoBox, openAverageInfoIndex]);

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
                    label="COURSE GPA"
                    value={formatGpaValue(Number(aggregatedData[0].course_gpa))}
                    colorClass={colorClasses[4]}
                    infoIndex={0}
                    showInfo={openAverageInfoIndex === 0}
                    onInfoToggle={(index) =>
                      setOpenAverageInfoIndex((prev) =>
                        prev === index ? null : index
                      )
                    }
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
                        label="COURSE GPA"
                        value={formatGpaValue(Number(sectionData.course_gpa))}
                        colorClass={colorClass}
                        infoIndex={index + 1}
                        showInfo={openAverageInfoIndex === index + 1}
                        onInfoToggle={(toggleIndex) =>
                          setOpenAverageInfoIndex((prev) =>
                            prev === toggleIndex ? null : toggleIndex
                          )
                        }
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
