import fs from "fs-extra"

fs.copySync("./api", "./dist/api")
fs.copySync("./vercel.json", "./dist/vercel.json")