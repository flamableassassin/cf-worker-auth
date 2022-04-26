const { serialize } = require('cookie');

/**
 * @param {Request} request
 */
module.exports = async (request) => {
   return new Response("Any session has been invalidated", {
      headers: {
         "Set-Cookie": serialize("session", "", {
            expires: new Date(0),
            maxAge: 0
         })
      }
   })
}