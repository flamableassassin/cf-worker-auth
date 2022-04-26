
/**
 * @param {Request} request
 */
const auth = require("./routes/auth")
const logout = require("./routes/logout")
const callback = require("./routes/callback")
async function handler(request) {

  const url = new URL(request.url)
  const path = url.pathname.split("/")
  path.shift()
  switch (path[0]) {
    case "auth":
      return await auth(request)

    case "logout":
      return await logout(request)

    case "callback":
      return await callback(request)

    default:
      return new Response("hi")
  }


}

addEventListener('fetch', event => {
  event.respondWith(handler(event.request))
})