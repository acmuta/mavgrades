'use client';
import FAQDropdown from "../components/FAQDropdown";
import { Poppins, Montserrat } from "next/font/google";
import { IoHomeOutline } from "react-icons/io5";
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-poppins",
 });
 const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-montserrat",
 });

const FAQs = [
  {
    question: "What is MavGrades?",
    answer:
      "MavGrades is a platform that provides grade distributions for UTA courses and professors, helping students make informed class choices.",
  },
  {
    question: "Who created MavGrades?",
    answer:
      'ACM at UT Arlington! Specifically, the ACM Create committee, which is dedicated to projects just like this one! Check us out at <a href="https://acmuta.com" target="_blank" rel="noopener noreferrer" class="hover:underline text-blue-500">acmuta.com</a> !',
  },
  {
    question: "How do I use MavGrades?",
    answer:
      "Simply search for a course or professor to view the grade distribution data.",
  },
  {
    question: "How does MavGrades acquire its data?",
    answer:
      "MavGrades utilizes official grade distribution data provided by the University of Texas at Arlington (UTA). This data is regularly updated and includes information for all courses taught at UTA since 2020, ensuring that students have access to the most accurate and current information for their academic planning.",
  },
  {
    question: "Why can't I see a section or professor?",
    answer: "If a year or semester is not shown, it means that course was not offered at that time. If your professor doesn't show up, it might be their first semester at UTA! If you believe there to be an issue, please let us know."
  },
  {
    question: "How can I compare professors?",
    answer: "Search for a course, and press the \"Compare Professors\" button, then select up to 3 professors to view side by side comparisons for that course."
  },
  {
    question: "How can I provide feedback, suggestions, or report a bug?",
    answer: 'Please fill out this form for any feedback, suggestions, or to report any bugs: <a href="https://forms.gle/tAhFKDZGwN15vTUz5" target="_blank" rel="noopener noreferrer" class="hover:underline text-blue-500">MavGrades Feedback Form</a>'
  },
  {
    question: "Can I view the MavGrades source code?",
    answer: 'Definitely! View the source code here: <a href="https://github.com/acmuta/mavgrades" target="_blank" rel="noopener noreferrer" class="hover:underline text-blue-500">GitHub: acmuta/mavgrades</a>'
  }
];

const FAQPage = () => {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="absolute top-6 left-30 flex justify-between items-center mb-8">
            <IoHomeOutline
              onClick={() => (window.location.href = "/")}
              className="text-2xl cursor-pointer ml-4 mt-1 text-gray-300"
              aria-label="Home"
            />
        </div>
        <div>
            <div className="flex flex-col items-center w-full mb-10 ">
              <h1 className="text-2xl font-montserrat text-center">
                <span className={`${poppins.className} font-bold text-gray-300`}>
                  MAV
                </span>
                <span className={`${montserrat.className} font-normal text-gray-300`}>
                  GRADES
                </span>
              </h1>
            </div>
        </div>
        <h1 className="text-2xl font-bold mb-10 text-center">
          <span className={`${poppins.className} font-bold text-gray-300`}>
            Frequently Asked Questions
          </span>
        </h1>
        <div className="space-y-4">
          {FAQs.map((faq, index) => (
            <FAQDropdown
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
        
        <div className="mt-10 bottom-0 left-0 right-0 text-center text-xs text-gray-400 p-4">
            Developed by{" "}
            <a
               href="https://github.com/acmuta/mavgrades"
               target="_blank"
               className="hover:underline"
            >
               ACM @ UTA
            </a>
            . Not affiliated with or sponsored by UT Arlington.
            <br />© 2025{" "}
            <a href="https://acmuta.com" className="hover:underline">
               ACM @ UT Arlington
            </a>
            . All rights reserved.
         </div>
      </div>
    );
  };
  
  export default FAQPage;
  