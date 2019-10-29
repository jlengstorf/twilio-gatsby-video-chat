# Build a Video Chat App with Twilio and Gatsby

WIP — this code is in various stages of chaos right now.

## How to Build This App

### Create a layout

Diff: https://github.com/jlengstorf/twilio-gatsby-video-chat/compare/44303ee...d1a0359

- `/src/components/layout.js`
- Add an index page so we can see the layout `src/pages/index.js`

### Create a form to allow people to join a room

Diff: https://github.com/jlengstorf/twilio-gatsby-video-chat/compare/d1a0359...a030444

- `src/components/join.js`
- Update the index to use the `Join` component

### Set up client-side routing for dynamic room creation

Diff: https://github.com/jlengstorf/twilio-gatsby-video-chat/compare/a030444...cfd9e78

- `src/components/video-display.js`
    - dump the props for now
- Add a `Room` page `src/pages/room.js`
- Set up Reach Router to 

### Set up Twilio to allow room creation and video

#### Get an API key and secret
-   Navigate to the [API Keys](https://www.twilio.com/console/project/api-keys) dashboard
    - Dashboard => Settings => API Keys
-   Create a new “Standard” API key
-   Give it a friendly name so you remember what it’s for
-   Copy the SID — this is your API key — and store it in a secure place
-   Copy the secret and store it in a secure place
-   Check the box confirming you’ve saved the SID and secret
-   Click “Done”

#### Make the API key and secret available to the function
-   Navigate to the [Configuration](https://www.twilio.com/console/functions/configure) section
-   Check the box to “Enable ACCOUNT_SID and AUTH_TOKEN”
-   Add an environment variable called `API_KEY` with the value set to your API key
-   Add an environment variables called `API_SECRET` with the value set to your API secret
-   Click “Save”

#### Create a serverless function in Twilio

-   Navigate to the [functions console](https://twilio.com/console/functions/manage)
-   Create a new function named “Create Room Token” using the "Blank" template
-   For the path, use `/create-room-token`
-   Click the copy button next to the path and store this; we’ll use it in the app later
-   Uncheck the box for “Check for valid Twilio signature”
-   Leave the Event dropdown at the default value (“Select...”)
-   In the “Code” area, add:
    ```js
    exports.handler = function (context, event, callback)  {
      const { ACCOUNT_SID, API_KEY, API_SECRET } = process.env;
      const AccessToken = Twilio.jwt.AccessToken;
      const VideoGrant = AccessToken.VideoGrant;
      
      const grant = new VideoGrant();
      const token = new AccessToken(ACCOUNT_SID, API_KEY, API_SECRET);
      
      token.identity = event.identity;
      token.addGrant(grant);
      
      const response = new Twilio.Response();
      
      response.setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json',
      });

      response.setBody(token.toJwt());
      
      callback(null, response);
    };
    ```
-   Save the function

### Add a single-file state management hook

Diff: https://github.com/jlengstorf/twilio-gatsby-video-chat/compare/cfd9e78...04b1323

- `src/hooks/use-twilio-video.js`
- Create a reducer and context
- Wrap the app in the context provider
- Add a hook
- Use the reducer to update identity/room name via form submission

### Get a video token from Twilio

Diff: https://github.com/jlengstorf/twilio-gatsby-video-chat/compare/04b1323...3c67289

- Create a `getRoomToken` function
- Export it from the hook
- Update the form to generate a token on submission

### Add support for direct linking to rooms

Diff: https://github.com/jlengstorf/twilio-gatsby-video-chat/compare/3c67289...ca5e3f9


- Check for a valid token in `VideoDisplay`
- If no token, redirect to the form with the room name in state
- Pass location from the index page to `Join`
- Read the room name from the location and use it in the form if one is set

### Add local video after joining a room

Diff: https://github.com/jlengstorf/twilio-gatsby-video-chat/compare/ca5e3f9...102a8fc


### Handle remote participants

Diff: https://github.com/jlengstorf/twilio-gatsby-video-chat/compare/102a8fc...e168349


### Handle disconnections

Diff: https://github.com/jlengstorf/twilio-gatsby-video-chat/compare/e168349...c8101d4

## What could you build with this?

- Customer support video chat
- Pair programming app (Twilio Video supports screen sharing!)
- Adding video calling to your social app
- Building a custom webinar platform
