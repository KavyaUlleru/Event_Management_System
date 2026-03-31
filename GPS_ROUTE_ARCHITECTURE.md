# GPS Route Map - Architecture & Flow Diagram

## User Flow Diagram

```
┌─────────────────┐
│  Events Page    │
│  (events.html)  │
└────────┬────────┘
         │
         │ User clicks "📍 View Route"
         │ (only visible if event has GPS coords)
         ▼
┌─────────────────────────────────────┐
│   Route Map Page                    │
│   (route-map.html?eventId=...)      │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ 1. Get Event Details         │   │
│  │    (API: /events/:id)        │   │
│  └──────────────────────────────┘   │
│                │                    │
│                ▼                    │
│  ┌──────────────────────────────┐   │
│  │ 2. Request User Location     │   │
│  │    (Browser Geolocation API) │   │
│  │                              │   │
│  │  Browser asks permission:    │   │
│  │  "Allow location access?"    │   │
│  └──────────────────────────────┘   │
│                │                    │
│         ┌──────┴──────┐             │
│         │             │             │
│      Allowed      Denied/Error      │
│         │             │             │
│         ▼             ▼             │
│    Initialize    Show Error Msg     │
│    Map & Route                      │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ 3. Initialize Leaflet Map    │   │
│  │    - Set center view         │   │
│  │    - Load OpenStreetMap      │   │
│  └──────────────────────────────┘   │
│                │                    │
│                ▼                    │
│  ┌──────────────────────────────┐   │
│  │ 4. Add Markers               │   │
│  │    - User location (blue)    │   │
│  │    - Event venue (purple)    │   │
│  └──────────────────────────────┘   │
│                │                    │
│                ▼                    │
│  ┌──────────────────────────────┐   │
│  │ 5. Calculate Route           │   │
│  │    - Use Leaflet Routing     │   │
│  │      Machine                 │   │
│  │    - Draw optimal path       │   │
│  └──────────────────────────────┘   │
│                │                    │
│                ▼                    │
│  ┌──────────────────────────────┐   │
│  │ 6. Calculate Distance        │   │
│  │    - Haversine formula       │   │
│  │    - Display in km           │   │
│  └──────────────────────────────┘   │
│                │                    │
│                ▼                    │
│  ┌──────────────────────────────┐   │
│  │ 7. Estimate Travel Time      │   │
│  │    - Based on 40 km/h avg    │   │
│  │    - Display in readable fmt │   │
│  └──────────────────────────────┘   │
│                │                    │
│                ▼                    │
│  ┌──────────────────────────────┐   │
│  │ 8. Display Route Info        │   │
│  │    - Start point             │   │
│  │    - Destination             │   │
│  │    - Distance                │   │
│  │    - Travel time             │   │
│  │    - Interactive map         │   │
│  │    - Action buttons          │   │
│  └──────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
         │
         │ User options:
         │
    ┌────┴────┬─────────────┐
    │          │             │
    ▼          ▼             ▼
 "Open in   "Refresh    "Back to
 Google     Route"      Events"
 Maps"      
```

## Component Architecture

```
┌──────────────────────────────────────────────────────┐
│                  route-map.html                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │          HTML Structure                        │ │
│  ├────────────────────────────────────────────────┤ │
│  │ • Nav bar (with auth links)                    │ │
│  │ • Back button                                  │ │
│  │ • Error/Success messages                       │ │
│  │ • Event details card                           │ │
│  │ • Route info cards (4 cards)                   │ │
│  │ • Loading message                              │ │
│  │ • Map container (height: 70vh)                 │ │
│  │ • Action buttons                               │ │
│  └────────────────────────────────────────────────┘ │
│                         │                            │
│                         ▼                            │
│  ┌────────────────────────────────────────────────┐ │
│  │     External Libraries (Head)                  │ │
│  ├────────────────────────────────────────────────┤ │
│  │ • Leaflet.js (v1.9.4) - Mapping               │ │
│  │ • Leaflet CSS - Map styling                    │ │
│  │ • Leaflet Routing Machine (v3.2.12) - Routes  │ │
│  │ • Leaflet Routing CSS - Route styling          │ │
│  └────────────────────────────────────────────────┘ │
│                         │                            │
│                         ▼                            │
│  ┌────────────────────────────────────────────────┐ │
│  │     JavaScript Functions                       │ │
│  ├────────────────────────────────────────────────┤ │
│  │ • initializeRoute()                            │ │
│  │ • displayEventDetails()                        │ │
│  │ • getUserLocation()                            │ │
│  │ • initializeMap()                              │ │
│  │ • calculateRoute()                             │ │
│  │ • displayRouteInfo()                           │ │
│  │ • setupGoogleMapsButton()                      │ │
│  │ • calculateDistance() [Haversine]              │ │
│  │ • estimateTime()                               │ │
│  │ • showError() / showSuccess()                  │ │
│  └────────────────────────────────────────────────┘ │
│                         │                            │
│                         ▼                            │
│  ┌────────────────────────────────────────────────┐ │
│  │     API Integration (app.js)                   │ │
│  ├────────────────────────────────────────────────┤ │
│  │ • getEvent(eventId) - Fetch event details      │ │
│  │ • Sends to: GET /api/events/:id                │ │
│  └────────────────────────────────────────────────┘ │
│                         │                            │
│                         ▼                            │
│  ┌────────────────────────────────────────────────┐ │
│  │     Browser APIs                               │ │
│  ├────────────────────────────────────────────────┤ │
│  │ • Geolocation API - Get user location          │ │
│  │ • localStorage - Auth token/user data          │ │
│  │ • fetch() - HTTP requests                      │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
Browser                                Backend
┌────────────────────────┐            ┌──────────────────┐
│   route-map.html       │            │   server.js      │
│                        │            │                  │
│  URL: eventId=?????    │            │  MongoDB Event   │
│          │             │            │  Model           │
│          ▼             │            │                  │
│  Get event from query  │            │  {               │
│          │             │            │    _id: "..."    │
│          ▼             │            │    title: "..."  │
│  API Call:             │            │    latitude: X   │
│  GET /api/events/:id   ├───────────►│    longitude: Y  │
│          │             │            │    address: ...  │
│          │             │            │    ...           │
│          ◄─────────────┤────────────┤  }               │
│          │             │            │                  │
│  Receive Event         │            │                  │
│  {lat, lng, venue}     │            │                  │
│          │             │            │                  │
│          ▼             │            │                  │
│  Geolocation API       │            │                  │
│  Requires permission   │            │                  │
│          │             │            │                  │
│  User grants:          │            │                  │
│  {lat, lng, accuracy}  │            │                  │
│          │             │            │                  │
│          ▼             │            │                  │
│  DistanceCalc:         │            │                  │
│  Haversine(            │            │                  │
│   user_lat,            │            │                  │
│   user_lng,            │            │                  │
│   event_lat,           │            │                  │
│   event_lng            │            │                  │
│  ) = distance_km       │            │                  │
│          │             │            │                  │
│          ▼             │            │                  │
│  TimeEstimate:         │            │                  │
│  distance_km / 40 kmh  │            │                  │
│  = hours_minutes       │            │                  │
│          │             │            │                  │
│          ▼             │            │                  │
│  Leaflet.Map:          │            │                  │
│  Initialize            │            │                  │
│  Load OSM tiles        │            │                  │
│          │             │            │                  │
│          ▼             │            │                  │
│  Add Markers:          │            │                  │
│  User location marker  │            │                  │
│  Event marker          │            │                  │
│          │             │            │                  │
│          ▼             │            │                  │
│  Routing Machine:      │            │                  │
│  Calculate route       │            │                  │
│  Draw on map           │            │                  │
│          │             │            │                  │
│          ▼             │            │                  │
│  Display Results:      │            │                  │
│  Route info cards      │            │                  │
│  Interactive map       │            │                  │
│  Action buttons        │            │                  │
│                        │            │                  │
└────────────────────────┘            └──────────────────┘
```

## Map Initialization Sequence

```
1. User clicks "View Route"
   └─► Load route-map.html?eventId=xyz

2. Page DOM loads
   └─► Inline styles & Leaflet CSS loaded

3. DOM ready
   └─► Call initializeRoute()

4. initializeRoute()
   ├─► Show loading spinner
   ├─► Clear previous messages
   ├─► Fetch event data
   │   └─► GET /api/events/:id
   │       └─► Receive {_id, title, latitude, longitude, venue, address, ...}
   ├─► Display event details
   ├─► Get user location
   │   ├─► Request browser permission
   │   └─► Receive {lat, lng, accuracy}
   ├─► Initialize Leaflet map
   │   ├─► Create L.map('mapContainer')
   │   ├─► Add OpenStreetMap tiles
   │   ├─► Calculate center point
   │   └─► Set bounds to show both points
   ├─► Add markers
   │   ├─► User location (blue circle)
   │   └─► Event venue (purple pin)
   ├─► Calculate route
   │   ├─► Use Leaflet Routing Machine
   │   ├─► Set waypoints
   │   └─► Draw route path
   ├─► Display route info
   │   ├─► Calculate distance (Haversine)
   │   ├─► Estimate travel time
   │   └─► Display info cards
   ├─► Setup Google Maps button
   └─► Hide loading, show map

5. User interacts
   ├─► Click "Open in Google Maps"
   │   └─► Open new window with Google Maps URL
   ├─► Click "Refresh Route"
   │   └─► Call initializeRoute() again
   └─► Click "Back to Events"
       └─► Navigate to events.html
```

## Styling Structure

```
route-map.html
    │
    ├─► CSS Link: style.css (global styles)
    │
    ├─► Inline <style> in <head>
    │   ├─► .map-container (height: 70vh)
    │   ├─► .leaflet-container (font-family)
    │   ├─► .route-info (grid layout)
    │   ├─► .info-card (styled cards)
    │   ├─► .info-icon (icon styling)
    │   ├─► .loading-message
    │   ├─► .error-message
    │   ├─► .success-message
    │   ├─► .button-group
    │   ├─► .event-details (event info card)
    │   ├─► .back-button
    │   └─► @media (max-width: 768px) - Mobile
    │
    └─► Dynamic classes (applied by JS)
        ├─► .hidden (for loading/messages)
        ├─► .display: none (for map during load)
        └─► .display: block (for map after load)
```

## Error Handling Flow

```
initializeRoute()
    │
    ├─► Event ID missing?
    │   └─► showError("Event ID not provided")
    │       └─► Stop execution
    │
    ├─► Fetch event fails?
    │   └─► catch error
    │       └─► showError(error.message)
    │
    ├─► Event has no coordinates?
    │   └─► showError("Event location coordinates not available")
    │
    ├─► Geolocation permission denied?
    │   └─► showError("Location access was denied")
    │
    ├─► Geolocation unavailable?
    │   └─► showError("Location information not available")
    │
    ├─► Geolocation timeout?
    │   └─► showError("Location request timed out")
    │
    ├─► Map initialization fails?
    │   └─► catch error
    │       └─► showError(error.message)
    │
    └─► Success!
        └─► showSuccess("Route calculated successfully")
            └─► Hide loading, display map
```

## Browser Permissions Flow

```
User clicks "View Route"
    │
    ▼
Navigator.geolocation.getCurrentPosition()
    │
    ┌─────────────────┬─────────────────┐
    │                 │                 │
    ▼                 ▼                 ▼
 Browser prompts   Browser prompts   Browser prompts
 "Allow?"          "Allow?"          "Allow?"
    │                 │                 │
    │             ┌───┴───┐             │
    │             │       │             │
   YES           YES     NO           TIMEOUT
    │             │       │             │
    ▼             ▼       ▼             ▼
Success        Success Denied        Error
    │             │       │             │
    ▼             ▼       ▼             ▼
Return        Return    Show        Show
Location      Location  Error       Error
{lat,        {lat,     Message     Message
 lng}         lng}
```

---

## Summary

The GPS Route Map feature integrates multiple technologies:
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Mapping**: Leaflet.js + Leaflet Routing Machine
- **Location**: Browser Geolocation API
- **Backend**: Node.js/MongoDB (existing)
- **Data**: OpenStreetMap tiles

The user experience is seamless:
User clicks → Permission → Location obtained → Map loads → Route shown

All with proper error handling and user feedback throughout!
