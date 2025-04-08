const net = require("net");
const fs = require("node:fs/promises");

const server = net.createServer(() => {});

// this socket refers to the client endpoint
// and it's actually a duplex stream
server.on("connection", (socket) => {
  console.log("New connection!");

  socket.on("data", async (data) => {
    const fileHandle = await fs.open(`storage/test.txt`, "w");
    const fileStream = fileHandle.createWriteStream();
    fileStream.write(data);
  });
});

server.listen(5050, "::1", () => {
  console.log("Uploader server opened on:", server.address());
});
