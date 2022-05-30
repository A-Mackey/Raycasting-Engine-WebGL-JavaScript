// Define constants
const PORT = 8080;
const PATH = "./public/index.html"

//   Import libraries
  http = require("http"),
  fs = require("fs"),
  mime = require("mime-types");
   
  // Create Server
  const server = http.createServer((req, res) => {
    // This simple server will serve files
    let rfile = "./" // path
    rfile += (req.url == "/") ? PATH : req.url ;
    if (fs.existsSync(rfile)) {
      if (fs.lstatSync(rfile).isDirectory()) { rfile = null; }
    } else { rfile = null; }
   
    // Not found or is folder
    if (rfile === null) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.write("<html><body>Not Found</body></html>");
    }
   
    // Load and server file
    else {
      res.writeHead(200, { "Content-Type": mime.lookup(rfile) });
      res.write(fs.readFileSync(rfile));
    }
   
    // Close
    res.end();
  });
   
  // Start server
  server.listen(PORT);
  console.log("🚀 Server is running at http://localhost:" + PORT);