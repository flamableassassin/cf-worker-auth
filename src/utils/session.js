const { parse, serialize } = require('cookie');
const jwt = require('@tsndr/cloudflare-worker-jwt')

/**
 * Returns the session data from a cookie
 * @param {String} cookie The data from the cookie header
 * @return {Promise<Session>} Returns a session or an empty object if the session is invalid
 */
module.exports.getSession = async (cookie) => {
   const cookies = parse(cookie || "")
   let session = {};
   if (Object.keys(cookies).length !== 0 && cookies.hasOwnProperty("session") && await jwt.verify(cookies.session, "secret")) session = jwt.decode(cookies.session, "secret");
   if (!session.sessionID) session.sessionID = crypto.randomUUID();
   return session
}


/**
 * Parses an object into a signed string for a cookie
 * @param {Object} object The object to be signed
 * @returns {Promise<String>}
 */
module.exports.createSession = async (object) => serialize("session", await jwt.sign(object, "secret"))

/**
 * Represents a session
 * @typedef  {Object} Session
 * 
 * @property {String} [sessionID] The Session id 
 * 
 * @property {Object} discord The data fetched from discord
 * @property {String} discord.id
 * @property {String} discord.username
 * @property {String} discord.discriminator
 * @property {String} discord.avatar
 * 
 * @property {Object} exchange The data from auth token exchange
 * @property {String} exchange.access_token
 * @property {String} exchange.expires_in
 * @property {String} exchange.refresh_token
 * @property {String} exchange.scope
 * @property {String} exchange.token_type 
 */