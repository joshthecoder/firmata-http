Firmata + HTTP
==============
A HTTP server which provides a RESTful API for communicating
with a microcontroller board that speaks the Firmata protocol.

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
