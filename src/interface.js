include(['src/pointTrace.js','src/compCont.js','src/arduinoControl.js','src/flipBook.js'], function() {
  function app() {};

  var drawTimer;
  var refreshRate = 30; //fps

  var cool = new pointTrace($('cool'));
  var warm = new pointTrace($('warm'));

  var coolCont = compCont($('coolCont'));
  var warmCont = compCont($('warmCont'));

  //var botTray = bottomTray($('dualInst'));

  coolCont.bind(warmCont, cool, warm);

  setMoves(coolCont);
  setMoves(warmCont);

  $('attract').setup();

  $('cool').refresh();
  $('warm').refresh();

  document.onmousedown = function(e) {
    e.preventDefault();
    $('#attract').refreshTimer();
  }

  coolCont.onmousedown = function(e) {
    e.preventDefault();
    if (!this.hasFocus && !this.lockout) warmCont.focus();
  };

  $('$web-arduino').watchPin(18, function(val) {
    console.log('clear');
    cool.clear();
    warm.clear();
  });

  warmCont.onmousedown = function(e) {
    e.preventDefault();
    if (!this.hasFocus && !this.lockout) this.focus();
  };

  $('#reset').onmousedown = $('#attract').reset;

  document.onkeydown = function(e) {
    switch (e.which) {
      case charCode('E'):        //if the send button was pressed
        $('#coolEff').innerHTML = cool.efficiency();
        $('#warmEff').innerHTML = warm.efficiency();
        break;
      case 32:
        cool.clear();
        warm.clear();
        warmTemp.clear();
        break;
      default:
        break;
    }
  };

  app.draw = function() {
    //console.log('draw');
    cool.draw();
    warm.draw();
  };

  window.onresize = function(x,y) {
    $('cool').refresh();
    $('warm').refresh();
  };

  window.onresize();

  drawTimer = setInterval(app.draw, 1000 / refreshRate);
});
