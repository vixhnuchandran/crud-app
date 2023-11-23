const { Router } = require("express")
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node")
const services = require("../services/render")
const multer = require("multer")

const route = Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

route.get("/", ClerkExpressWithAuth({}), services.home)

route.get("/dashboard", ClerkExpressWithAuth({}), services.dashboard)

route.get("/about", ClerkExpressWithAuth({}), services.about)

route.get("/logs", ClerkExpressWithAuth({}), services.logs)

route.get("/dashboard/create/", ClerkExpressWithAuth({}), services.create)

route.get("/dashboard/update/:sid", ClerkExpressWithAuth({}), services.update)

route.get("/dashboard/view/:sid", ClerkExpressWithAuth({}), services.view)

route.get(
  "/dashboard/contact/:sid",
  ClerkExpressWithAuth({}),
  services.contactInfo
)

route.get(
  "/dashboard/student/:sid",
  ClerkExpressWithAuth({}),
  services.studentInfo
)

// route.get(
//   "/dashboard/marksheet/update/:sid",
//   ClerkExpressWithAuth({}),
//   services.upadteMarksheet
// )

route.get(
  "/dashboard/marksheet/:sid",
  ClerkExpressWithAuth({}),
  services.marksheet
)

route.get(
  "/dashboard/marksheet/create/:sid",
  ClerkExpressWithAuth({}),
  services.createMarksheet
)

route.post(
  "/dashboard/marksheet/create/:sid",
  ClerkExpressWithAuth({}),
  services.createNewMarksheet
)
route.post(
  "/dashboard/create",
  ClerkExpressWithAuth({}),
  upload.single("file"),
  services.createStudent
)

route.post(
  "/dashboard/update/:sid",
  ClerkExpressWithAuth({}),
  upload.single("file"),
  services.updateStudent
)

route.patch("/dashboard/delete/:sid", ClerkExpressWithAuth({}), services.delete)

route.get("/*", services.error)
module.exports = route
