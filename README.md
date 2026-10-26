# Nidha Fathima — Wedding Invitation

A mobile-first wedding invitation with an editorial layout (ivory paper, burgundy and gold), built with React, TypeScript, Vite, Tailwind CSS and Framer Motion. RSVPs (attendance, guest count, meal choices) go to a private Google Sheet through a Google Apps Script web app. It's hosted on Netlify.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the build locally
```

Personalised links: `http://localhost:5173/?name=Adinan` shows "For Adinan" on the cover and pre-fills the RSVP name. The name is optional.

## Page structure

1. **Cover**: invitation line, couple's names, date and place, and a "View celebration details" button.
2. **01 The invitation**: Bismillah, invitation wording, ayah, family sign-off.
3. **02 Celebration plan**: timeline of the configured events (main event highlighted) with days-to-go.
4. **03 Venue & directions**: Get directions, Add to calendar (.ics), Call for details.
5. **04 RSVP**: Attending / Unable to attend / Not sure yet. "Attending" adds the guest count and meal split, and the meal total must equal the guest count. The guest reviews, then submits.
6. **Closing**: closing line, names, back to top.

Music never autoplays. The "Nasheed" button appears after the guest scrolls past the cover.

## Edit the wedding details

Everything lives in **`src/config/wedding.ts`**. Values in `[square brackets]` are placeholders.

| What | Field |
|---|---|
| Groom's name | `couple.groom` |
| Events (name, date/time, venue, map link) | `events` (add more entries for more events; mark one `main: true`) |
| Phone for "Call for details" | `contact.phone` |
| Wording | `invitation.*` |
| Max guests per RSVP | `rsvp.maxAttendees` (also `MAX_ATTENDEES` in `apps-script/Code.gs`) |
| Meal options | `rsvp.meals` (keep the ids in sync with `MEALS` in `apps-script/Code.gs`) |
| Music | `audio.src`, or `''` to disable |

## Google Sheets + Apps Script setup

1. Create a new Google Sheet at <https://sheets.new>. **Do not** share or publish it.
2. Open **Extensions → Apps Script**, replace the code with `apps-script/Code.gs`, and click **Save**.
3. Click **Deploy → New deployment → ⚙ Web app**. Set "Execute as" to **Me** and "Who has access" to **Anyone**, then click **Deploy** and **Authorize**. If you see "Google hasn't verified this app", click **Advanced → Go to … → Allow**. This is normal for your own script.
4. Copy the **Web app URL** (ends in `/exec`). Opening it should show `{"ok":true,"message":"RSVP endpoint is running."}`.
5. Test a write:
   ```bash
   curl -L -H "Content-Type: text/plain" -d '{"submissionId":"test-12345678","guestName":"Test","status":"attending","count":2,"meals":{"beef-biriyani":1,"neychoru-stew":1},"website":""}' "YOUR_EXEC_URL"
   ```
   This should return `{"ok":true}` and add a row to the **RSVP** tab. Delete the test row afterwards.

**RSVP tab:** Guest Name | Status (Attending / Declined / Not sure yet) | Count of Members | Beef biriyani | Neychoru + stew curry | Updated Date | Submission ID

**Summary tab:** created automatically, with live totals for guests attending, each meal, not sure and declined. The sheet is the host's private management view, and nothing is ever returned to the website.

> If you edit `Code.gs` later, use **Deploy → Manage deployments → ✎ → Version: New version**. That keeps the same URL.
> If you created the sheet with the older 3- or 5-column layout, delete the old RSVP and Summary tabs (or start a new sheet) so the new headers are created.

## Connect the frontend

Add the URL to `.env.local` (locally) or in Netlify under **Site configuration → Environment variables**:

```
VITE_RSVP_ENDPOINT=https://script.google.com/macros/s/XXXX/exec
```

**Demo mode:** while no endpoint is set and `rsvp.demoMode` is `true`, the RSVP shows a "Demo preview" banner. After submitting, it says "This response was not sent". It never claims the family received anything. With an endpoint set, it says "Your response has been sent" only after the script confirms the row was written. The script validates everything server-side, including that meal quantities add up to the guest count.

## Deploy to Netlify

Build settings come from `netlify.toml` (`npm run build`, publish folder `dist`). Either connect the GitHub repo in Netlify, or run `npm run build` and drag `dist` onto <https://app.netlify.com/drop>.

## Honest limitations

- The `?name=` value and the optional name field are labels, not proof of identity.
- Each browser gets a random Submission ID, so changing an answer in the same browser updates the same row. Replies from different phones can't be matched to the same person without a guest list.
- The Apps Script URL is public. Validation, length limits, formula-injection protection, a honeypot field and per-ID rate limiting reduce abuse but can't prevent fabricated submissions entirely.

## Testing checklist

- [ ] `/` shows "Wedding invitation"; `/?name=Adinan` shows "For Adinan" and pre-fills the name
- [ ] `/?name=<script>alert(1)</script>` is rejected (no name shown)
- [ ] Get directions opens the Maps link; Add to calendar downloads an .ics file with the correct date and time
- [ ] Attending: count 4, meals 2 + 2 → review shows both; 2 + 1 shows "Choose meals for 1 person more"; 2 + 3 shows "too many"
- [ ] "Review my response" is disabled until the meals match the count
- [ ] Unable to attend / Not sure yet: no count or meals asked; the sheet stores 0
- [ ] Demo mode: banner visible, result says "not sent"
- [ ] Connected: a row appears in the sheet; with Wi-Fi off, an error and "Try again" appear (no false success)
- [ ] Double-tapping Send creates one row
- [ ] Narrow phone (360px): no sideways scrolling; reduce-motion setting respected
