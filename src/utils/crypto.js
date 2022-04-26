/**
 *! Nothing in this file is meant to be cryptographically secure
 */


/**
 * Generates a hash from a string
 * @param {String} str The string to hash
 * @returns {Promise<String>}
 */
module.exports.createHash = async (str) => {
   const encoder = new TextEncoder();
   const data = encoder.encode(str);
   const hash = await crypto.subtle.digest('SHA-256', data);
   return btoa(String.fromCharCode(...new Uint8Array(hash)));
}


/**
 * Compares 2 strings
 * @param {String} key
 * @param {String} string
 */
module.exports.compare = (key, string) => {
   let equal = false;
   const iterations = key.length >= string.length ? key.length : string.length

   for (let i = 0; i < iterations; i++) {
      if (string[i] === key[i]) equal = true;
   }

   return equal;
}