Firmata + HTTP
==============
A server which provides a HTTP API for accessing a microcontroller.
Server communicates with the microcontroller using the Firmata protocol.

###Installation
1. Connect microcontroller to computer which will run the HTTP server.
2. Upload firmware that implements the Firmata protocol.
3. Start this server passing it the path to the serial port
   which connects to the microcontroller.

###Dependencies
- [Firmata Node library](https://github.com/jgautier/firmata)
- [Express](expressjs.com)
- [node-serialport](https://github.com/voodootikigod/node-serialport)

###Microcontroller
Only the Arduino Uno has been tested so far. Other hardware
might require some tweaking to get working. Feel free to share any
fixes or tips.

###HTTP Endpoints

    GET /version/board
      --> {"major": 1, "minor": 2}

Get the major and minor version of the board.

    GET /version/firmware
      --> {"major": 2, "minor": 3, "name": "StandardFirmata"}

Get the major and minor version plus the name of the firmware.

    POST /pins/:num/write?type=&value=

Write data to a pin on the board.

    GET /pins/:num/read?type=&channel=

Subscribe to read data from a pin on the board.
Pin data is delivered by a series of events on a channel.
Use the `GET /channels/:id` endpoint for listening to these events.

    GET /channels/:id
      --> {"pin": 5, "value": 128}\n
      --> {"pin": 10, "value": 0}\n

Listen to a channel and receieve notification when events arrive.
This endpoint provides a streaming response with each event
being a JSON object delimited by newline characters.
