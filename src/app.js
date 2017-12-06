'use strict';

obtain(['./src/gridControl.js'], ({ Grid })=> {
  exports.app = {};

  let grid = new Grid();

  var clips = [];
  clips[2] = new Audio('audio/a3.mp3');
  clips[1] = new Audio('audio/b3.mp3');
  clips[0] = new Audio('audio/c4.mp3');

  var cells = [];

  var reqTimer = null;
  var pulseTimer = null;
  var pulseCount = 0;
  var colRead = 0;

  exports.app.start = ()=> {
    grid.setup();

    grid.onUpdateCount = ()=> {
      console.log('Updated column count');
      for (var i = 0; i < grid.states.length; i++) {
        var col = µ('+div', µ('#grid'));
        col.className = 'col';
        col.style.width = 'calc(90vw / ' + grid.states.length + ' )';
        cells[i] = [];
        for (var j = 0; j < clips.length; j++) {
          cells[i][j] = µ('+div', col);
          cells[i][j].clip = clips[j].cloneNode(true);

        }
      }
    };

    grid.onReady = ()=> {
      setInterval(grid.setNextActive, 500);
    };

    grid.onNextActive = (data, which)=> {
      data.forEach(function (value, ind, arr) {
        if (!value) {
          console.log('strike!');
          cells[which][ind].clip.currentTime = 0;
          cells[which][ind].clip.play();
        }
      });
    };

    grid.onCellChange = (col, row, val)=> {
      cells[col][row].classList.toggle('occ', val);
    };

    console.log('started');
  };

  //provide(exports);
});
