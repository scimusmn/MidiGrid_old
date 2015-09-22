include(['src/move.min.js'], function() {
  console.log('here');
  var aniFrame = inheritFrom(HTMLElement, function() {
    this.run = function() {
      var _this = this;
      var childActs = [].slice.call(_this.querySelectorAll('ani-frame'));
      childActs.forEach(function(item, i, arr) {
        item.run();
      });
    };

    this.createdCallback = function() {
      var _this = this;
      var imgs = this.querySelectorAll('img');
      for (var i = 0; i < imgs.length; i++) {
        imgs[i].src = 'src/' + imgs[i].id + '.png';
      }
    };
  });

  document.registerElement('ani-frame', aniFrame);

  var aniMation = inheritFrom(HTMLElement, function() {
    this.main = null;

    this.start = function() {
      var childActs = [].slice.call(_this.querySelectorAll('ani-frame'));
      childActs.forEach(function(item, i, arr) {
        item.run();
      });
    };

    this.stop = function() {

    };

    var scaleTo = function(dep,scale) {
      this.height = dep.naturalHeight * .03;
    };

    this.createdCallback = function() {
      var _this = this;
      var imgs = this.querySelectorAll('img');

      var count = 0;
      function loaded() {
        if (++count >= imgs.length) {
          var scale =  _this.main.naturalHeight / _this.main.height;
          for (var j = 0; j < imgs.length; j++) {
            if (imgs[j] !== _this.main) scaleTo(imgs[j], scale);
          }
        }
      }

      for (var i = 0; i < imgs.length; i++) {
        console.log(imgs[i].id);
        imgs[i].src = 'img/' + imgs[i].id + '.png';
        imgs[i].onload = function() {
          this.left = this.getAttribute('x');
          this.top = this.getAttribute('y');
          if (this.className == 'main')  _this.main = this;

          loaded();
        };
      }
    };
  });

  document.registerElement('ani-mation', aniMation);
});
