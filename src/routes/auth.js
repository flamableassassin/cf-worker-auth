const { clientID, callBackURL } = require("../config.json")
const { createHash } = require("../utils/crypto")
const { getSession, createSession } = require("../utils/session")
/**
 * @param {Request} request
 */
module.exports = async (request) => {
   const session = await getSession(request.headers.get("Cookie"))

   if (session.hasOwnProperty("discord")) return new Response(`Hello ${session.discord.username}#${session.discord.discriminator} 👋`)

   const hash = await createHash(session.sessionID) // should prob use something other than the session id
   const url = encodeURI(`https://discord.com/api/oauth2/authorize?response_type=code&client_id=${clientID}&scope=identify&state=${hash}&redirect_uri=${callBackURL}`);


   return new Response("", {
      status: 307,
      headers: {
         location: url,
         "Set-Cookie": await createSession(session)
      }
   })
}