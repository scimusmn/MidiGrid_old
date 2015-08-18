var arduino = inheritFrom(HTMLElement,function(){
	var self= this;
	var arduino = this;
	this.digiHandlers =[];
	this.anaHandlers =[];
	var START = 128;
	var DIGI_READ = 0;
	var ANA_READ = 32;
	var ANA_WRITE = 64;
	var DIGI_WRITE = 96;
	var REPORT_TIME = 2;

	var wsClient = $("$web-socket");

  this.onMessage = function(evt) {
		msg = evt.data
		for(var i=0; i<msg.length-1; i++){
			var chr = msg.charCodeAt(i);
			if(chr&192){  //if the packet is analogRead
				var pin = ((chr & 56)>>3);				//extract the pin number
				var val = ((chr & 7)<<7)+(msg.charCodeAt(++i)&127); //extract the value

				if(typeof self.anaHandlers[pin] == 'function') self.anaHandlers[pin](val);
			}
			else if(chr&128){			//if the packet is digitalRead
				var pin = ((chr & 62)>>1);
				var val = chr&1;

				if(typeof self.digiHandlers[pin] == 'function') self.digiHandlers[pin](val);
			}
		}
  };

	function asChar(val) {
		return String.fromCharCode(val);
	}

  arduino.digitalWrite = function(pin, state) {
		if(pin<=17) wsClient.send(asChar(START+DIGI_WRITE+((pin-2)<<1)+(state&1)));
		else console.log("Pin must be less than 17");
  };

  arduino.digitalRead = function(pin) {
    wsClient.send(asChar(START+DIGI_READ+(pin&31)));
  };

  arduino.analogWrite = function(pin, val) {
		if(val>=0&&val<256)
    	wsClient.send(asChar(START+ANA_WRITE+((pin&7)<<2)+(val>>7))+asChar(val&127));
  };

  arduino.watchPin = function(pin, handler) {
    //wsClient.send('r|watchPin(' + pin + ')');
    arduino.handlers[pin] = handler;
  };

  this.analogReport = function(pin, interval, handler) {
		interval/=2;
		if(interval<256){
			wsClient.send(asChar(START+ANA_READ+((pin&7)<<2)+REPORT_TIME+(interval>>7))+asChar(interval&127));
    	arduino.handlers[pin] = handler;
		}
		else console.log("interval must be less than 512");
  };

  arduino.setHandler = function(pin, handler) {
    arduino.handlers[pin] = handler;
  };

  arduino.analogRead = function(pin) {
    wsClient.send(asChar(START+ANA_READ+((pin&7)<<2)));
  };

  arduino.stopReport = function(pin) {
    wsClient.send(asChar(START+ANA_READ+((pin&7)<<2)+REPORT_TIME)+asChar(0));
  };

	this.createdCallback = function () {
    if(typeof $("$web-socket") === 'object')
			$("$web-socket").customCallback = this.onMessage.bind(this);
  }
});

document.registerElement('web-arduino', arduino);
