# Build a Video Chat App with Twilio and Gatsby

WIP — this code is in various stages of chaos right now.

## Function for Getting a Twilio Room Token

### Get an API Key and Secret
-   Navigate to the [API Keys](https://www.twilio.com/console/project/api-keys) dashboard
    - Dashboard => Settings => API Keys
-   Create a new “Standard” API key
-   Give it a friendly name so you remember what it’s for
-   Copy the SID — this is your API key — and store it in a secure place
-   Copy the secret and store it in a secure place
-   Check the box confirming you’ve saved the SID and secret
-   Click “Done”

### Make the API Key and Secret Available to the Function
-   Navigate to the [Configuration](https://www.twilio.com/console/functions/configure) section
-   Check the box to “Enable ACCOUNT_SID and AUTH_TOKEN”
-   Add an environment variable called `API_KEY` with the value set to your API key
-   Add an environment variables called `API_SECRET` with the value set to your API secret
-   Click “Save”

### Create a Serverless Function in Twilio

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

## What could you build with this?

- Customer support video chat
- Pair programming app (Twilio Video supports screen sharing!)
- Adding video calling to your social app
- Building a custom webinar platform
