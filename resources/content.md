### HTML5

This project uses modern HTML5 structure to define semantic page layout across files like index.html, about.html, and contact.html. Elements such as <header>, <section>, <nav>, and <canvas> help describe meaningful content rather than using generic <div> blocks. For instance, the particle animation background is rendered via a dynamically injected <canvas> element created in JavaScript.

HTML5 also supports interactive components that work together with JavaScript logic. Forms on contact.html include semantic input fields such as <input type="email">, ensuring browser-native validation behaviors before custom validation is applied. This structural foundation allows JavaScript and CSS to enhance interaction rather than defining layout alone.

### CSS

This project uses extensive custom CSS styles across files like index.css, about.css, and contact.css, defining typography, layout, animations, and themes. The design centers around CSS variables in :root, enabling a centralized palette (--primary-blue, --tech-blue, etc.) that ensures consistent branding across pages. These variables also support theme switching, where alternate colors activate when the .dark-theme class is applied to the <body> element.

The styling makes heavy use of glassmorphism, gradients, shadows, and blur effects. For example, navigation bars use translucent backgrounds with backdrop-filter: blur(10px) and fading borders to create a layered UI style. Interactive elements like .calc-button include hover transformations and shadows to provide tactile feedback, enhancing perception and usability.

CSS here also handles layout responsiveness without external frameworks. Menus like .mobile-menu rely on max-height, opacity, and transform transitions rather than display: none, enabling smooth animations between states. The project uses grid layout in the calendar (display: grid; grid-template-columns: repeat(7, 1fr)) to create a clean and uniform structure. These techniques demonstrate modern CSS capabilities without dependency on Bootstrap or Tailwind.

### Google Lighthouse

Although the code does not explicitly reference Google Lighthouse APIs, the project demonstrates a number of development practices that align with Lighthouse evaluation criteria. For example, CSS variables consolidate theme colors and prevent repetitive declarations, improving maintainability and reducing stylesheet size. Animated UI components use GPU-friendly transforms (transform rather than top/left) to maintain smooth rendering performance, as seen in the floating elements and button hover animations.

Lighthouse also evaluates accessibility, and this project contains multiple attributes designed to meet accessibility requirements. The particle background canvas is injected with aria-hidden="true", ensuring assistive technologies ignore visual-only elements. Form validation provides real-time feedback with descriptive error messages ("Please enter your email address.") rather than generic errors, improving usability for keyboard and screen-reader users.

The project also aligns with Lighthouse’s performance and best-practice guidelines by storing data in localStorage—such as theme preferences and calculator history—allowing UI state to persist across reloads without server requests.
Combined with lightweight HTML structure and client-side routing through multiple static pages, the site avoids unnecessary rendering cost or network overhead.

### JavaScript

JavaScript is the core engine powering interactivity across all three pages. It executes once the DOM is ready via $(function() {...}), then initializes modules such as particle background rendering, mobile navigation, calculators, typed text animation, and contact form validation. Functions like initParticles(), initMobileMenu(), and initCalculator() are defined and executed during startup to modularize logic and keep the code organized.

JavaScript also manages dynamic UI rendering and animations independent of CSS frameworks. For example, the particle engine creates <canvas> elements through DOM manipulation and continuously draws frames using requestAnimationFrame(draw), simulating motion with randomized vectors and opacity values. These updates rely on mathematical calculations rather than CSS transitions, demonstrating full programmatic rendering.

State management and persistent data storage are implemented entirely on the client. The calculator stores previous results in calcHistory, syncing values to localStorage on page unload and restoring them when revisiting the site. Theme selection also persists using localStorage.setItem('theme', ...), meaning user choices persist across reloads. Input handling supports both UI clicks and keyboard events through document.addEventListener('keydown', ...), enabling accessibility and efficient interaction.

### Cookies and localStorage

This project uses localStorage extensively to persist user preferences and data across sessions. For example, the selected theme (light or dark) is stored with localStorage.setItem('theme', ...) and later retrieved on startup to reapply the interface without user interaction. This allows consistent appearance across page reloads and different visits.

In addition, the calculator component stores recent calculation history in localStorage using JSON serialization. When the user performs calculations, results are pushed into calcHistory and saved automatically before page unload. Upon returning to the site, restoreCalcHistory() retrieves stored data and restores it to the UI, ensuring continuity of interaction.

The project does not use Cookies, and this choice is meaningful from a technical standpoint. Cookies are typically used for server-driven session management and get transmitted with HTTP requests, whereas this project is purely client-side and does not require backend communication. localStorage is more suitable because it stores larger amounts of data (typically ~5MB), persists indefinitely, and is not attached to HTTP headers—making it efficient for preferences like UI themes and computed results. The architecture reflects a fully client-side SPA-style design.

### HCI (Human–Computer Interaction)

This project demonstrates multiple principles of Human–Computer Interaction by designing interfaces that are visually responsive and give immediate feedback to users. For example, form fields provide real-time validation messages such as "Please enter your name." and apply clear visual states—red for errors, green for success—through classes like .has-error and .is-valid. Validation icons (⚠️ vs ✅) further reinforce cognitive clarity by pairing text and symbolic cues.

The project also reduces cognitive load by enabling intuitive interactions across input methods. The calculator supports both button clicks and keyboard input via document.addEventListener('keydown', ...), letting users choose whichever is more efficient. The theme toggle offers an animated rotation hover effect, which communicates clickability through motion rather than static styling. Animated reveal effects (fadeIn, staggered timing) guide users' attention without overwhelming them.

Responsiveness and accessibility are also part of HCI design here. The mobile menu uses smooth transitions instead of abrupt show/hide behavior, helping users understand spatial changes in layout. Purely decorative elements like the particle background canvas are marked aria-hidden="true" so screen readers ignore them—preventing noise and improving UX for visually impaired users. The combination of readable typography, contrast-aware dark mode, and spacing-focused structure creates a user experience that balances aesthetics with clarity.

### jQuery

jQuery serves as the primary engine for DOM traversal, event registration, and UI initialization across the entire project. All three main scripts begin with $(function() { ... }), ensuring logic runs only after the DOM is fully loaded. This includes setup tasks such as loading saved themes, initializing the particle system, binding navigation button events, and, on the contact page, wiring up form validation behavior.

The project uses jQuery to manipulate elements dynamically rather than relying on static HTML. For example, the particle system creates and appends a <canvas> element using const canvas = $('<canvas ...>').appendTo(...), then uses jQuery’s object wrapper for event binding like $(window).on('resize', resizeCanvas). Similarly, the mobile menu toggles visibility by conditionally adding and removing classes like .open and .hidden, relying on jQuery’s .on('click', ...) and class utilities rather than native listeners.

jQuery is also used to enhance components visually and behaviorally. In the calculator page, buttons are initialized with .button(), invoking jQuery UI's widget layer to apply styling and interactions. Meanwhile, sequential fade-in animations are implemented via chained transitions using .delay().fadeIn(400), illustrating how jQuery simplifies asynchronous UI sequencing. The combination of jQuery with small amounts of native JavaScript provides both convenience and performance where needed.

### jQuery UI

The project applies jQuery UI primarily to enhance interactive components with richer visuals and behaviors on top of the existing jQuery DOM logic. For example, calculator buttons are initialized using .button(), which transforms ordinary <button> elements into styled, theme-aware UI widgets that respond to hover, focus, and active states more consistently across browsers. This provides a polished tactile feel without manually writing custom CSS for button states.

In addition to styling, jQuery UI also supplements animation sequencing. Certain elements are revealed with chained animations using methods like .fadeIn() along with .delay(), allowing sequential entrance effects that guide the user’s attention. While these effects could be achieved with CSS transitions, jQuery UI abstracts timing, easing, and event callbacks into a simpler API, reducing implementation complexity while maintaining fine-grained control.

Unlike other projects that use jQuery UI's full widget library (tabs, accordions, dialogs), this project selectively uses smaller features rather than full UI components. This design choice keeps the interface lightweight while still benefiting from UI enhancements where interaction quality matters most (e.g., calculator input surfaces). This reflects an intentional trade-off: leveraging jQuery UI for polish without over-engineering the interface.

### jQuery Validation

This project does not use the jQuery Validation plugin. Instead, it implements a fully custom validation system in the contact form using manual logic written in JavaScript. Each field is validated through explicit checks—for example, verifying that the name field is not empty and that the email field matches a regular expression. When validation fails, the script dynamically inserts styled message elements below the input, providing immediate feedback without relying on external libraries.

The system also applies visual states directly via CSS class toggling rather than relying on built-in plugin behaviors. Fields switch between .has-error and .is-valid, and each state includes carefully designed color schemes, animated borders, and icons that appear beside the input. This results in a more polished and custom aesthetic than many default validation plugins, aligning with the project's design-focused UI approach.

Although plugins like jQuery Validation could have simplified rule configuration and provided built-in patterns, the hand-crafted system offers advantages: complete control over animation timing, styling, DOM structure, and behavior logic. It reflects a deliberate trade-off prioritizing visual refinement and branding consistency over generalized rule-based validation, making the form not only functional but also a stylistic part of the website experience.