  var http        = require('http'),
      request     = require('request'),
      querystring = require('querystring');

//curl -X POST -v --data '{"email":"andykent","password":"gsrX7LfV4wvNVo"}' https://api.pinocc.io/v1/login

function switchOnLed() {
  var message = "Switching L.E.D. On"
  console.log(message)

  request.get("http://localhost:4000?say=" + querystring.escape(message))

  var pinoccio = require('pinoccio');
  var api = pinoccio('297ad46d9ea55ac3c772c661ef1a9dc7');

  api.rest({url:"/v1/4/1/command/led.red"},function(error,data){
    if(error) {
      return console.log('Error:', error);
    }
  })
}

function switchOffLed() {
  var message = "Switching L.E.D. Off"
  console.log(message)

  request.get("http://localhost:4000?say=" + querystring.escape(message))

  var pinoccio = require('pinoccio');
  var api = pinoccio('297ad46d9ea55ac3c772c661ef1a9dc7');

  api.rest({url:"/v1/4/1/command/led.off"},function(error,data){
    if(error) {
      return console.log('Error:', error);
    }
  })
}


function toggleLed() {
  var pinoccio = require('pinoccio');
  var api = pinoccio('297ad46d9ea55ac3c772c661ef1a9dc7');

  api.rest({url:"/v1/4/1/command/led.report"},function(error,data){
    if(error) {
      return console.log('Error:', error);
    }

    var ledColor = JSON.parse(data.reply).led

    if (ledColor[0] == 0 && ledColor[1] == 0 && ledColor[2] == 0) {
      switchOnLed()
    } else {
      switchOffLed()
    }
  })
}

function processCommand(command) {
  console.log(command)

  if (command.on_off != undefined) {
    if (command.on_off.value == 'toggle') {
      toggleLed()
    }

    if (command.on_off.value == 'on') {
      switchOnLed()
    }

    if (command.on_off.value == 'off') {
      switchOffLed()
    }
  }
}

function createServer(port) {
  http.createServer(function (req, res) {
    var body = "";

    req.on('data', function (chunk) {
      body += chunk;
    })

    req.on('end', function () {
      res.writeHead(200, {'Access-Control-Allow-Origin': '*'})
      res.end('OK!');

      var formData = JSON.parse(body);
      processCommand(formData)
    });

  }).listen(port)
}

function start() {
  createServer(8082)
}

start()
