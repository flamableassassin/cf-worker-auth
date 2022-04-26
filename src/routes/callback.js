const { clientID, callBackURL, clientSecret } = require("../config.json")

const { createHash, compare } = require("../utils/crypto")
const { getSession, createSession } = require("../utils/session")

/**
 * @param {Request} request
 */
module.exports = async (request) => {
   const session = await getSession(request.headers.get("Cookie"))

   const param = new URL(request.url).searchParams
   const hash = await createHash(session.sessionID)


   if (!param.has("state") || !compare(param.get("state"), hash)) return new Response("Invalid state");

   if (param.has("error") || !param.has("code")) return new Response("Unable to log you in")

   const response = await (await fetch("https://discord.com/api/oauth2/token", {
      method: 'post',
      body: `client_id=${clientID}&client_secret=${clientSecret}&grant_type=authorization_code&code=${param.get("code")}&redirect_uri=${callBackURL}`,
      headers: {
         'Content-Type': 'application/x-www-form-urlencoded'
      }
   })).json();



   const user = await (await fetch("https://discord.com/api/v9/users/@me", {
      headers: { 'Authorization': `Bearer ${response.access_token}` }
   })).json()


   session.discord = user;


   return new Response("hello", {
      headers: {
         "Set-Cookie": await createSession(session)
      }
   })

}