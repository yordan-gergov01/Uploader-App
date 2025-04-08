const net = require("net");
const fs = require("node:fs/promises");

const server = net.createServer(() => {});

let fileHandle, fileWriteStream;

// this socket refers to the client endpoint
// and it's actually a duplex stream
server.on("connection", (socket) => {
  console.log("New connection!");

  socket.on("data", async (data) => {
    if (!fileHandle) {
      socket.pause(); // pause receiving data from the client
      fileHandle = await fs.open(`storage/test.txt`, "w");
      fileWriteStream = fileHandle.createWriteStream();

      // Writing to our destination file
      fileWriteStream.write(data);

      socket.resume(); //resume receiving data from the client

      fileWriteStream.on("drain", () => {
        socket.resume();
      });
    } else {
      if (!fileWriteStream.write(data)) {
        console.log("Buffer is full, pausing...");

        socket.pause();
      }
    }
  });

  socket.on("end", () => {
    fileHandle.close();
    fileHandle = undefined;
    fileWriteStream = undefined;
    socket.end();
    console.log("Connection ended!");
  });
});

server.listen(5050, "::1", () => {
  console.log("Uploader server opened on:", server.address());
});
