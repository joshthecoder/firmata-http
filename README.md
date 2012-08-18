Firmata + HTTP
==============
A HTTP server which provides a RESTful API for communicating
with a microcontroller board that speaks the Firmata protocol.

HTTP Endpoints
--------------

  > GET /version/board
  < ":version"

Get the version of the board.

  > GET /version/firmware
  < ":version"

Get the version of the firmware running on the board.

  > GET /pins/:number/read?type=[digital|analog]&channel=[1+]
  < ":pin-value" (only provided when not using a channel)

Subscribe to read analog or digital data from a pin.
You may optionally use a channel to collect the pin data
by providing a channel ID when making the request.
If no channel is provided this request will block until
data arrives or the connection times out.

  > GET /channel/:id
  < {"pin": ":number", "value": ":current-value"}

Create a persistent connection to a pin data channel.
This is used for receiving pin data after making a request
to `GET /pins/:number/read`. The response will be a stream
of data objects.

  > POST /pins/:number/write?type=[digital|analog]&value=[0+]

Write analog or digital data to a pin.

  > POST /pins/:number?mode=[INPUT|OUTPUT|ANALOG|PWM|SERVO]

Set the pin to a certain mode.

  > GET /pins/:number/mode

