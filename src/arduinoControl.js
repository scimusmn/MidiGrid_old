var arduino = inheritFrom(HTMLElement,function(){
	var self= this;
	var arduino = this;
	this.handlers =[];

	var wsClient = $("$web-socket");

  this.onMessage = function(evt) {
    var dataRay = evt.data.split(/[\s|,()=]+/);
    switch (dataRay[0]){
      case 'pinChange':
      case 'digitalRead':
      case 'analogRead':
        if (arduino.handlers[parseInt(dataRay[1])]) arduino.handlers[parseInt(dataRay[1])](parseInt(dataRay[1]), parseInt(dataRay[2]));
        break;
      default:
        break;
    }
  };

  /*arduino.connect = function(cb) {
    wsClient.setMsgCallback(arduino.onMessage);
    wsClient.connect(cb);
  };*/

  arduino.digitalWrite = function(pin, dir) {
    wsClient.send('r|digitalWrite(' + pin + ',' + dir + ')');
  };

  arduino.digitalRead = function(pin) {
    wsClient.send('r|digitalRead(' + pin + ')');
  };

  arduino.analogWrite = function(pin, val) {
    wsClient.send('r|analogWrite(' + pin + ',' + val + ')');
  };

  arduino.watchPin = function(pin, handler) {
    //wsClient.send('r|watchPin(' + pin + ')');
    arduino.handlers[pin] = handler;
  };

  this.analogReport = function(pin, interval, handler) {
    wsClient.send('r|analogReport(' + pin + ',' + Math.floor(interval) + ')');
    arduino.handlers[pin] = handler;
  };

  arduino.setHandler = function(pin, handler) {
    arduino.handlers[pin] = handler;
  };

  arduino.analogRead = function(pin) {
    wsClient.send('r|analogRead(' + pin + ')');
  };

  arduino.stopReport = function(pin) {
    wsClient.send('r|stopReport(' + pin + ')');
  };

	this.createdCallback = function () {
    if(typeof $("$web-socket") === 'object')
			$("$web-socket").customCallback = this.onMessage.bind(this);
  }
});

document.registerElement('web-arduino', arduino);
