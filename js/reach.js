const reach = function ({
  from,
  to,
  restDelta = 0.01
}) {
  let current = Object.assign({}, from);
  let keys = Object.keys(from);

  let raf = {
    current: null
  };

  let _update = function (update, complete) {
    if (keys.length === 0) {
      cancelAnimationFrame(raf.current);
      raf.current = null;

      complete(current);
      return;
    }

    let cacheKeys = keys.slice();
    for (var i = keys.length, val, key; i >= 0; i--) {
      key = keys[i];
      val = current[key] + (to[key] - current[key]) * 0.1;
      if (Math.abs(to[key] - val) < restDelta) {
        current[key] = to[key];
        // Remove key
        keys.splice(i, 1);
        // Move i down by pne
        i--;
      } else {
        current[key] = val;
      }
    }

    update(current);
    raf.current = requestAnimationFrame(_update);
  };
  return {
    start: function ({
      update,
      complete
    }) {
      _update = _update.bind(null, update, complete);
      raf.current = requestAnimationFrame(_update);
      return {
        stop: function () {
          cancelAnimationFrame(raf.current);
          raf.current = null;
        }
      };
    }
  };
};

export {
  reach
};