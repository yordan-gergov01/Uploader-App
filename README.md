# Node.js File Uploader via TCP (IPv6)

This is a lightweight file upload system built with **Node.js** that uses **raw TCP sockets** and supports **IPv6 (::1)**. The server accepts incoming files and stores them locally, while the client handles reading and streaming files to the server with upload progress displayed in real-time.

## Features

- Upload files using raw TCP (no HTTP involved)
- Uses **IPv6 loopback address (::1)**
- Real-time upload progress indicator in the terminal
- Handles **back-pressure** with stream pause/resume
- Simple and modular architecture


## How It Works

📡 Server (server.js)

- Listens on IPv6 loopback ::1:5050.

- Receives a TCP stream that starts with a header:
fileName: <name>-------<binary content>

- Creates a write stream to save the file in storage/.

- Uses stream back-pressure to manage large uploads.

🖥️ Client (client.js)

- Connects to ::1:5050 via TCP.

- Reads a local file using a readable stream.

- Sends file metadata followed by file content.

- Displays upload progress with percentage updates.

- Pauses/resumes based on socket write buffer status.
