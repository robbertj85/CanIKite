Product Requirements Document (PRD)
Product name: Can I Kite?
Version: Draft v1.0
Owner: [Your Name]
Date: [Insert Date]
1. Purpose
Kitesurfers often struggle to decide where they can kite at a given moment and which kite size to take. Can I Kite? solves this by providing a real-time web app showing conditions at Dutch kitesurf spots and giving personalized kite size recommendations.
2. Goals & Objectives
Provide real-time visibility of which kitespots in the Netherlands are kiteable right now.
Advise users on kite size based on their weight, skill level, and wind conditions.
Enable kitesurfers to plan sessions quickly, avoiding wasted trips and unsafe conditions.
Build a simple, mobile-first interface for instant use on the beach or on the go.
3. Target Audience
Primary users: Recreational and experienced kitesurfers in the Netherlands.
Secondary users: Beginner kitesurfers seeking guidance on safe and suitable conditions.
4. Key Features
4.1 Core Features (MVP)
Spot Overview Map/List
Show all kite spots in NL.
Highlight spots that are currently kiteable (based on wind, tides, local regulations).
Real-Time Weather Data Integration
Fetch live wind speed, direction, gusts, and tide information (e.g., KNMI, Windy, OpenWeather API).
Personalized Kite Size Recommendation
Input: rider weight, preferred discipline (freeride, wave, freestyle).
Output: suggested kite size (e.g., “12m, 9m usable if gusty”).
Basic Filtering
Filter spots by region, wind direction compatibility, tide dependency.
4.2 Extended Features (Future Versions)
Notifications / Alerts
Push/email alerts when a user’s favorite spot becomes kiteable.
Community Layer
User feedback: “I’m on the spot” / condition check-ins.
Gear Logbook
Track which kite/board was used under which conditions.
Integration with Wearables
Sync wind/ride data from devices like Garmin or Woo Sports.
5. User Stories
As a kitesurfer, I want to see which spots are kiteable now so I don’t waste time traveling to a closed or unsuitable location.
As a kitesurfer, I want the app to suggest kite size based on current wind and my weight so I can rig the right kite safely.
As a beginner, I want to know if conditions are too strong for my level so I can avoid dangerous situations.
As a frequent kiter, I want to favorite spots and get alerts when they become kiteable.
6. Assumptions & Dependencies
Weather and tide data is reliably available from public APIs.
Spot information (rules, kite zones, restrictions) is up to date and maintained.
Mobile-first responsive web app (later PWA / native app possible).
7. Success Metrics
Adoption: Number of active users per month.
Engagement: Average sessions per user per week.
Accuracy: % of correct kite size suggestions reported by users.
Retention: Returning users after 30 days.
8. Technical Considerations
Frontend: React / Next.js, optimized for mobile.
Backend: Node.js / Python for API aggregation.
Data Sources: KNMI, Windy API, OpenWeather, local tide APIs.
Hosting: Cloud-based (Vercel, AWS, or similar).
Scalability: Design APIs for later expansion to other countries.
9. Risks & Open Questions
API reliability: fallback if weather data providers are down.
Accuracy of kite size recommendation logic — needs domain expert validation.
Legal/local regulations at each spot (need crowdsourced updates or official data feed).
Safety liability disclaimer for users following recommendations.
10. Next Steps
Validate data sources (wind & tide APIs).
Build a clickable prototype (map view + kite size calculator).
Test with a small group of kitesurfers.
Iterate based on feedback before scaling features.