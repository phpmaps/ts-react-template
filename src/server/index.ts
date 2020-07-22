import * as express from "express";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import * as path from "path";
import * as morgan from "morgan";
// import { MsTeamsApiRouter, MsTeamsPageRouter } from "express-msteams-host";
import * as debug from "debug";
import * as compression from "compression";
import * as fs from "fs";
import * as https from "https";


// Initialize debug logging module
const log = debug("msteams");
log(`Initializing Microsoft Teams Express hosted App...`);

dotenv.config();

const app = express();
const { PORT = 3000 } = process.env;

// Inject the raw request body onto the request object
app.use(express.json({
  verify: (req, res, buf: Buffer, encoding: string): void => {
    (req as any).rawBody = buf.toString();
  }
}));
app.use(express.urlencoded({ extended: true }));

// Express configuration
app.set("views", path.join(__dirname, "/"));
app.use(morgan("tiny"));
app.use(compression());

// app.use(MsTeamsApiRouter(allComponents));

const outDir = process.env.MODE === "debug" ? "build" : "dist";

app.get("/ping", (req: Request, res: Response) => {
  res.send({
    version: "it works"
  });
});

app.get("/config", (req: Request, res: Response) => {
  res.sendFile("index.html", {
    root: path.resolve(outDir, "public")
  });
});

app.get("/tou", (req: Request, res: Response) => {
  res.sendFile("index.html", {
    root: path.resolve(outDir, "public")
  });
});

app.get("/remove", (req: Request, res: Response) => {
  res.sendFile("index.html", {
    root: path.resolve(outDir, "public")
  });
});

app.use(
  "/",
  express.static(path.resolve(outDir, "public"), {
    index: "index.html"
  })
);


console.log(path.resolve(outDir, "cert", "esri.crt"));
if (require.main === module) {

  if (process.env.MODE === "debug") {
    https.createServer({
      key: fs.readFileSync(path.resolve(outDir, "cert", "esri.key")),
      cert: fs.readFileSync(path.resolve(outDir, "cert", "esri.crt")),
      passphrase: "esri"
    }, app).listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
      log(`Server running on ${PORT}`);
    });
  } else {
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
      log(`Server running on ${PORT}`);
    });

  }
}

export default app;
