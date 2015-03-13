var _qs_url, _qs, _kv;

QueryString = function(key) {
    return window.location.toString().QueryString(key);
};

String.prototype.QueryString = function(key) {
    _qs_url = this.toString().toLowerCase();
    if (_qs_url.lastIndexOf('?') >= 0) {
        _qs = _qs_url.substring(_qs_url.lastIndexOf('?') + 1).split('&');
        for (var i = 0; i < _qs.length; i++) {
            _kv = _qs[i].split('=');
            if (_kv[0] == key.toLowerCase()) {
                return _kv[1];
            }
        }
    } else {
        return undefined;
    }
};


QueryStringCount = function() {
    return window.location.toString().QueryStringCount();
};

String.prototype.QueryStringCount = function() {
    _qs_url = this.toString();
    var items = [];
    if (_qs_url.lastIndexOf('?') >= 0) {
        _qs = _qs_url.substring(_qs_url.lastIndexOf('?') + 1).split('&');
        if (_qs === "") {
            return 0;
        } else {
            return _qs.length;
        }
    } else {
        return 0;
    }
};