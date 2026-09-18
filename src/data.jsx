// Portfolio data — projects, emojis, project case study content.
// Exposed on window for use across babel scripts.

// Asset resolver: uses the inlined blob URL (set by the standalone bundler on
// window.__resources) when present, otherwise falls back to the relative path.
window.ASSET = (id, path) => (window.__resources && window.__resources[id]) || path;

// ── Where to put your own photos ───────────────────────────────────────────
// Every image on the site is driven by a `src` path you set in code. Drop your
// files into the assets/ folder and point these at them, e.g. "assets/me.jpg".
//   • Portrait (About page):     window.PORTRAIT_SRC below
//   • Project thumbnails (Home): add `img:` to a PROJECTS entry
//   • Emoji hover photos:        add `img:` to an EMOJIS entry
//   • Project cover image:       `coverSrc` on a PROJECT_PAGE entry
//   • Case-study section images: `figures: [{ src, caption }]` on a section
//   • Galleries / journey / archive: `src` on each item in the data below
window.PORTRAIT_SRC = "assets/about/headshot-w.png"; // e.g. "assets/portrait.jpg"

const PROJECTS = [
  {
    id: "searchneu",
    title: "SearchNEU",
    blurb: "Mobile redesign for a course search engine",
    role: "Lead Designer",
    year: "2024",
    duration: "12 weeks",
    team: "Solo design, 4 engineers",
    thumb: "stripe",
    color: "rgb(232, 76, 76)",
    // Video thumbnail — plays silently on the home page (no controls).
    video: "assets/searchneu/searchneu-demo.mp4",
    // Percentages, not px: a fixed-px inset covers fewer source rows when the
    // video renders smaller (short viewports), letting the baked-in border
    // rows peek through. A % crop scales with the rendered box.
    videoCrop: "1.4% 0.5% 1.4% 0.5%",
  },
  {
    id: "jfk",
    title: "JFK Airport",
    blurb: "Streamlining visitor security escort requests",
    role: "Product Designer, Reuters Studio",
    year: "2023",
    duration: "8 weeks",
    team: "2 designers, PM, 5 engineers",
    thumb: "stripe",
    color: "rgb(21, 60, 110)",
    img: "assets/projectThumbnails/jfk.png",
    // Video thumbnail — plays silently on the home page (no controls).
    // Same recording as the case study's first figure, in browser chrome.
    video: "assets/jfk/full-demo.mp4",
    videoStart: 4,
    videoFrame: "jfkt4.nyc/escort-portal",
  },
  {
    id: "ecolab",
    title: "Reuters x Ecolab",
    blurb: "Promoting water sustainability for industry",
    role: "Designer, Reuters Studio",
    year: "2023",
    duration: "10 weeks",
    team: "Designer, editor, dev, illustrator",
    thumb: "stripe",
    color: "rgb(34, 110, 90)",
    //img: "assets/projectThumbnails/ecolab.avif",
    // Video thumbnail — plays silently on the home page (no controls).
    // Same recording as the case study's first figure, in browser chrome.
    video: "assets/ecolab/desktop-scroll.mp4",
    videoFrame: "plus.reuters.com",
  },
  {
    id: "pomodoro",
    title: "The Pomodoro Timer",
    blurb: "A non-distracting yet satisfying way to stay focused",
    role: "Sole Designer",
    year: "2023",
    duration: "",
    team: "Solo",
    thumb: "stripe",
    color: "rgb(196, 30, 58)",
    img: "assets/playground/design/thumbs/pomodoro.jpg",
    video: "assets/playground/design/pomodoro/demo-2-watches.mp4",
    videoBg: "#fefefe",
    // Renders as a smaller rounded card inside the panel, not full-bleed.
    imgInset: true,
  },
];

const EMOJIS = [
  {
    char: "🍵",
    title: "I love matcha",
    body: "Not just for the taste, but also the ritual of making it.",
    img: "assets/funPics/emojiHovers/matcha-sm.png",
  },
  {
    char: "🐉",
    title: "Chinese dragon dance",
    body: "I learned and performed dragon dance in college!",
    img: "assets/funPics/emojiHovers/dragondance-sm.png",
  },
  {
    char: "📷",
    title: "Capturing the world",
    body: "I mostly use a Canon EOS R50, which is a small but mighty camera.",
    img: "assets/funPics/emojiHovers/camera-sm.png",
  },
  {
    char: "🍽️",
    title: "Certified foodie",
    body: "Follow me on Beli @serenang to see my restaurant rankings!",
    src: "assets/funPics/emojiHovers/ramen-sm.png",
    img: "assets/funPics/emojiHovers/ramen-sm.png",
  },
  {
    char: "💻",
    title: "Always tinkering",
    body: "Currently dabbling in using AI to develop my designs fast!",
    img: "assets/funPics/emojiHovers/tinkering-sm2.png",
  },
  {
    char: "🧋",
    title: "Boba lover",
    body: "My go-to drink is earl grey milk tea with grass jelly (less sugar & less ice).",
    img: "assets/funPics/emojiHovers/boba-sm.png",
  },
  {
    char: "🎧",
    title: "Music and concerts",
    body: "I listen to a mix of pop, k-pop, r&b, lo-fi, and soundtracks.",
    img: "assets/funPics/emojiHovers/concert-sm.png",
  },
  {
    char: "☕",
    title: "Espresso making",
    body: "I have a small home coffee bar with a Casabrews CM5418.",
    img: "assets/funPics/emojiHovers/coffee-sm.png",
    // Video hover card — loops silently, no controls.
    video: "assets/funPics/emojiHovers/espresso.mp4",
  },
];

// Project case study sections (used on /projects/searchneu page)
const PROJECT_PAGE = {
  pomodoro: {
    title: "The Pomodoro Timer",
    subtitle: "A non-distracting, convenient, yet satisfying way to manage time on the Apple Watch.",
    underConstruction: true,
    archiveSlug: "pomodoro-timer",
  },

  searchneu: {
    title: "SearchNEU",
    subtitle: "Redesigning the mobile experience for a course search engine.",
    cover: "image",
    // Cover image at the top of the page — swap this path to change it.
    coverSrc: "assets/searchneu/cover-angled-screens-w.png",
    eyebrowDate: "2024-2025",
    tags: ["Redesign", "Mobile", "UX Design", "UX Research"],
    meta: [
      { label: "Role", value: "UX Design Lead", sub: "Interaction Design, Visual Design,\nUser Flows, Prototyping, UX Research" },
      { label: "Team", value: "1 UX Design Lead\n1 UX Designer\n4 Developers\n1 Project Manager" },
      { label: "Timeline & Status", value: "4 Months\nLaunched in 2025" },
    ],
    sections: [
      {
        id: "overview",
        eyebrow: "01",
        navLabel: "Overview",
        title: "Overview",
        body: [
          "SearchNEU is a course search engine separate from Northeastern University's registration system. It offers better search and filtering, and sends text message alerts to students when seats open in high-demand classes.",
          "SearchNEU was built desktop-first, with mobile compatibility added later in a rush — but students increasingly used it on the go, especially during registration when limited seats meant scrambling for alternatives last second.",
          "I led the redesign of the mobile experience, turning what had been a major drop-off point into an experience students actually reach for.",
        ],
        stats: [
          { value: "38,000+", label: "students served" },
          { value: "25,000+", label: "seat opening alerts sent a month" },
        ],
        figures: [
          { videoSrc: "assets/searchneu/demo-2-phones.mp4", caption: "Walkthrough of the redesigned mobile flow." },
        ],
      },
      {
        id: "context",
        eyebrow: "02",
        navLabel: "Context",
        title: "SearchNEU's mobile experience was so unintuitive that users never opened it on mobile again.",
        body: [],
        figures: [
          { src: "assets/searchneu/old-mobile-3-phones-w.png", caption: "SearchNEU's original mobile screens." },
        ],
        quotes: [
          { text: "I don't get why people keep telling me to use SearchNEU for course registration, I opened it before and it genuinely sucked. I could barely even select the search filters.", author: "First-year student" },
          { text: "Don't use it on the phone, there's too much scrolling to compare classes. Just open it on your laptop when you're home.", author: "Third-year student" },
          { text: "Why is everything a toggle within a toggle. I can't see any course info after searching!!", author: "Graduate student" },
          { text: "I think the developers gave up on mobile lol.", author: "Second-year CS student" },
          { text: "This class filled up so now I don't even know what to register for, and I can't check what fills the same requirements til I get home cuz nothing works on mobile.", author: "Fourth-year engineering student" },
          { text: "Too much text… too much reading… I already gave up.", author: "First-year international student" },
        ],
      },
      {
        id: "problem",
        eyebrow: "03",
        navLabel: "The Problem",
        title: "The most important course info was hard to reach on mobile because SearchNEU wasn't built for small screens.",
        highlight: true,
        body: [
          "The mobile experience was fundamentally bad at its one job: letting students compare courses easily and quickly. Toggles nested inside toggles and huge blocks of text meant scrolling through walls and tapping through several layers to reach the information students actually wanted.",
          "SearchNEU was designed desktop-first, with mobile added later in a rush. As the desktop version received regular updates, mobile stayed the same slapped-together experience. It was finally time to give mobile the attention it deserved.",
        ],
        figures: [
          { src: "assets/searchneu/desktop-search-results-w.png", caption: "SearchNEU's search results page on desktop, which received the majority of design attention." },
        ],
      },
      {
        id: "improvements",
        eyebrow: "04",
        navLabel: "Solution",
        title: "A redesigned mobile experience built for a smaller screen and larger touch areas.",
        highlight: true,
        highlightLabel: "Our Solution",
        body: [
          "Rather than squeezing the desktop layout onto a phone, we rebuilt the flow around how students actually search on mobile — and brought it in line with what desktop already offered.",
        ],
        subsections: [
          {
            kicker: "Faster scannability",
            title: "The most important info available at a glance. No more digging through toggles.",
            body: [
              "The redesigned search results screen has clearer hierarchy, more efficient use of the screen, and more information on each course card for quick comparison.",
              "Nested toggles were removed and replaced with a dedicated course details page, and the cramped header was rebuilt to make the search bar far easier to see and tap.",
            ],
            figures: [
              { src: "assets/searchneu/ba-search-results-w.png", caption: "Before and after: the course search results page." },
              { src: "assets/searchneu/anno-search-results-v3.png", caption: "The redesigned search results page, annotated." },
            ],
          },
          {
            kicker: "Easier search filters",
            title: "Finally, a filter selector built for mobile.",
            body: [
              "The previous filter modal was buggy and confusing. The redesign overlays the filters on top of the search page and grays it out, so users never feel like they've navigated somewhere else.",
              "The modal is a bottom sheet that's easy to reach one-handed and expandable by swiping up when more room is needed. A three-option selector switches between Northeastern's schools (NEU, CPS, and LAW), matching desktop's functionality.",
            ],
            bulletsTitle: "Key improvements",
            bullets: [
              "Overlay design — keeps users visibly on the same page",
              "Bottom sheet modal — easily reachable while holding a phone",
              "Adjustable size — expandable by swiping up",
              "School selector — quickly switch between NEU, CPS, and LAW",
              "Collapsible filter sections — less clutter, cleaner UI",
              "Clear filters button and applied filter indicators",
              "Larger tap areas built for mobile",
            ],
            figures: [
              { src: "assets/searchneu/ba-filters-w.png", caption: "Before and after: the filter selector." },
              { videoSrc: "assets/searchneu/demo-filters.mp4", caption: "The redesigned filter selector in use." },
            ],
          },
          {
            kicker: "A dedicated page for course details",
            navLabel: "Course details",
            title: "Detailed course information in a page students can save and share.",
            body: [
              "The search results page's nested toggles were replaced with a dedicated course details page. This declutters the design and leaves room for more information without burying it.",
              "It also brings mobile in line with desktop, so students no longer have to switch to a laptop to see everything about a course — and because it's a real page, a course they've found can be saved or sent as a link.",
            ],
            figures: [
              { src: "assets/searchneu/ba-course-details-w.png", caption: "Before and after: the mobile course details experience." },
              { src: "assets/searchneu/anno-course-details-v3.png", caption: "The dedicated course details page, annotated." },
            ],
          },
          {
            kicker: "Consistency with desktop",
            title: "Designs that match across desktop and mobile.",
            body: [
              "Previously the desktop version carried more information and features, like dedicated course detail pages. Aligning visual design, information, and functionality across both removed a major source of user confusion.",
            ],
            figures: [
              { src: "assets/searchneu/matches-desktop-w.png", caption: "The redesigned mobile experience alongside desktop." },
              { src: "assets/searchneu/anno-notifs-table-v2.png", caption: "Translating desktop's notifications table to mobile, annotated." },
            ],
          },
          {
            kicker: "Easily turn on notifications",
            navLabel: "Notifications",
            title: "Compact, scannable seat opening alerts across course sections.",
            body: [
              "When you really need to get into one class, you can sign up for alerts across every section — except maybe that 8:00 AM one.",
              "Course sections used to be space-inefficient and hard to compare at a glance, which matters when a course typically has five or more. Switching from cards to a table with clearer hierarchy makes sections easy to scan and compare, streamlining the decision of which alerts to turn on — and matches desktop.",
            ],
            bulletsTitle: "Key improvements",
            bullets: [
              "Better hierarchy and readability — for faster section comparisons",
              "More compact design — less clutter, improved scannability",
              "Campus filter — easily find courses at the right location",
              "New section alerts — get notified when a section is added",
            ],
            figures: [
              { src: "assets/searchneu/ba-notifications-w.png", caption: "Before and after: seat opening alert notifications." },
              { src: "assets/searchneu/anno-notifications-v2.png", caption: "The redesigned notifications table, annotated." },
              { videoSrc: "assets/searchneu/demo-notifications.mp4", caption: "Turning on seat opening alerts." },
            ],
          },
        ],
      },
      {
        id: "final",
        eyebrow: "05",
        navLabel: "Final Designs",
        title: "Final Design Gallery",
        body: [],
        figures: [
          { videoSrc: "assets/searchneu/demo-2-phones.mp4", caption: "The redesigned mobile experience end to end." },
          { src: "assets/searchneu/final-3-screens-w.png", caption: "Final mobile designs." },
          { src: "assets/searchneu/matches-desktop-w.png", caption: "Mobile designs matching desktop." },
          { src: "assets/searchneu/notif-table-desktop-w.png", caption: "The notifications table across mobile and desktop." },
        ],
      },
      {
        id: "process",
        eyebrow: "06",
        navLabel: "The Process",
        title: "The Process",
        body: [
          "As we identified earlier, the main problem with the previous mobile design was…",
        ],
        subsections: [
          {
            kicker: "The problem",
            title: "The most important course info was hard to reach on mobile because SearchNEU wasn't built for small screens.",
            highlight: true,
            unnumbered: true,
            body: [
              "So designing with clarity, hierarchy, and determining what our users found most important was the next step.",
            ],
          },
          {
            kicker: "Research",
            title: "We asked our users what info they cared most about.",
            body: [
              "A survey of 21 students rated each piece of course information on a 1–5 scale. Course name and code, class schedule, and available sections came out clearly on top — which told us exactly what had to survive on a course card.",
            ],
            figures: [
              { src: "assets/searchneu/process/survey-results.png", caption: "Survey results ranking which course details students rely on most." },
            ],
            afterBody: [
              "Conducted 5+ user interviews of people from different backgrounds (e.g. majors, year of study, schools, experience with course registration) to better understand why and how they use SearchNEU and identify pain points with the desktop and mobile versions.",
            ],
            afterTitle: "User interviews",
            lists: [
              {
                title: "Sample questions",
                items: [
                  "What tools do you typically use when looking for classes?",
                  "Which device(s) do you typically use to research classes?",
                  "Have you ever used SearchNEU to sign up for notifications for seat openings?",
                  "What features are valuable and why?",
                  "What prevents you from using SearchNEU?",
                  "If you could change anything, what would it be and why?",
                  "I noticed you did ______. Why?",
                  "What do you expect to see in our product in the future?",
                ],
              },
              {
                title: "Tasks users were asked to do (on desktop and mobile)",
                items: [
                  "Look up a course a user wants to enroll in that is full",
                  "Sign up for a notification",
                  "Check the status of notifications",
                  "Unsubscribe from a notification",
                ],
              },
            ],
          },
          {
            kicker: "Layout",
            title: "Then explored layouts to balance functionality with compactness and simplicity.",
            body: [
              "Low-fidelity wireframes let us test several directions fast — how much to show per card, where filters live, and whether course details expand in place or open as their own page.",
            ],
            figures: [
              { src: "assets/searchneu/process/wireframes-search-results-v2.jpg", caption: "Search results wireframes exploring card density and header layout." },
            ],
          },
          {
            kicker: "Screen iterations",
            title: "We iterated on the screens that carried the most weight.",
            body: [
              "Three areas needed the most iteration: the search results page with the course cards students scan, the details page they land on, and the filters that get them there.",
            ],
            beats: [
              {
                title: "Finding the course cards that are compact but informative.",
                body: [
                  "The hardest part was seat availability. We tested visual representations (dots and bars) against numeric ones, and numbers won — “11/16 sections full” answers the question directly, while the visual versions needed decoding.",
                ],
                figures: [
                  { src: "assets/searchneu/process/card-exploration-v2.png", caption: "Card explorations comparing visual and numeric ways to show seat status." },
                ],
              },
              {
                title: "Creating visual and functional consistency between desktop and mobile.",
                body: [
                  "Created a separate page for course details, allowing for more space to fit the same amount of information that used to be only available on desktop.",
                  "Experimented with the layout and **design patterns from desktop**, but modified them for mobile to ensure **visual consistency that reduces confusion** in users when switching from desktop to mobile.",
                ],
                figures: [
                  { src: "assets/searchneu/process/course-details-exploration.png", caption: "Course details page iterations, working toward parity with desktop." },
                  { src: "assets/searchneu/matches-desktop-w.png", caption: "The redesigned mobile experience alongside desktop." },
                ],
              },
              {
                title: "Experimented with different filter selector layouts.",
                body: [
                  "Eliminated the full screen option to **remove confusion** from users feeling like they navigated to a different page, opting for a modal overlay instead.",
                  "Ultimately went with the sliding up filter sheet due to it being **adjustable in size** from swiping up, allowing for more screen space for filter options when needed. This layout seemed most organic for mobile and was best received during user testing.",
                ],
                figures: [
                  { src: "assets/searchneu/process/wireframes-filter-v2.jpg", caption: "Filter wireframes testing side, bottom, and full screen approaches." },
                  { src: "assets/searchneu/process/filter-modal-exploration.png", caption: "High-fidelity comparison of the side, bottom sheet, and full screen filter modals." },
                ],
              },
            ],
          },
          {
            kicker: "Collaboration",
            title: "Enforcing file organization for better collaboration.",
            body: [
              "SearchNEU lacked a organization method for its Figma files, resulting in **wasted time and frustration** spent trying to find a specific page or design element within the 10+ files and cumulative 100+ pages.",
              "We adopted a new organization system that **used sections to group designs** by subject (e.g. screen, user flow, prototype, iteration).",
              "We also became more mindful of naming pages, marking which designer worked on what, and **preparing screens to receive feedback** by highlighting small changes between them.",
            ],
            figures: [
              { src: "assets/searchneu/process/file-organization.png", caption: "The Figma workspace before and after adopting a sectioned organization system." },
            ],
          },
        ],
      },
      {
        id: "retrospective",
        eyebrow: "07",
        navLabel: "Retrospective",
        title: "Retrospective",
        body: [
          "The redesigned mobile experience launched in 2025 and turned SearchNEU's weakest surface into one students rely on during registration. SearchNEU now serves 38,000+ students and sends 25,000+ seat opening alerts every month, and has been praised as the go-to place for all things course registration.",
        ],
        quotes: [
          { text: "Awesome! Idk how people search for classes without SearchNEU.", author: "Reddit user" },
          { text: "Thanks for this!! I was using Northeastern's ugly format like two hours ago. I wish I'd known about this earlier.", author: "Reddit user" },
          { text: "SearchNEU is such a lifesaver, it's getting me through course registration season.", author: "Second-year student" },
          { text: "Have you tried looking on this thing called SearchNEU for what fits your degree requirements? It's way easier than me fumbling around with this old thing.", author: "Academic advisor at Northeastern" },
          { text: "Thank god for SearchNEU, otherwise I'd still be stuck with that 8:00 AM class every week.", author: "Third-year student" },
          { text: "Wait, when did mobile get a facelift?? This looks fire.", author: "Second-year CS student" },
        ],
        notesTitle: "Lessons Learned",
        notes: [
          {
            title: "The importance of user feedback 💬",
            body: ["User feedback shaped the redesign. Research surfaced pain points and showed why and how different people use SearchNEU — including edge cases we hadn't considered, like last-minute sections added for hard-to-get courses."],
          },
          {
            title: "Inconsistent designs cause confusion 😵‍💫",
            body: ["A big source of frustration was the gap between desktop and mobile, both visually and functionally. The redesign focused on reusing desktop's design patterns and optimizing them for a smaller screen."],
          },
          {
            title: "Always think about the future ⏩",
            body: ["Designing for current needs isn't enough — systems, components, and flows have to make sense with what's coming. We accounted for roadmap goals like a tutorials/FAQ page and notifications management."],
          },
        ],
      },
    ],
  },

  jfk: {
    title: "JFK Airport",
    subtitle: "Streamlining visitor escort requests for the largest terminal at JFK International Airport.",
    cover: "image",
    coverSrc: "assets/jfk/web/hero-dashboard-v3.jpg",
    eyebrowDate: "2024-2025",
    tags: ["Dashboard", "Desktop & Mobile", "UX Design", "Client Work"],
    meta: [
      { label: "Role", value: "UX Designer", sub: "Interaction Design, Visual Design,\nUser Flows, Prototyping" },
      { label: "Team", value: "2 UX Designers", sub: "1 Senior Web Developer\n1 Project Manager\n1 Creative Director" },
      { label: "Timeline & Status", value: "3 Months", sub: "Launched in January 2025" },
    ],
    sections: [
      {
        id: "overview",
        eyebrow: "01",
        navLabel: "Overview",
        title: "Overview",
        body: [
          "JFK Terminal 4 is the largest terminal at New York's John F. Kennedy International Airport, and it's full of businesses that aren't T4-affiliated. When those businesses host a temporary visitor — a repair worker, a contractor, a visiting manager — that person needs to get past security to reach the store, restaurant, or lounge they're there for.",
          "That vetting ran entirely on a web form and email replies. To replace this cumbersome email-based process, I designed an all-in-one dashboard where employees can submit requests, track their statuses, and see exactly why something was rejected.",
          "The dashboard launched in January 2025 and has been in use at Terminal 4 ever since.",
        ],
        stats: [
          { value: "12,000+", label: "employees directly served" },
          { value: "7,000+", label: "escort requests handled a month" },
        ],
        figures: [
          { videoSrc: "assets/jfk/full-demo.mp4", frame: "jfkt4.nyc/escort-portal", caption: "Walkthrough of the dashboard in use." },
        ],
      },
      {
        id: "context",
        eyebrow: "02",
        navLabel: "Context",
        title: "Every business inside the terminal must have their visitors screened beforehand and assigned a certified escort to get past security.",
        body: [
          "T4 spans over 2 million square feet, houses 22 airlines, and serves 25+ million passengers a year. Businesses often have temporary visitors (e.g. repair workers, contractors, visiting managers) who need to enter the Sterile Area — the zone past the TSA checkpoint.",
          "Visitors must be given a gate pass, which means they must be screened beforehand by the terminal security team and paired with a certified escort. Any employee at a business can start this visitor vetting process by submitting a form.",
        ],
        figures: [
          { src: "assets/jfk/web/storyboard-1-v2.jpg", caption: "The T4 security protocol and how a visitor escort gets requested." },
        ],
        subsections: [
          {
            unnumbered: true,
            spaceAbove: 40,
            title: "The original form was unnecessarily long.\nAfter submission, all updates were sent via email.",
            body: [
              "Employees had to dig through their inbox to find every update, including whether a submission was approved or rejected. Specific details like access location and badge number only arrived on the day of the visit.",
            ],
            quotes: [
              { text: "Sometimes I'm submitting 10+ requests a day, so it's a nightmare trying to dig through my email to find which ones are approved, which ones I need to resubmit, or if I missed any.", author: "Employee of a JFK T4 business" },
            ],
            figures: [
              { src: "assets/jfk/web/before-form.jpg", caption: "The original Escort Authorization Portal — a single long form with a wall of instructions above it." },
            ],
          },
        ],
      },
      {
        id: "problem",
        eyebrow: "03",
        navLabel: "The Problem",
        title: "Terminal 4 had no way to view or track escort requests, so employees managed visitor access out of their inboxes.",
        highlight: true,
        body: [
          "Once a request was submitted, every update — approved, rejected, pending — arrived as an email. With thousands of requests a month, statuses got buried in inboxes and employees lost track of what they had already sent.",
          "Rejections were the worst case: they arrived with no reason attached, so **employees had to guess what to fix before resubmitting. For time-sensitive visits, that guesswork meant real delays.**",
        ],
        figures: [
          { src: "assets/jfk/web/storyboard-2-v2.jpg", caption: "The problems with the original email-based system." },
        ],
        notesTitle: "Key issues",
        notesBoxed: true,
        notesColumns: 2,
        notesAfterFigures: true,
        notes: [
          { title: "No visibility", body: ["Statuses were scattered across email threads with no single place to check them."] },
          { title: "Repetitive work", body: ["Employees would unknowingly resubmit requests they had already sent."] },
          { title: "No transparency", body: ["Rejections came with no reason, making corrections a guessing game."] },
          { title: "No room to grow", body: ["A single form left nowhere to add guidelines, FAQs, or new features later."] },
        ],
      },
      {
        id: "improvements",
        eyebrow: "04",
        navLabel: "Solution",
        title: "An all-in-one digital dashboard to easily view and submit visitor escort requests.",
        highlight: true,
        highlightLabel: "Our Solution",
        body: [
          "The dashboard replaces the email-based process entirely. Employees can now search, filter, and sort every request they've submitted in one place.",
        ],
        bulletsTitle: "Key features",
        bullets: [
          "**Centralized requests** — track pending, approved, and rejected statuses at a glance",
          "**Full request details** — visitor info, escort, and visit dates in one view",
          "**Search and filtering** — get to any request quickly",
          "**Clear rejection reasons** — know exactly what to fix before resubmitting",
        ],
        subsections: [
          {
            kicker: "Track at a glance",
            navLabel: "Better visibility",
            title: "Every request from the past 120 days, with its status visible without a single click.",
            body: [
              "The dashboard leads with the five things employees actually need to compare: visit date, visitor names, reason for escort, status, and submission date.",
              "Requests whose visit date has passed drop into a separate Past Requests section with a grayed-out date tag, so the active queue stays clean.",
            ],
            figures: [
              { src: "assets/jfk/web/hero-dashboard-v3.jpg", caption: "The request queue, with status visible on every row." },
            ],
            beats: [
              {
                title: "When visitors in one request get different outcomes, the row splits — but stays grouped and readable at a glance.",
                spaceAbove: 44,
                body: [
                  "A submission can cover up to five visitors, and T4 security doesn't always return the same answer for all of them — one person approved, another rejected, a third still pending.",
                  "Rather than force a single status onto the whole request, those visitors split into their own rows and stay visually grouped by status. Employees can see exactly who was cleared and who needs a resubmission without opening anything.",
                ],
                figures: [
                  { src: "assets/jfk/web/grouped-rows.jpg", caption: "How one submission renders as grouped rows when visitor statuses differ." },
                  { src: "assets/jfk/web/grouped-rows-desktop.jpg", caption: "Grouped rows in the dashboard, separating visitors by status." },
                ],
              },
            ],
          },
          {
            kicker: "Expand for details",
            navLabel: "Expandable details",
            title: "Requests open accordion-style, revealing all the visitor and escort details when you want it.",
            body: [
              "Expanding a row shows the full submission without navigating away — useful for confirming visitor details, checking whether a request was already sent, and reading the rejection reason.",
            ],
            figures: [
              { videoSrc: "assets/jfk/expandable-rows-demo.mp4", frame: "jfkt4.nyc/escort-portal", caption: "Expanding a request to reveal full visitor and escort details." },
              { src: "assets/jfk/web/mobile-accordion.jpg", spaceAbove: 34, caption: "Expanded request details on mobile." },
            ],
            beats: [
              {
                spaceAbove: 78,
                title: "Rejected requests now tell you what to fix for resubmission.",
                body: [
                  "Rejected requests carry an explanation at the top of the expanded view, so employees know exactly what to fix before resubmitting.",
                ],
                figures: [
                  { src: "assets/jfk/web/rejection-reason-2.jpg", caption: "A rejection reason surfaced directly in the request, on desktop and mobile." },
                ],
              },
            ],
          },
          {
            kicker: "Search and filter",
            navLabel: "Search & filter",
            title: "Filters for the three things employees search by most.",
            body: [
              "Status, visit date, and submission date cover nearly every lookup, and the search bar handles the rest — finding a specific visitor by name, for instance.",
              "Applied filters appear as dismissible chips above the queue, so it's always clear what's narrowing the list.",
            ],
            figures: [
              { videoSrc: "assets/jfk/filter-demo-raw.mp4", frame: "jfkt4.nyc/escort-portal", caption: "Filtering and searching through requests." },
              { src: "assets/jfk/web/filter-options-5.jpg", caption: "The three filter panels: status, visit date, and submission date." },
              { src: "assets/jfk/web/mobile-filters-2.jpg", spaceAbove: 34, caption: "The filter modal and applied-filter chips on mobile." },
            ],
          },
          {
            kicker: "Announcements",
            navLabel: "Announcements",
            title: "A place for admins to reach all 12,000 employees at once.",
            body: [
              "Portal admins can post a non-dismissable announcement to the top of the dashboard — the first thing employees see when they log in.",
            ],
            figures: [
              { videoSrc: "assets/jfk/announcement-demo-raw.mp4", frame: "jfkt4.nyc/escort-portal", caption: "An announcement pinned to the top of the dashboard." },
              { src: "assets/jfk/web/mobile-announcement.jpg", spaceAbove: 34, caption: "The announcement on mobile." },
            ],
          },
          {
            kicker: "A home for information",
            navLabel: "Information page",
            title: "The wall of text moved off the submission form and into a page built to hold it.",
            body: [
              "The instructions that used to sit above the submission form now live on a dedicated Information page, organized into sections with a side navigation: general information, submission guidelines, reminders for escorts, and privacy statements.",
              "Giving this content a real home also made the portal scalable. We used the new space to add an FAQ section — a long-requested feature that previously had nowhere to go.",
            ],
            figures: [
              { videoSrc: "assets/jfk/info-demo-raw.mp4", frame: "jfkt4.nyc/escort-portal", caption: "The Information page, with a side navigation for jumping between sections." },
              { src: "assets/jfk/web/mobile-info-2.jpg", spaceAbove: 34, caption: "The Information page on mobile, including the new FAQ section." },
            ],
          },
          {
            kicker: "Account details",
            navLabel: "Account page",
            title: "No more logging back in for every submission.",
            body: [
              "One login, one portal, and a dedicated Account page where your details always live.",
            ],
            figures: [
              { src: "assets/jfk/web/account-both.jpg", caption: "The Account page on desktop and mobile." },
            ],
          },
        ],
      },
      {
        id: "final",
        eyebrow: "05",
        navLabel: "Final Designs",
        title: "Final Design Gallery",
        body: [],
        figures: [
          { videoSrc: "assets/jfk/full-demo.mp4", frame: "jfkt4.nyc/escort-portal", caption: "The dashboard end to end." },
          { src: "assets/jfk/web/hero-dashboard-v3.jpg", caption: "The Escort Authorization Portal across desktop and mobile." },
          { videoSrc: "assets/jfk/announcement-demo-raw.mp4", frame: "jfkt4.nyc/escort-portal", caption: "Announcements on desktop." },
          { src: "assets/jfk/web/expanded-both.jpg", caption: "An expanded request with its rejection reason, on desktop and mobile." },
          { videoSrc: "assets/jfk/filter-demo-raw.mp4", frame: "jfkt4.nyc/escort-portal", caption: "Filtering and searching on desktop." },
          { src: "assets/jfk/web/mobile-filters.jpg", caption: "Filtering on mobile." },
          { videoSrc: "assets/jfk/info-demo-raw.mp4", frame: "jfkt4.nyc/escort-portal", caption: "The Information page on desktop." },
          { src: "assets/jfk/web/mobile-info-2.jpg", caption: "The Information page on mobile." },
          { src: "assets/jfk/web/account-both.jpg", caption: "The Account page on desktop and mobile." },
          { src: "assets/jfk/web/loading-empty.jpg", caption: "Loading and empty states." },
          { src: "assets/jfk/web/mobile-misc.jpg", caption: "Additional mobile screens." },
        ],
      },
      {
        id: "process",
        eyebrow: "06",
        navLabel: "The Process",
        title: "The Process",
        body: [
          "As we identified earlier, the main problem with the previous email-based process was…",
        ],
        subsections: [
          {
            kicker: "The problem",
            title: "Terminal 4 had no way to view or track escort requests, so employees managed visitor access out of their inboxes.",
            highlight: true,
            unnumbered: true,
            body: [
              "So building visibility, transparency, and a single place to track every request was the next step.",
            ],
          },
          {
            kicker: "Research & scope",
            navLabel: "Research & scope",
            title: "Mapping how escort requests actually move through the terminal.",
            body: [
              "JFKT4 has been a longtime client of Ronik, the NYC agency where I worked as one of two UX designers on this project. That existing relationship meant direct access to the people running the vetting process.",
              "We mapped the full lifecycle of a request and found the edge cases that made the old system painful.",
            ],
            bulletsTitle: "What we learned",
            bullets: [
              "A single submission can include up to 5 visitors",
              "A single submission can span multiple visit dates",
              "Employees often have many requests pending at once, and submit in bulk",
              "Rejected requests must be corrected and resubmitted",
              "One request can end up with different statuses per visitor",
              "Every update arrives only by email",
            ],
            beats: [
              {
                title: "Storyboarding the process to understand the user.",
                body: [
                  "To make sure the whole team shared the same picture of the problem, we storyboarded the process end to end — first the security protocol and how an escort request gets made, then the pain points employees hit once they'd submitted one.",
                  "Walking through it scene by scene surfaced exactly where the email-based workflow broke down, and gave us a reference we could put in front of the client.",
                ],
                figures: [
                  { src: "assets/jfk/web/storyboard-1-v2.jpg", caption: "The T4 security protocol and how a visitor escort gets requested." },
                  { src: "assets/jfk/web/storyboard-2-v2.jpg", caption: "The problems with the original email-based system, and the proposed all-in-one dashboard." },
                ],
              },
              {
                title: "Defining requirements with the client before designing anything.",
                body: [
                  "We proposed an all-in-one dashboard, then worked with the client to pin down requirements that fit their needs, budget, and three-month timeline.",
                ],
                bulletsTitle: "Design specification",
                bullets: [
                  "A branded dashboard as the landing page after login",
                  "Display submissions from the past 120 days",
                  "Sort and filter by status, visitor name, reason, submission date, and request date",
                  "Submissions expandable by accordion within a single page",
                  "Show visitor details, account details, and terminal info",
                ],
              },
            ],
          },
          {
            kicker: "Wireframes",
            navLabel: "Wireframes",
            title: "Brainstorming different layouts before touching Figma.",
            body: [
              "I wireframed a range of dashboard layouts first — different column orders, ways of grouping requests, and places to put filters and search. Working rough meant I could throw out a bad structure in seconds instead of rebuilding a Figma file around it.",
              "Those wireframes became the shortlist for what to actually build. Each one I kept turned into a direction worth trying digitally, so by the time I opened Figma I already knew which ideas were worth the effort and which had been ruled out.",
            ],
            figures: [
              { src: "assets/jfk/web/wireframes.jpg", shadow: true, caption: "Early wireframes for the dashboard." },
            ],
          },
          {
            kicker: "Screen iterations",
            navLabel: "Screen iterations",
            title: "Finding the balance between simplicity and information density.",
            body: [
              "The dashboard holds a lot of content, so most iteration went into the table itself. I built a component system in Figma so I could spin up a new variant of any UI element and drop it into a premade page — fast enough to explore dozens of directions.",
            ],
            beats: [
              {
                title: "Iterating on the request table.",
                body: [
                  "I explored column ordering, row styles (strokes versus pajama stripes), tag styles for visit dates and statuses, selected-state colors, and how rows should group.",
                ],
                figures: [
                  { src: "assets/jfk/web/explore-table-first-hd.png", caption: "Table style explorations." },
                ],
              },
              {
                title: "Building a component system to iterate faster.",
                body: [
                  "Throughout the design and iteration stage, I built every UI element as a Figma component with variants — row styles, status tags, date tags, visitor indicators, expanded detail panels.",
                  "That let me assemble a new version of the table in seconds and test different combinations of components against each other, instead of rebuilding a layout by hand for every direction I wanted to try.",
                ],
                figures: [
                  { src: "assets/jfk/web/component-system-v2.jpg", caption: "The Figma component system behind the explorations." },
                ],
              },
              {
                kicker: "A new problem:",
                title: "How do you show that only some visitors in a request were rejected?",
                body: [
                  "A submission can include five visitors, and their statuses often differ — everyone approved except one person, for example. A single status tag per row couldn't represent that.",
                  "I explored circle indicators for each visitor, colored names, pajama stripes, visual grouping bars, and fully separate rows.",
                ],
                figures: [
                  { src: "assets/jfk/web/explore-statuses-hd.png", caption: "Explorations for showing mixed visitor statuses within one request." },
                ],
              },
              {
                title: "Iterating on how full request details open.",
                body: [
                  "Accordion rows, a separate detail page, and a modal were all on the table. We debated the trade-offs with each of these versions to decide what to use in the final design.",
                ],
                figures: [
                  { src: "assets/jfk/web/explore-accordion-hd.png", caption: "Explorations for opening full request details." },
                ],
              },
            ],
          },
          {
            kicker: "Refinement",
            navLabel: "Refinement",
            title: "Simplicity won.",
            body: [
              "After pitching several directions, we went with the **minimalistic accordion**. Because the dashboard carries so much content, **reducing visual clutter mattered more than added indicators** — so out went the excess boxes, icons, and complex status markers.",
              "For mixed statuses, visitors from the same request split into separate rows that stay visually grouped. That came straight from user feedback: people wanted visitors from one request kept together, but still wanted a clean UI.",
            ],
            figures: [
              { src: "assets/jfk/web/refinement-accordion.jpg", caption: "The final design for the table, with a minimalistic accordion UI style." },
            ],
          },
        ],
      },
      {
        id: "retrospective",
        eyebrow: "07",
        navLabel: "Retrospective",
        title: "Retrospective",
        body: [
          "The dashboard launched in January 2025 and is in active use at JFK Terminal 4, serving 12,000+ employees and handling 7,000+ escort requests a month. It replaced a process that ran entirely on email.",
        ],
        quotes: [
          { text: "It's so nice having one place for all my requests.", author: "Employee of a JFK T4 business" },
          { text: "Wow, this is going to make resubmissions so much easier.", author: "Employee of a JFK T4 business" },
          { text: "This is so much better than searching through my email.", author: "Employee of a JFK T4 business" },
        ],
        notesTitle: "Lessons learned",
        notesSpaceAbove: 58,
        notesAfterFigures: true,
        notes: [
          {
            title: "The power of iteration and exploration 🔁",
            body: ["Exploring many directions early is what surfaced the good solutions — not settling on the first idea. Generating a wide range let me find what actually resonated with stakeholders and refine from there."],
          },
          {
            title: "Collaborating efficiently with others 🤝",
            body: ["With this much collaboration and critique, I learned to organize design files so anyone could follow them: clear ownership, version history, structured iterations, and heavy use of auto-layout and reusable components."],
          },
          {
            title: "Communicating and presenting your design 💬",
            body: ["Presenting to non-designers sharpened how I justify decisions. Walking clients through multiple options with honest trade-offs is what got us to a final design that met their goals without compromising the experience."],
          },
        ],
      },
    ],
  },
  ecolab: {
    title: "Reuters x Ecolab",
    subtitle: "An interactive microsite for promoting water sustainability in industry.",
    cover: "image",
    coverSrc: "assets/ecolab/web/hero-desktop-mobile.jpg",
    eyebrowDate: "2024",
    tags: ["Web Design", "Graphic Design", "Desktop & Mobile", "Client Work"],
    meta: [
      { label: "Role", value: "Designer & Developer (Lead)", sub: "Editorial Design, Data Visualization,\nMotion Design" },
      { label: "Team", value: "1 Designer/Developer (Lead)", sub: "1 Designer\n1 Creative Director/3D Animator" },
      { label: "Client", value: "Reuters Plus (Content Partner)\nEcolab (Client)" },
    ],
    sections: [
      {
        id: "overview",
        eyebrow: "01",
        navLabel: "Overview",
        title: "Overview",
        body: [
          "We partnered with the Reuters Plus team, who wrote the content for Ecolab's [Water for Climate™](https://plus.reuters.com/ecolab-water-for-climate/p/1) campaign, to determine the design direction and create the media assets, interactive microsite, and PDF for their [Better Water, Better Business](https://plus.reuters.com/ecolab-higher-profits-through-better-water-management/p/1) pitch.",
          "I both designed and built the main microsite, for desktop and mobile.",
          "The [Water for Climate™](https://plus.reuters.com/ecolab-water-for-climate/p/1) campaign has gone on to drive measurable results for Ecolab's customers:",
        ],
        // Campaign-level figures, not microsite analytics — the labels say so
        // explicitly so nothing reads as a claim about this page's performance.
        stats: [
          { value: "245B", label: "gallons of water conserved by Water for Climate customers in 2025" },
          { value: "4.7M", label: "metric tons of emissions those customers avoided that year" },
          { value: "Top 4%", label: "of companies on CDP's 2025 water and climate A-List" },
        ],
        figures: [],
      },
      {
        id: "context",
        eyebrow: "02",
        navLabel: "Context",
        title: "Water is a business asset, and most companies are managing it as an afterthought.",
        body: [
          "**Ecolab came to Reuters Plus and Ronik to help pitch their Water for Climate™ campaign to customers**, using visual assets and data to show both the need for and the benefits of better water sustainability in business.",
          "**The campaign's argument is that water conservation and profitability aren't a trade-off.** Mitigating supply chain water risk costs nearly three times less than absorbing its impact, and smarter water management cuts energy use, emissions, and operating costs at the same time.",
          "The microsite makes that case with industry-level data, then shows how the Water for Climate™ program delivers on it: reviewing a company's water and climate targets, auditing sites to find the opportunities, implementing industry-specific solutions, and measuring the outcomes.",
        ],
        figures: [],
      },
      {
        id: "problem",
        eyebrow: "03",
        navLabel: "The Challenge",
        title: "How do you promote a campaign when customers first need to be convinced that water sustainability will help their bottom line?",
        highlight: true,
        highlightLabel: "Main Challenge",
        body: [],
        figures: [],
        notesTitle: "Why this pitch was hard to land",
        // Boxed to match JFK's "Key issues" callout. Single column here because
        // these note bodies run 2-3 sentences, where JFK's are one-liners.
        notesBoxed: true,
        notesAfterFigures: true,
        notes: [
          {
            title: "Static assets weren't holding attention",
            body: ["Pitch decks and flyers had carried the campaign so far, and they weren't compelling enough to hold the audience — particularly for something meant to be read and shared digitally."],
          },
          {
            title: "Self-promotion is a hard sell",
            body: ["It's difficult to pitch your own water sustainability program without sounding like marketing. Publishing through Reuters Plus let Ecolab make the case backed by third-party statistics under a trusted masthead, rather than asserting it themselves."],
          },
          {
            title: "Sustainability competes with profitability",
            body: ["Businesses lead with the bottom line, and sustainability tends to become an afterthought. The piece had to argue that the two move together, not against each other — which is why the metrics couldn't be softened to make the story flow."],
          },
        ],
      },
      {
        id: "improvements",
        eyebrow: "04",
        navLabel: "Solution",
        title: "A data-backed pitch from the Reuters Plus team, delivered as an interactive microsite.",
        highlight: true,
        highlightLabel: "Our Solution",
        body: [],
        bulletsTitle: "Four parts",
        bullets: [
          "**A trusted messenger** — publishing through Reuters Plus put the argument behind a reputable masthead instead of Ecolab asserting it alone",
          "**Third-party data** — the case is built on cited industry statistics, not marketing claims",
          "**An interactive microsite** — visuals, animations, and toggles that keep readers moving through the metrics",
          "**Easy to share** — a link anyone can send, plus a PDF version for when a document suits better",
        ],
        figures: [
          { videoSrc: "assets/ecolab/desktop-scroll.mp4", frame: "plus.reuters.com", caption: "The published microsite on desktop." },
        ],
        subsections: [
          {
            kicker: "Story structure",
            navLabel: "Story structure",
            title: "The story moves through five sections, building from risk to opportunity to action.",
            body: [
              "The hero is literal: one large water drop falling in front of smaller ones, so an abstract resource lands as something physical before a single statistic appears.",
            ],
            bulletsTitle: "The five sections",
            bullets: [
              "**Intro** — establishes how essential water is to industry, and how rising demand puts operations and value chains at substantial risk",
              "**A Ripple Effect** — cites how much water industry uses and wastes, making the optimization opportunity concrete per industry",
              "**Thirsting for Change** — shows that optimizing water usage boosts profitability, growth, and competitive standing with stakeholders, not just environmental performance",
              "**Profits and Water Stewardship** — explains how Ecolab's services improve profitability and water sustainability together",
              "**Jump In Today** — closes on the slogan “Water will shape the future of business,” with Find Out More and Download PDF calls to action",
            ],
            figures: [],
          },
          {
            kicker: "Presenting the data",
            navLabel: "Presenting the data",
            title: "Keeping viewers engaged with animations and interactions when presenting the data.",
            body: [
              "Pie charts and bar graphs animate in on load, and interactive toggles let readers switch between data views — so the statistics arrive a piece at a time instead of all at once.",
              "The microsite was built in Ceros, with the more complex animations produced in Adobe After Effects.",
            ],
            figures: [
              { videoSrc: "assets/ecolab/water-withdrawals-viz.mp4", caption: "A bar graph animating in: industrial use as a share of global water withdrawals, and how much of it is recycled." },
              { videoSrc: "assets/ecolab/supply-scarcity-toggle.mp4", spaceAbove: 40, caption: "Toggling between bar graphs showing industries whose direct operations depend on a reliable supply vs. industries who report water scarcity as a significant risk." },
              { videoSrc: "assets/ecolab/animation-load-ins.mp4", spaceAbove: 40, caption: "Scrolling through several sections, each loading in its statistics and bar graphs." },
            ],
          },
          {
            kicker: "Mobile",
            navLabel: "Mobile experience",
            title: "Built for both desktop and mobile.",
            body: [
              "The designs translate elegantly and consistently across both, so the story reads the same whether it's opened on a laptop in a meeting or on a phone between them.",
              "It was also built with browser compatibility and loading speed in mind — a pitch that stalls on load is a pitch nobody finishes.",
            ],
            // One desktop/mobile comparison per chapter of the microsite. The
            // first also serves as the page cover — intentional, since this
            // section walks the whole story section by section.
            figures: [
              { src: "assets/ecolab/web/hero-desktop-mobile.jpg", caption: "The opening section on desktop and mobile." },
              { src: "assets/ecolab/web/ripple-desktop-mobile.jpg", spaceAbove: 40, caption: "A Ripple Effect on desktop and mobile — the side-by-side data blocks restack into a single column." },
              { src: "assets/ecolab/web/thirsting-desktop-mobile.jpg", spaceAbove: 40, caption: "Thirsting for Change on desktop and mobile — the three-across stat row becomes a stacked list." },
              { videoSrc: "assets/ecolab/mobile-scroll.mp4", phoneFrame: "plus.reuters.com", spaceAbove: 40, caption: "Scrolling the microsite on mobile." },
            ],
          },
          {
            kicker: "Campaign assets",
            navLabel: "Campaign assets",
            title: "Other visual assets created for the campaign.",
            body: [
              "Beyond the microsite and its PDF version, we produced additional design assets for Ecolab, including graphics, 3D rendered artwork, and animations.",
            ],
            figures: [
              { src: "assets/ecolab/web/visual-assets-grid.jpg", caption: "Other visual assets created for the campaign." },
              { src: "assets/ecolab/web/3d-renders-grid.jpg", flat: true, spaceAbove: 40, caption: "3D rendered visual assets produced for the campaign, made with Cinema 4D." },
              { src: "assets/ecolab/web/water-drop-renders.jpg", flat: true, spaceAbove: 40, caption: "Water droplet renders, including the artwork behind the microsite's hero animation." },
            ],
          },
        ],
      },
      {
        id: "final",
        eyebrow: "05",
        navLabel: "Final Designs",
        title: "Final Design Gallery",
        body: [],
        figures: [
          { videoSrc: "assets/ecolab/desktop-scroll.mp4", frame: "plus.reuters.com", caption: "The full walkthrough on desktop." },
          { videoSrc: "assets/ecolab/mobile-scroll.mp4", phoneFrame: "plus.reuters.com", caption: "The full walkthrough on mobile." },
        ],
      },
      {
        id: "process",
        eyebrow: "06",
        navLabel: "BTS",
        sidebarLabel: "Behind the Scenes",
        title: "Behind the Scenes",
        body: [
          "These designs were made in Sketch, then the microsite was built out in Ceros. More complex animations were done in Adobe After Effects, and the 3D renders in Cinema 4D.",
        ],
        figures: [
          { src: "assets/ecolab/web/ceros-bts-desktop.jpg", caption: "The desktop microsite under construction in Ceros." },
          { src: "assets/ecolab/web/ceros-bts-mobile.jpg", spaceAbove: 40, caption: "The mobile version, under construction in Ceros." },
        ],
      },
      {
        id: "retrospective",
        eyebrow: "07",
        navLabel: "Retrospective",
        title: "Retrospective",
        body: [
          "The microsite was published by Reuters Plus in November 2024 as part of Ecolab's Water for Climate™ campaign. It remains the primary pitch deck to share with Water for Climate™ customers and is easily viewable on desktop or mobile. The campaign saw amazing results, including 245 billion gallons of water conserved by Water for Climate customers in 2025.",
        ],
        link: { label: "Water for Climate™ website", href: "https://plus.reuters.com/ecolab-water-for-climate/p/1" },
        notesTitle: "Lessons learned",
        notesSpaceAbove: 58,
        notes: [
          {
            title: "Dealing with unsure clients 🤔",
            body: ["The client came in without a visual direction or finalized copy. The creative freedom sounded good, but it made finding a starting point harder — so we put rough visuals and layouts in front of them early and designed from their reactions instead of waiting on a brief."],
          },
          {
            title: "Balancing visuals with conciseness ⚖️",
            body: ["We carried two directions most of the way: a shorter, data-dense one and a longer, visual-led one. The final design merged them, delivering the persuasive statistics with enough imagery and motion to keep readers moving through the page."],
          },
        ],
      },
    ],
  },
};

window.PROJECTS = PROJECTS;
window.EMOJIS = EMOJIS;
window.PROJECT_PAGE = PROJECT_PAGE;