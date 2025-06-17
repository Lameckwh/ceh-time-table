"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const teamMembers = [
    "Lucius Malizani",
    "Hopkins Ceaser",
    "Joseph Dzanja",
     "Lameck Mbewe",
  ];

  // State for current facilitator index
  const [facilitatorIndex, setFacilitatorIndex] = useState(() => {
    if (typeof window !== "undefined") {
      const savedIndex = localStorage.getItem("facilitatorIndex");
      return savedIndex !== null ? parseInt(savedIndex, 10) % teamMembers.length : 0;
    }
    return 0;
  });

  // State for selected facilitator name
  const [selectedFacilitator, setSelectedFacilitator] = useState<string | null>(null);

  // State for next meeting date
  const [nextMeetingDate, setNextMeetingDate] = useState("");

  // State for accordion open/closed
  const [openWeek, setOpenWeek] = useState<number | null>(null);

  // State for choose button visibility
  const [showChooseButton, setShowChooseButton] = useState(false);

  // State for facilitator name visibility
  const [showFacilitatorName, setShowFacilitatorName] = useState(false);

  // CEH Study Timetable Data
  const timetable = [
    {
      week: "Week 1 (June 10–15)",
      title: "Introduction + Domain 1: Information Security and Ethical Hacking",
      details: [
        "Concepts: InfoSec fundamentals, hacking phases, attack vectors, threat categories",
        "Tools: Terminology",
        "Task: Set up lab environment",
      ],
    },
    {
      week: "Week 2 (June 16–22)",
      title: "Domain 2: Footprinting and Reconnaissance",
      details: [
        "Techniques: Active/passive footprinting, Whois, Google hacking",
        "Tools: Maltego, Recon-ng",
        "Lab: Perform footprinting",
      ],
    },
    {
      week: "Week 3 (June 23–29)",
      title: "Domain 3: Scanning Networks",
      details: [
        "Techniques: Ping sweep, port scanning",
        "Tools: Nmap, Zenmap",
        "Lab: Scan a test",
      ],
    },
    {
      week: "Week 4 (June 30–July 6)",
      title: "Domain 4: Enumeration",
      details: [
        "Techniques: NetBIOS, SNMP, SMTP",
        "Tools: enum4linux",
        "Lab: Enumerate a target",
      ],
    },
    {
      week: "Week 5 (July 7–13)",
      title: "Domain 5: Vulnerability Analysis",
      details: [
        "Techniques: Vulnerability assessment",
        "Tools: Nessus, OpenVAS",
        "Lab: Scan vulnerabilities",
      ],
    },
    {
      week: "Week 6 (July 14–20)",
      title: "Domain 6: System Hacking",
      details: [
        "Topics: Password cracking, escalation",
        "Tools: John the Ripper",
        "Lab: Crack shell",
      ],
    },
    {
      week: "Week 7 (July 21–27)",
      title: "Domain 7: Malware Threats",
      details: [
        "Types: Trojans, worms",
        "Tools: Maltego, PEiD",
        "Lab: Analyze malware",
      ],
    },
    {
      week: "Week 8 (July 28–August 3)",
      title: "Domain 8: Sniffing",
      details: [
        "Techniques: Packet sniffing, MITM",
        "Tools: Wireshark",
        "Lab: Sniff traffic",
      ],
    },
    {
      week: "Week 9 (August 4–10)",
      title: "Domain 9: Social Engineering",
      details: [
        "Techniques: Phishing, tailgating",
        "Tools: SET",
        "Activity: Simulate phishing",
      ],
    },
    {
      week: "Week 10 (August 11–17)",
      title: "Domain 10: Denial-of-Service",
      details: [
        "Attacks: Volumetric, protocol",
        "Tools: LOIC, Hping",
        "Lab: DoS simulation",
      ],
    },
    {
      week: "Week 11 (August 18–24)",
      title: "Domains 11–12: Session Hijacking, IDS Evasion",
      details: [
        "Topics: Session interception, evasion",
        "Tools: Burp Suite",
        "Lab: Simulate hijacking",
      ],
    },
    {
      week: "Week 12 (August 25–31)",
      title: "Domains 13–14: Web and Wireless Hacking",
      details: [
        "Attacks: SQLi, XSS, WPA",
        "Tools: SQLMap, Aircrack",
        "Lab: Exploit web app",
      ],
    },
    {
      week: "Week 13 (September 1–6)",
      title: "Domains 15–20: Mobile, Cloud, Crypto",
      details: [
        "Topics: Encryption, mobile",
        "Tools: OpenSSL",
        "Lab: Secure mobile",
      ],
    },
    {
      week: "Final Review (September 7–10)",
      title: "Final",
      details: [
        "Tasks: Take 2 practice exams",
        "Review: Weak areas",
        "Lab: Revisit labs",
      ],
    },
  ];

  // Function to get next Tuesday or Thursday
  const getNextMeetingDate = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    let daysUntilNextMeeting = 0;

    if (dayOfWeek <= 1) daysUntilNextMeeting = 2 - dayOfWeek; // Sunday to Monday -> Tuesday
    else if (dayOfWeek === 2) daysUntilNextMeeting = 2; // Tuesday -> Thursday
    else if (dayOfWeek === 3) daysUntilNextMeeting = 1; // Wednesday -> Thursday
    else if (dayOfWeek === 4) daysUntilNextMeeting = 5; // Thursday -> Tuesday
    else daysUntilNextMeeting = 2 + (7 - dayOfWeek); // Friday to Saturday -> Tuesday

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilNextMeeting);
    return nextDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Check button and facilitator name visibility
  const checkVisibility = () => {
    const now = new Date();
    const catTime = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Harare" }));
    const day = catTime.getDay();
    const hours = catTime.getHours();
    const hasChosen = localStorage.getItem(`chosen_${catTime.toDateString()}`);

    // Show button at 8 PM on Tuesday or Thursday if not chosen
    const isButtonTime = (day === 2 || day === 4) && hours >= 20 && hours < 21 && !hasChosen;
    setShowChooseButton(isButtonTime);

    // Show facilitator name after selection until 9 PM if chosen
    const isNameVisible = (day === 2 || day === 4) && !!hasChosen && hours < 21;
    setShowFacilitatorName(isNameVisible);
  };

  // Update meeting date and check visibility every minute
  useEffect(() => {
    setNextMeetingDate(getNextMeetingDate());
    checkVisibility();
    const interval = setInterval(checkVisibility, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle Choose Facilitator button click
  const handleChooseFacilitator = () => {
    const now = new Date();
    const catTime = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Harare" }));
    // Select the next facilitator in round-robin
    const newIndex = (facilitatorIndex + 1) % teamMembers.length;
    setFacilitatorIndex(newIndex);
    setSelectedFacilitator(teamMembers[newIndex]);
    localStorage.setItem("facilitatorIndex", newIndex.toString());
    localStorage.setItem(`chosen_${catTime.toDateString()}`, "true");
    setShowChooseButton(false);
    setShowFacilitatorName(true);
    setNextMeetingDate(getNextMeetingDate());
  };

  // Toggle accordion week
  const toggleWeek = (index: number) => {
    setOpenWeek(index === openWeek ? null : index);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-900 text-white font-mono">
      <div className="max-w-screen-xl mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-cyan-400">
            Ethical Hacking Study Group
          </h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Facilitator Section */}
          <div className="lg:w-1/2 flex flex-col items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gray-800 dark:bg-gray-900 rounded-lg shadow-lg">
            <h2 className="text-xl sm:text-2xl font-semibold text-cyan-300">
              Facilitator Schedule
            </h2>
            <div className="flex flex-col gap-3 sm:gap-4 text-center">
              {showFacilitatorName && selectedFacilitator && (
                <p className="text-base sm:text-lg leading-relaxed">
                  <strong>Current Facilitator:</strong> {selectedFacilitator}
                </p>
              )}
              <p className="text-base sm:text-lg leading-relaxed">
                <strong>Next Meeting:</strong> {nextMeetingDate}
              </p>
              {showChooseButton && (
                <div className="flex flex-col gap-3 sm:gap-4 items-center">
                  <p className="text-base sm:text-lg font-medium leading-relaxed">
                    Select today&apos;s facilitator
                  </p>
                  <button
                    onClick={handleChooseFacilitator}
                    className="rounded-full bg-cyan-600 text-white px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg hover:bg-cyan-700 transition-colors min-w-[120px]"
                  >
                    Choose Facilitator
                  </button>
                </div>
              )}
            </div>
            {/* Information Section */}
            <div className="mt-4 sm:mt-6 p-4 bg-gray-700 dark:bg-gray-800 rounded-md">
              <h3 className="text-base sm:text-lg font-semibold text-cyan-300 mb-2">
                Facilitator Selection Process
              </h3>
              <p className="text-sm sm:text-base leading-relaxed">
                The app assigns facilitators for Tuesday and Thursday meetings using a round-robin algorithm to ensure all members prepare. At 8 PM CAT, a &quot;Choose Facilitator&quot; button appears. Clicking it selects the next team member, displays their name, and hides the button. The name disappears at 9 PM CAT. The facilitator list cycles through: Lucius Malizani, Hopkins Ceaser, Lameck Mbewe, Joseph Dzanja.
              </p>
            </div>
          </div>

          {/* Timetable Accordion */}
          <div className="lg:w-1/2 flex flex-col gap-4 p-4 sm:p-6 bg-gray-800 dark:bg-gray-900 rounded-lg shadow-lg">
            <h2 className="text-xl sm:text-2xl font-semibold text-center text-cyan-300">
              CEH Study Timetable
            </h2>
            <div className="space-y-2 overflow-auto max-h-[calc(100vh-200px)]">
              {timetable.map((week, index) => (
                <div key={index} className="border-b border-gray-600">
                  <button
                    onClick={() => toggleWeek(index)}
                    className="w-full flex justify-between items-center p-3 sm:p-4 text-left text-base sm:text-lg font-medium bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors rounded-t-md"
                  >
                    <span className="leading-relaxed">{week.week}: {week.title}</span>
                    <span>{openWeek === index ? "−" : "+"}</span>
                  </button>
                  {openWeek === index && (
                    <div className="p-3 sm:p-4 bg-gray-100 dark:bg-gray-200 text-gray-900 dark:text-gray-800 rounded-b-md">
                      <ul className="list-disc pl-5 space-y-1 sm:space-y-2">
                        {week.details.map((detail, i) => (
                          <li key={i} className="text-sm sm:text-base leading-relaxed">
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-6 sm:mt-8 text-center">
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Built for Ethical Hacking v13 Certification Study Group
          </p>
        </footer>
      </div>
    </div>
  );
}