const net = require("net");
const fs = require("node:fs/promises");

const server = net.createServer(() => {});

// this socket refers to the client endpoint
// and it's actually a duplex stream
server.on("connection", (socket) => {
  console.log("New connection!");
  let fileHandle, fileWriteStream;

  socket.on("data", async (data) => {
    if (!fileHandle) {
      socket.pause(); // pause receiving data from the client

      const dividerIndex = data.indexOf("-------");
      const fileName = data.subarray(10, dividerIndex).toString("utf8");

      fileHandle = await fs.open(`storage/${fileName}`, "w");
      fileWriteStream = fileHandle.createWriteStream();

      // Writing to our destination file
      fileWriteStream.write(data.subarray(dividerIndex + 7));

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
