# Lead Connector Pro

https://github.com/dantaniaman506-svg/zest-lead-reactor.git

Phele toh yeah repo ko import kardio and is project or kama karna continue karde bs sb badiya smoothly chale bs 

Bhai ajj yeah kar smjha phele toh fir kal ka kam pura kar lio Lovable Prompt — sirf backend connect (UI mat badalna)

Do NOT redesign or restyle anything. Keep my existing UI, layout, colours,

components and copy exactly as they are. Your ONLY job is to connect the

existing frontend to my backend API and wire the data — nothing visual.



=== WHEN THE "GENERATE" BUTTON IS CLICKED ===

Read the values already selected/typed in my existing form:

- country            (from the country dropdown; default "India")

- location_mode      ("random" or "input" — from the location mode option)

- city               (the text the user typed; send "" empty string when

                      mode is "random")

- business_type      (the business type the user typed/selected)



Then send this HTTP request:



Method: POST

URL: https://oxford9897.app.n8n.cloud/webhook/lead-generation

Headers: { "Content-Type": "application/json" }

Body (JSON):

{

  "client_email": "demo@client.com",

  "country": "<country>",

  "location_mode": "<random|input>",

  "city": "<city or empty>",

  "business_type": "<business_type>"

}



(client_email is hardcoded to "demo@client.com" for now — MVP demo.)



While the request is in progress, use my existing loading state / spinner

if one exists (the request can take 30-90 seconds).



=== RESPONSE (map into my existing UI, don't build new UI) ===

The backend returns JSON in this shape:

{

  "success": true,

  "count": 8,

  "leads": [

    {

      "business_name": "...",

      "owner_name": "...",

      "category": "...",

      "phone": "...",

      "email": "...",

      "website": "...",

      "maps_link": "...",

      "instagram_link": "...",

      "gap": "...",

      "city": "..."

    }

  ]

}



- If success is false OR leads is empty: show my existing empty/error state

  (or a simple message "No leads found, try another city or business type.").

- If success is true: populate my existing leads table/list from `leads`.

  Map each field to the matching column/element I already have:

    business_name, category, phone, email, city

  - Maps: make my existing Maps icon/link open `maps_link` in a new tab.

  - Instagram: make my existing Instagram icon/link open `instagram_link`

    in a new tab. If `instagram_link` is empty for a row, hide that row's

    Instagram icon.



=== ROW / DETAIL VIEW (use my existing detail panel/modal) ===

When a row is opened, fill my existing detail component with:

- business_name, category, city

- owner_name  (if empty show "Not publicly available")

- phone, email (if empty show "Not available")

- website (if empty show "No website")

- gap  -> put this into my existing "gap"/"why they need a website" area

- Maps button -> opens maps_link ; Instagram button -> opens instagram_link

  (hide the Instagram button if instagram_link is empty)



Use CORS-safe fetch. Handle network/timeout errors gracefully with my

existing error state. Do not change any styling, layout or components —

only wire the API call and bind the returned data.

Smjha jo bhi dekh le manie n8n backend ke liye use jara hai uske ai ne yeah prompt diya h dekh Lio Apne hisab se and Jojo change hai vah apne hisab se kar diya bus yahi yad rakhiyo ki mera jo yah automation Hai aaram se smoothly chal jaaye aur mujhe koi bhi error Na Aaye aur bahut beautiful aur modern tarike Se sab Ko Jo as asthetic tarike se


Bhai credits khatam ho gaye, isliye backend wiring beech me ruk gaya — abhi tak koi file change nahi hui, tera UI jaisa tha waisa hi safe hai.

Jo karna baaki hai (agli baar seedha yeh implement kar dunga):

1. `src/lib/airleads.server.ts` — webhook URL ko `https://oxford9897.app.n8n.cloud/webhook/lead-generation` karna, aur `normalizeLeads` ko naye response shape (`business_name`, `owner_name`, `category`, `phone`, `email`, `website`, `maps_link`, `instagram_link`, `gap`, `city`) ke liye update karna — `mapsLink`, `instagramLink`, `gap` naye fields ke saath.
2. `src/lib/airleads.functions.ts` — request body ko exactly `{ client_email: "demo@client.com", country, location_mode, city, business_type }` bhejna, 90s timeout + graceful error message ke saath.
3. `src/components/GeneratePanel.tsx` — existing style me hi ek chhota "Location" toggle (Random / Enter city) + city input add karna, kyunki backend ko `location_mode` aur `city` chahiye. Baaki sab (colors, layout, slider, cards) bilkul same.
4. `src/components/LeadsTable.tsx` + `LeadCard.tsx` — Maps aur Instagram icon links (new tab, Instagram empty ho to hide), aur detail view me `gap`, fallback texts: owner → "Not publicly available", phone/email → "Not available", website → "No website".
5. `src/routes/index.tsx` — config me `locationMode`/`city` pass karna, empty/error state pe "No leads found, try another city or business type." dikhana, CSV export me naye columns. Bhai sb smoothly chale bs yeah dhyaan rakhio

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/41841835-8d9f-4675-a554-b04876cc59fc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
