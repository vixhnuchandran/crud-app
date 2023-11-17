document.addEventListener("DOMContentLoaded", () => {
  const publishableKey =
    "pk_test_Z29sZGVuLW1vb3NlLTU3LmNsZXJrLmFjY291bnRzLmRldiQ"

  const startClerk = async () => {
    const Clerk = window.Clerk

    try {
      await Clerk.load()

      const userButton = document.getElementById("user-button")
      const authLinks = document.getElementById("auth-links")

      Clerk.addListener(({ user }) => {
        authLinks.style.display = user ? "none" : "block"
      })

      if (Clerk.user) {
        Clerk.mountUserButton(userButton)
        userButton.style.margin = "auto"
        userButton.style.display = "flex"
        userButton.style.alignItems = "center"

        const usernameDisplay = document.createElement("div")
        usernameDisplay.style.marginRight = "8px"
        usernameDisplay.textContent = Clerk.user.firstName

        userButton.appendChild(usernameDisplay)
      }
    } catch (err) {
      console.error("Error starting Clerk: ", err)
    }
  }
  ;(() => {
    const script = document.createElement("script")
    script.setAttribute("data-clerk-publishable-key", publishableKey)
    script.async = true
    script.src = `https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js`
    script.crossOrigin = "anonymous"
    script.addEventListener("load", startClerk)
    document.body.appendChild(script)
  })()
})
