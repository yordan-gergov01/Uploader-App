const net = require("net");
const fs = require("node:fs/promises");

const socket = net.createConnection({ host: "::1", port: 5050 }, async () => {
  const filePath = "./text.txt";
  const fileHandle = await fs.open(filePath, "r");
  const fileReadStream = fileHandle.createReadStream();

  // Reading from the source file
  fileReadStream.on("data", (data) => {
    // handling back-pressure
    if (!socket.write(data)) {
      fileReadStream.pause();
    }
  });

  socket.on("drain", () => {
    fileReadStream.resume();
  });

  filReadeStream.on("end", () => {
    console.log("The file was successfully uploaded!");
    socket.end();
  });
});
