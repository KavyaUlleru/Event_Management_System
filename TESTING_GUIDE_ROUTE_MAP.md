# GPS Route Map - Testing & Troubleshooting Guide

## Quick Testing Checklist

### Pre-Test Setup
- [ ] Backend server running (`npm start` in backend folder)
- [ ] MongoDB connection working
- [ ] Frontend accessible at `http://localhost:3000`
- [ ] Test event created with GPS coordinates
- [ ] Browser has geolocation support

### Test Scenarios

#### Test 1: View Route Button Visibility
```
Steps:
1. Navigate to Events page
2. Check if events with coordinates have "📍 View Route" button
3. Check if events without coordinates don't show the button

Expected:
- Green "View Route" button appears ONLY for events with latitude/longitude
- Button is visible and clickable
```

#### Test 2: Route Map Page Load
```
Steps:
1. Click "View Route" button on any event
2. Observe loading spinner
3. Wait for geolocation request

Expected:
- Route map page loads
- Loading spinner displays
- Browser permission prompt appears for location access
```

#### Test 3: Successful Route Display
```
Steps:
1. Grant location permission
2. Wait for map to load
3. Verify map displays

Expected:
- Loading spinner disappears
- Map container becomes visible
- Success message shows: "✅ Route calculated successfully!"
- Event details visible at top
- Route information cards display (Start, Destination, Distance, Time)
- Interactive map shows:
  * Blue circle at user location
  * Purple marker at event venue
  * Blue line showing the route
  * Zoom/pan controls
```

#### Test 4: Route Information Accuracy
```
Steps:
1. Note the calculated distance
2. Cross-check with Google Maps:
   - Open Google Maps
   - Enter your coordinates
   - Navigate to event location
   - Compare distances

Expected:
- Distance in our app should be approximately equal to Google Maps
- Travel time estimate should be reasonable for the distance
```

#### Test 5: Google Maps Integration
```
Steps:
1. Look for "📍 Open in Google Maps" button
2. Click it
3. New window opens with Google Maps

Expected:
- Google Maps opens in new tab/window
- Shows route from your location to event
- Allows turn-by-turn navigation
```

#### Test 6: Refresh Route Button
```
Steps:
1. Click "🔄 Refresh Route" button
2. Wait for route to recalculate

Expected:
- Map reloads
- Route recalculates based on current location
- All info updates
```

#### Test 7: Back Navigation
```
Steps:
1. Click "← Back to Events" button
2. Observe page navigation

Expected:
- Returns to events.html
- All event information preserved
```

#### Test 8: Mobile Responsiveness
```
Steps:
1. Open route map on mobile device
2. Test on landscape and portrait orientations
3. Try pinch-to-zoom on map

Expected:
- Map displays properly on mobile
- Buttons remain clickable and sized appropriately
- Map maintains correct height (50vh on mobile)
- Responsive grid for info cards
```

#### Test 9: Location Permission Denied
```
Steps:
1. Click "View Route"
2. When permission prompt appears, click "Deny" or "Block"
3. Observe error handling

Expected:
- Error message appears: "Location access was denied"
- Message explains how to fix (enable location services)
- Loading spinner disappears
- Map doesn't load
```

#### Test 10: Geolocation Timeout
```
Steps:
1. Turn off GPS/location services
2. Click "View Route"
3. Wait for timeout (approximately 10 seconds)

Expected:
- Error message appears: "Location request timed out"
- User can retry by clicking "Refresh Route"
```

#### Test 11: Event Without Coordinates
```
Steps:
1. Manually create or update event without latitude/longitude
2. Navigate to events page
3. Check button visibility

Expected:
- "View Route" button doesn't appear
- Instead shows: "📍 Location map will be available..."
```

#### Test 12: Direct URL Access
```
Steps:
1. Try accessing: route-map.html?eventId=invalid_id
2. Try accessing: route-map.html (no eventId)

Expected:
- Error message: "Event ID not provided"
- OR "Event not found"
- Page handles gracefully without crashing
```

## Browser Developer Tools Testing

### Console Checks
```javascript
// These should all succeed without errors
// Check in browser console (F12)

// 1. Verify Leaflet loaded
console.log(typeof L); // Should output "object"

// 2. Verify routing control available
console.log(typeof L.Routing); // Should output "object"

// 3. Verify geolocation API
console.log('geolocation' in navigator); // Should output "true"

// 4. Check local storage
console.log(localStorage.getItem('token')); // Should show token if logged in
```

### Network Tab Checks
```
In DevTools Network Tab:
- Check GET /api/events/:id request
  * Status should be 200
  * Response should include latitude/longitude
  
- Check tile requests
  * Multiple requests to tile.openstreetmap.org
  * Should return 200 status
  
- Check routing requests
  * API calls to routing service (may vary)
  * Should return route data
```

### Console Debugging
```javascript
// If something breaks, check console for:
// - Map initialization errors
// - Geolocation errors
// - API call failures
// - JavaScript exceptions

// Search console for:
console.log('Map initialization skipped for:', mapId);
// This indicates map couldn't be created
```

## Common Issues & Solutions

### Issue 1: "View Route Button Not Showing"
**Problem:** Green button doesn't appear on events

**Debugging:**
1. Check browser console for errors
2. Verify event has latitude/longitude in database:
   ```javascript
   // In backend MongoDB:
   db.events.find({latitude: {$exists: true}})
   ```
3. Check events.html was properly updated
4. Clear browser cache (Ctrl+Shift+Delete)

**Solutions:**
1. Update event with coordinates:
   ```javascript
   // MongoDB shell
   db.events.updateOne(
     {_id: ObjectId("...")},
     {$set: {latitude: 28.6139, longitude: 77.2090}}
   )
   ```
2. Hard refresh browser (Ctrl+F5)
3. Check network tab - event API returns coordinates

### Issue 2: "Map Not Loading After Permission Granted"
**Problem:** User grants location, but map stays blank

**Debugging:**
1. Check browser console for errors
2. Verify Leaflet library loaded in Network tab
3. Check map container height

**Solutions:**
1. Hard refresh page (Ctrl+F5)
2. Clear browser cache
3. Check if Leaflet files loaded:
   ```javascript
   console.log(L.map); // Should be a function
   ```
4. Check if geolocation returned valid coordinates

### Issue 3: "Geolocation Permission Always Denied"
**Problem:** Browser won't prompt for location

**Debugging:**
1. Check browser permission settings
2. Verify using HTTPS or localhost
3. Check if location services enabled on OS

**Solutions:**
1. **Chrome**: Settings → Privacy → Site Settings → Location
   - Clear permissions for localhost
   - Refresh page (will re-prompt)

2. **Firefox**: about:preferences → Privacy → Permissions
   - Remove location permission for localhost
   - Refresh page

3. **Safari**: Preferences → Privacy
   - Clear location permissions
   - Refresh page

4. **Windows**: Settings → Privacy & Security → Location
   - Ensure location services enabled

### Issue 4: "Distance/Time Calculation Seems Wrong"
**Problem:** Calculated distance doesn't match Google Maps

**Debugging:**
1. Verify coordinates in database
2. Check if using correct latitude/longitude order
3. Verify Haversine formula calculation

**Solutions:**
1. Verify coordinates:
   ```javascript
   // Check in database
   // Latitude should be around -90 to 90
   // Longitude should be around -180 to 180
   // Latitude typically listed FIRST
   ```

2. Test calculation:
   ```javascript
   // In browser console:
   function testDistance() {
     const lat1 = 28.6139;  // user
     const lon1 = 77.2090;  // user
     const lat2 = 28.6355;  // event
     const lon2 = 77.2305;  // event
     
     const R = 6371;
     const dLat = (lat2 - lat1) * Math.PI / 180;
     const dLon = (lon2 - lon1) * Math.PI / 180;
     const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
               Math.sin(dLon/2) * Math.sin(dLon/2);
     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
     return R * c;
   }
   testDistance(); // Should return distance in km
   ```

### Issue 5: "Leaflet Routing Machine Not Working"
**Problem:** Route doesn't display on map

**Debugging:**
1. Check if Leaflet Routing library loaded
2. Check console for errors
3. Verify coordinates are valid

**Solutions:**
1. Verify library loaded:
   ```javascript
   console.log(L.Routing); // Should be an object
   ```

2. Check CDN links in route-map.html:
   ```html
   <script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.umd.js"></script>
   ```

3. Verify coordinates format in JavaScript:
   ```javascript
   // Should create valid LatLng objects
   L.latLng(userLat, userLng)
   ```

### Issue 6: "Map Controls Not Appearing"
**Problem:** No zoom buttons or pan controls on map

**Debugging:**
1. Check if map container has correct size
2. Verify Leaflet CSS loaded
3. Check for CSS conflicts

**Solutions:**
1. Verify Leaflet CSS linked:
   ```html
   <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
   ```

2. Verify map container:
   ```css
   .map-container {
     height: 70vh;  /* Must have height */
     width: 100%;
   }
   ```

3. Check for conflicting CSS in DevTools

### Issue 7: "OpenStreetMap Tiles Not Loading"
**Problem:** Map shows but no map imagery

**Debugging:**
1. Check Network tab for tile requests
2. Verify CDN is accessible
3. Check map center coordinates

**Solutions:**
1. Verify tile layer URL:
   ```javascript
   'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
   ```

2. Check network connectivity
3. Verify coordinates are reasonable
4. Check if URL parameters correct

### Issue 8: "Google Maps Button Goes to Wrong Location"
**Problem:** Google Maps opens but shows different route

**Debugging:**
1. Verify coordinates passed to URL
2. Check URL format

**Solutions:**
1. Verify URL format:
   ```javascript
   const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${eventLat},${eventLng}`;
   // Check if lat/lng are actual numbers, not undefined
   ```

2. Test with fixed coordinates:
   ```javascript
   // Should work:
   https://www.google.com/maps/dir/28.6139,77.2090/28.6355,77.2305
   ```

## Performance Testing

### Load Time Check
```javascript
// In browser console:
// Measure time to load and display map
console.time('route-load');
// ... click view route, wait for map ...
console.timeEnd('route-load');

// Should be < 3 seconds for optimal UX
```

### Memory Leak Check
```javascript
// Open DevTools > Performance
// 1. Take heap snapshot
// 2. Use route map
// 3. Go back to events
// 4. Take another heap snapshot
// 5. Compare - should be similar
```

### Network Throttling Test
```
Steps:
1. Open DevTools > Network tab
2. Set throttling to "Slow 3G"
3. Click "View Route"
4. Observe loading time and behavior

Expected:
- Loading spinner should show
- Map should eventually load
- No timeout errors
- Graceful degradation
```

## Database Verification

### Check Event Coordinates
```javascript
// MongoDB shell
use event_management;
db.events.find({}, {title: 1, latitude: 1, longitude: 1})

// Should show events with coordinates like:
// { _id: ObjectId(...), title: "Test Event", latitude: 28.6139, longitude: 77.2090 }
```

### Verify Test Event Creation
```javascript
db.events.findOne({title: "Test Event"})

// Should return complete event with:
// - latitude: 28.6139
// - longitude: 77.2090
// - All required fields populated
```

## API Testing

### Test Event Endpoint
```bash
# Using curl or Postman
GET http://localhost:5000/api/events/[eventId]

# Should return:
{
  "success": true,
  "event": {
    "_id": "...",
    "title": "...",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "address": "...",
    "venue": "...",
    ...
  }
}
```

## Accessibility Testing

### Keyboard Navigation
```
1. Open route map
2. Tab through elements
3. Verify all interactive elements reachable
4. Check focus indicators visible
```

### Screen Reader Testing
```
1. Use NVDA (Windows) or JAWS
2. Navigate through page
3. Verify all content readable
4. Check button labels clear
```

### Color Contrast
```
1. Use WCAG Contrast Checker
2. Check all text colors
3. Verify meets AA or AAA standards

Key colors to check:
- Button text on colored backgrounds
- Info card text
- Error/success messages
```

## Security Testing

### XSS Prevention
```javascript
// In browser console, try:
// Should NOT execute scripts

// Try injecting in URL:
route-map.html?eventId=<script>alert('xss')</script>
// Should show "Event ID not provided" or not find event

// Try injecting in event title:
// Event details should display safely without executing
```

### Location Data Privacy
```
1. Check Network tab
2. Verify location data NOT sent to server
3. Only event ID sent to API
4. User location kept client-side only
```

## Final Checklist Before Production

- [ ] All 12 test scenarios pass
- [ ] No errors in browser console
- [ ] Works on Chrome, Firefox, Safari, Edge
- [ ] Mobile testing complete
- [ ] Accessibility testing done
- [ ] Performance acceptable (< 3s load)
- [ ] Error messages helpful and clear
- [ ] No location data stored on server
- [ ] API endpoints secure
- [ ] Documentation complete

## Reporting Issues

When reporting issues, include:
1. Browser and version
2. Operating system
3. Steps to reproduce
4. Expected vs actual behavior
5. Console error messages
6. Screenshots/screencasts
7. Event ID being tested
8. Location (geographic area)

---

**Last Updated:** January 29, 2026
**Testing Framework:** Manual Testing
**Status:** Ready for QA
