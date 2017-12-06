
obtain(['µ/serial.js'], (ser)=> {

  exports.Grid = function () {
    var _this = this;
    var serial = new ser.Serial(Buffer.from([128]));

    var COMMAND = 128;
    var SEND_COUNT = 64;
    var GET_STATES = 16;
    var SET_COLOR = 32;
    var SET_DEFAULT_COLOR = 96;
    var SET_COLUMN_ACTIVE = 96;
    var RESET_COLUMN = 32;
    var END_FLAG = 0;
    var COMPLETE = 1;
    var SET_ACTIVE = 4;
    var RESET_COLOR = 2;

    _this.states = [];
    numBoards = 0;
    var countRequested = true;
    var writingActive = -1;
    var writingReset = -1;
    var activeTimer = 0;
    var resetTimer = 0;
    var active = 0;

    _this.onUpdateCount = ()=> {
      console.log(`There are ${numBoards} boards`);
    };

    serial.onMessage = (data)=> {
      for (let i = 0; i < data.length; i++) {
        let cur = data[i];

        //console.log(cur);
        switch (cur & 0b11100000){
          case (COMMAND + SEND_COUNT): {
            if (countRequested) {
              countRequested = false;
              let nex = data[++i] & 127;
              numBoards = nex;
              for (let j = 0; j < numBoards; j++) {
                _this.states[j] = [];
              }

              _this.onUpdateCount();
            }
          }

            break;
          case (COMMAND + SET_COLUMN_ACTIVE): {
            if (writingActive - 1 == (cur & 31)) {
              _this.active = writingActive;
              active = writingActive;
              writingActive = 0;
              clearTimeout(activeTimer);
            }
          }

            break;
          case (COMMAND + RESET_COLUMN): {
            if (writingReset - 1  == (cur & 31)) {
              _this.active = 0;
              active = 0;
              writingReset = 0;
              clearTimeout(resetTimer);
            }
          }

            break;
          case (COMMAND):
            if (cur & GET_STATES) {
              let which = cur & 15;
              if (1) {
                let states = 0;
                let numCells = 0;
                numCells = data[++i];
                console.log(`There are ${numCells} cells`);
                if (numCells && numBoards) {
                  for (let j = 0; j  < (numCells / 7); j++) {
                    states = data[++i];
                    for (let k = 0; k < (numCells % 7); k++) {
                      let newRead = (states & Math.pow(2, k));
                      if (_this.states[which][k] != newRead) {
                        _this.states[which][k] = newRead;
                        _this.onCellChange(which, k, newRead);
                      }

                    }
                  }
                }
              }
            }

            break;
          default:
            break;
        }
      }
    };

    _this.onReady = ()=> {};

    _this.onCellChange = (col, row, val)=> {
      console.log(`row ${row}, column ${col} changed`);
    };

    serial.onOpen = () => {
      console.log('Started serial');

      serial.send([COMMAND + SEND_COUNT, 0, COMMAND + END_FLAG]);

      _this.onReady();
    };

    let requestInterval = null;

    let resetActive = (which)=> {
      if (which >= 0) {
        writingReset = which + 1;

        //resetTimer = setTimeout(()=> {resetActive(which);}, 50);
        serial.send([COMMAND + RESET_COLUMN + ((which) & 31), COMMAND + END_FLAG]);
      }

    };

    let setActive = (which)=> {
      writingActive = which + 1;

      //activeTimer = setTimeout(()=> {setActive(which);}, 50);
      serial.send([COMMAND + SET_COLUMN_ACTIVE + ((which) & 31), COMMAND + END_FLAG]);
    };

    _this.onNextActive = ()=> {};

    _this.setNextActive = ()=> {
      let oldActive = active - 1;
      resetActive(oldActive);
      setActive((oldActive + 1) % numBoards);
      _this.onNextActive(_this.states[(oldActive + 1) % numBoards], (oldActive + 1) % numBoards);
    };

    _this.setup = ()=> {
      serial.open({manufacturer: 'FTDI', baud: 9600});
    };

  };
});
