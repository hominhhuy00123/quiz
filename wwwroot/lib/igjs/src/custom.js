'use strict';

/**
 * Copy text in input tag to clipboard
 * @param {any} id ID input element
 */
function copyInputToClipboard(id) {
    let o = document.getElementById(id);

    o.select();
    o.setSelectionRange(0, 99999); // for mobile devices

    // Copy the text inside the text field
    document.execCommand('copy');
}

/**
 * Copy text to clipboard
 * @param {any} text Plain text
 */
function copyTextToClipboard(text) {
    let t = document.createElement('input');
    let o = document.body.appendChild(t);

    o.value = text;
    o.focus();

    o.select();
    o.setSelectionRange(0, 99999); // for mobile devices

    // Copy the text inside the text field
    document.execCommand('copy');

    o.parentNode.removeChild(o);
}

/**
 * Copy text in span tag to clipboard
 * @param {any} id Span tag ID
 */
function copySpanToClipboard(id) {
    let to = $(id).get(0); // Grab the node of the element
    let selection = window.getSelection(); // Get the Selection object
    let range = document.createRange(); // Create a new range
    range.selectNodeContents(to); // Select the content of the node from line 1
    selection.removeAllRanges(); // Delete any old ranges
    selection.addRange(range); // Add the range to selection
    document.execCommand('copy'); // Execute the command
}

/**
 * Valid email address
 * @param {any} email Email address
 */
function validEmail(email) {
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (!reg.test(email)) {
        return false;
    }

    return true;
}

/**
 * Valid phone number
 * @param {any} phone Phone number
 */
function validPhone(phone) {
    let reg = /^[\+]?[(]?[\+]?[0-9]{2,}[)]?[-\s\. 0-9]{6,16}$/im;

    if (!reg.test(phone)) {
        return false;
    }

    return reg.test(phone);
}

/**
 * Get initials name
 * @param {string} string
 */
function getInitials(string) {
    if (isEmpty(string)) {
        return false;
    }

    let names = string.split(' '), initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
};

/**
 * Array remove
 * @param {any} a Array
 * @param {any} v Value
 */
function arrayRemove(a, v) {
    return a.filter(function (i) {
        return i != v;
    });
}

/**
 * Create cookie
 * @param {any} n Name
 * @param {any} v Value
 * @param {any} m Number of minute
 */
function setCookie(n, v, m) {
    let expires = '';

    if (m) {
        let date = new Date();
        date.setTime(date.getTime() + (m * 60 * 1000));
        expires = '; expires=' + date.toGMTString();
    }

    document.cookie = n + '=' + v + expires + '; path=/;samesite=strict';
}

/**
 * Read cookie
 * @param {any} n Name
 */
function getCookie(n) {
    let key = n + '=';
    let ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];

        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(key) == 0) {
            let t = c.substring(key.length, c.length);
            return t == 'null' ? null : t;
        }
    }

    return null;
}

/**
 * Erase cookie
 * @param {any} n Name
 */
function delCookie(n) {
    setCookie(n, '', -1);
}

/**
 * Put the object into session storage
 * @param {any} k Key
 * @param {any} v Value
 */
function setStorageS(k, v) {
    let t = JSON.stringify(v);
    sessionStorage.setItem(k, t);
}

/**
 * Retrieve the object from session storage
 * @param {any} k Key
 */
function getStorageS(k) {
    let t = sessionStorage.getItem(k);
    if (isEmpty(t)) {
        return null;
    }
    return JSON.parse(t);
}

/**
 * Put the object into local storage
 * @param {any} k Key
 * @param {any} v Value
 */
function setStorageL(k, v) {
    let t = JSON.stringify(v);
    localStorage.setItem(k, t);
}

/**
 * Retrieve the object from local storage
 * @param {any} k Key
 */
function getStorageL(k) {
    let t = localStorage.getItem(k);
    if (isEmpty(t)) {
        return null;
    }
    return JSON.parse(t);
}

/**
 * Set authority
 * @param {any} o Authority object
 */
function setAuthority(o) {
    setStorageL('Authoritz', o);
}

/**
 * Get authority
 */
function getAuthority() {
    return getStorageL('Authoritz');
}

/**
 * Set right
 * @param {any} o Right object
 */
function setRight(o) {
    setStorageL('Righz', o);
}

/**
 * Get right
 */
function getRight() {
    return getStorageL('Righz');
}

/**
 * Set configuration
 * @param {any} o Authority object
 */
function setConfig(o) {
    setStorageL('Confiz', o);
}

/**
 * Get configuration
 */
function getConfig() {
    return getStorageL('Confiz');
}

/**
 * Add an item to a localStorage() object
 * @param {any} name  The localStorage() key
 * @param {any} key   The localStorage() value object key
 * @param {any} value The localStorage() value object value
 */
function addToLocalStorageObject(name, key, value) {
    // Get the existing data
    let existing = localStorage.getItem(name);

    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    existing = existing ? JSON.parse(existing) : {};

    // Add new data to localStorage Array
    existing[key] = value;

    // Save back to localStorage
    localStorage.setItem(name, JSON.stringify(existing));
}

/**
 * Add an item to a localStorage() array
 * @param {String} name  The localStorage() key
 * @param {String} value The localStorage() value
 */
function addToLocalStorageArray(name, value) {

    // Get the existing data
    let existing = localStorage.getItem(name);

    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    existing = existing ? existing.split(',') : [];

    // Add new data to localStorage Array
    existing.push(value);

    // Save back to localStorage
    localStorage.setItem(name, existing.toString());
};

/**
 * Set authorization token & user encrypted
 * @param {any} token Authorization token
 * @param {any} user User encrypted
 */
function setTokenUser(token, user) {
    let x = {
        token: token,
        user: user
    };
    setStorageS('TokenUser', x);
}

/**
 * Get authorization token & user encrypted
*/
function getTokenUser() {
    return getStorageS('TokenUser');
}

/**
 * Get seconds from now
 * @param {any} d1 Date time 1
 * @param {any} d2 Date time 2
 */
function getSecFrNow(d1, d2) {
    let t1 = new Date();
    let t2 = Date.parse(d2);

    if (d1 != null) {
        t1 = d1;
    }

    if (isNaN(t2)) {
        t2 = new Date();
    }

    let res = Math.abs(t1 - t2);
    res = Math.floor(res / 1000);

    return res;
}

/**
 * Format bytes
 * @param {any} bytes Bytes
 * @param {any} decimals Decimals
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
        return '0 Bytes';
    }

    let k = 1024;
    let dm = decimals < 0 ? 0 : decimals;
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Today
 * @param {any} time End with T and time format
 * @param {any} format Format is - or /, default -
 */
function today(time = false, format = '-') {
    let today = new Date();

    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
    let yy = today.getFullYear();

    let res = yy + format + mm + format + dd;
    if (time) {
        let ss = String(today.getSeconds()).padStart(2, '0');
        let pp = String(today.getMinutes()).padStart(2, '0');
        let hh = String(today.getHours()).padStart(2, '0');
        res += 'T' + hh + ':' + pp + ':' + ss;
    }
    return res;
}

/**
 * Parse JWT return payload
 * @param {any} token String token (format Header.Payload.Signature) or object with field 'accessToken'
 */
function parseJwt(token) {
    let res = null;

    if (typeof token == 'object' && token != null) {
        token = token.accessToken;
    }

    if (typeof token != 'string') {
        return res;
    }
    if (isEmpty(token)) {
        return res;
    }

    let arr = token.split('.');
    if (arr.length < 2) {
        return res;
    }

    let yyyyy = arr[1];
    let base64 = yyyyy.replace(/-/g, '+').replace(/_/g, '/');

    try {
        let x = atob(base64);
        let payload = decodeURIComponent(x.split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        res = JSON.parse(payload);
    } catch (e) { }

    return res;
}

/**
 * Expire JWT return true or false
 * @param {any} token String token (format Header.Payload.Signature) or object with field 'accessToken'
 */
function expireJwt(token) {
    let payload = parseJwt(token);
    let res = expirePayload(payload);
    return res;
}

/**
 * Expire Payload return true or false
 * @param {any} payload JWT payload
 */
function expirePayload(payload) {
    let res = true;

    if (payload != null) {
        if (typeof payload.exp != 'number') {
            return res;
        }

        let a = payload.exp * 1000;
        let b = Date.now();
        res = b >= a;
    }

    return res;
}

/**
 * RSA encrypt
 * @param {any} s Plain text
 */
function rsaEncrypt(s) {
    let o = getConfig();
    let key = o.rsaPublicKey;

    if (!o.rsaMode) {
        return s;
    }

    if (key == '') {
        return s;
    }

    let jse = new JSEncrypt();
    jse.setPublicKey(key);
    return jse.encrypt(s);
}

/**
 * Detect browser https://medium.com/creative-technology-concepts-code/detect-device-browser-and-version-using-javascript-8b511906745
 */
function detectBrowser() {
    let module = {
        options: [],
        header: [
            navigator.platform,
            navigator.userAgent,
            navigator.appVersion,
            navigator.vendor,
            window.opera],
        dataos: [
            { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
            { name: 'Windows', value: 'Win', version: 'NT' },
            { name: 'iPhone', value: 'iPhone', version: 'OS' },
            { name: 'iPad', value: 'iPad', version: 'OS' },
            { name: 'Kindle', value: 'Silk', version: 'Silk' },
            { name: 'Android', value: 'Android', version: 'Android' },
            { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
            { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
            { name: 'Macintosh', value: 'Mac', version: 'OS X' },
            { name: 'Linux', value: 'Linux', version: 'rv' },
            { name: 'Palm', value: 'Palm', version: 'PalmOS' }
        ],
        databrowser: [
            { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
            { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
            { name: 'Safari', value: 'Safari', version: 'Version' },
            { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
            { name: 'Opera', value: 'Opera', version: 'Opera' },
            { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
            { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
        ],
        init: function () {
            let agent = this.header.join(' '),
                os = this.matchItem(agent, this.dataos),
                browser = this.matchItem(agent, this.databrowser);

            return { os: os, browser: browser };
        },
        matchItem: function (string, data) {
            let i = 0,
                j = 0,
                regex,
                regexv,
                match,
                matches,
                version;

            for (i = 0; i < data.length; i += 1) {
                regex = new RegExp(data[i].value, 'i');
                match = regex.test(string);
                if (match) {
                    regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
                    matches = string.match(regexv);
                    version = '';
                    if (matches) { if (matches[1]) { matches = matches[1]; } }
                    if (matches) {
                        matches = matches.split(/[._]+/);
                        for (j = 0; j < matches.length; j += 1) {
                            if (j === 0) {
                                version += matches[j] + '.';
                            } else {
                                version += matches[j];
                            }
                        }
                    } else {
                        version = '0';
                    }
                    return {
                        name: data[i].name,
                        version: parseFloat(version)
                    };
                }
            }
            return { name: 'unknown', version: 0 };
        }
    };

    let e = module.init();
    let res = {
        osName: e.os.name,
        osVersion: e.os.version,
        browserName: e.browser.name,
        browserVersion: e.browser.version,
        userAgent: navigator.userAgent,
        appVersion: navigator.appVersion,
        platform: navigator.platform,
        vendor: navigator.vendor
    };

    return res;
}

/**
 * Show spinner with ID container
 * @param {any} id Just put Id, no need #
 * @param {any} show True: show, False: hide
 */
function spinnezId(id, show) {
    let display = show ? 'block' : 'none';
    let sid = id + 'Spinnez';

    let htm = `
        <div id='`+ sid + `' class='preloaderPage' style='display: ` + display + `;'>
            <div class='d-flex align-items-center w-100 h-100'>
                <div class='spinner-border m-auto' role='status'>
                    <span class='sr-only'>Loading...</span>
                </div>
            </div>
        </div>`;

    // Show hide
    let t = $('#' + sid);
    if (show) {
        if (t.length == 0) {
            $('#' + id).append(htm);
        }
        else {
            t.show();
        }
    }
    else {
        if (t.length > 0) {
            t.hide();
        }
    }
}

/**
 * Show spinner with URL
 * @param {any} url URL with spinner ID container
 * @param {any} show True: show, False: hide
 */
function spinnezUrl(url, show) {
    let t = new URLSearchParams(url);
    let id = t.get('spinnez');

    // Show spinner
    if (id != null) {
        spinnezId(id, show);
    }
}

/**
 * Format number
 * @param {any} num Number
 */
function formatNum(num) {
    if (isEmpty(num)) {
        return '';
    }

    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Find the center coordinate of rectangle
 * @param {any} rect Rectangular coordinate
 * @param {any} offsetX Offset X
 * @param {any} offsetY Offset Y
 */
function findCenterRect(rect, offsetX, offsetY) {
    if (rect.length < 4) {
        return [0, 0];
    }

    let a = rect[0];
    let b = rect[1];
    //let c = rect[2];
    let d = rect[3];

    let l = Math.abs(a[1] - b[1]);
    let w = Math.abs(a[0] - d[0]);

    let l2 = l / 2;
    let w2 = w / 2;

    let res = [a[0] - w2 + offsetY, a[1] + l2 - offsetX];
    return res;
}

/**
 * Reload table
 * @param {any} action Array action
 * @param {any} path Current path
 */
function reloadTablz(action, path) {
    if (!Array.isArray(action) || !path) {
        return;
    }

    let t = path.replace('/', '');
    let ok = action.includes(t);

    if (typeof reloadTable == 'function' && ok) {
        reloadTable();
    }
}

/**
 * Check access rights
 * @param {any} r Access rights
 * @param {any} n Object's name
 */
function checkAr(r, n) {
    let res = {
        'none': false,
        'read': false,
        'create': false,
        'edit': false,
        'delete': false,
        'viewAll': false,
        'modifyAll': false
    };

    let t = r.filter((p) => p.name == n);
    if (t.length > 0) {
        res = t[0];
    }

    return res;
}

/**
 * Set event create
 * @param {any} e Event
 */
function eventCreate(e) {
    e.preventDefault();

    let jq = $(this);
    let ar = jq.data('ar');
    let parent = jq.data('parent');
    if (isEmpty(parent)) {
        parent = '';
    }
    else {
        parent = '?parent=' + parent;
    }
    let prefix = jq.data('prefix');
    if (isNull(prefix)) {
        prefix = '';
    }
    let url = '/../' + ar + '/' + prefix + 'Create' + parent;

    ar.checkPermission(url, 'create');
}

/**
 * Set event view
 * @param {any} e Event
 */
function eventView(e) {
    e.preventDefault();

    let jq = $(this);
    let ar = jq.data('ar');
    let id = jq.data('id');
    let prefix = jq.data('prefix');
    if (isNull(prefix)) {
        prefix = '';
    }
    let url = '/../' + ar + '/' + prefix + 'Details/' + id;

    ar.checkPermission(url, 'read');
}

/**
 * Set event update
 * @param {any} e Event
 */
function eventUpdate(e) {
    e.preventDefault();

    let jq = $(this);
    let ar = jq.data('ar');
    let id = jq.data('id');
    let prefix = jq.data('prefix');
    if (isNull(prefix)) {
        prefix = '';
    }
    let url = '/../' + ar + '/' + prefix + 'Update/' + id;

    ar.checkPermission(url, 'update');
}

/**
 * Set event delete
 * @param {any} e Event
 */
function eventDelete(e) {
    e.preventDefault();

    let jq = $(this);
    let ar = jq.data('ar');
    let id = jq.data('id');
    let prefix = jq.data('prefix');
    if (isNull(prefix)) {
        prefix = '';
    }
    let url = prefix + ar.getApiUrl();

    let ok = ar.checkPermission(null, 'delete');
    if (!ok) {
        return;
    }

    swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({
                type: 'GET',
                async: false,
                url: url + 'Delete/' + id,
                success: function (rsp) {
                    swal(rsp.title, '', rsp.icon);

                    if (rsp.success) {
                        reloadTable();
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    });
}

/**
 * Set event delete with token
 * @param {any} e Event
 */
function eventDeleteAuth(e) {
    e.preventDefault();

    let jq = $(this);
    let ar = jq.data('ar');
    let id = jq.data('id');
    let url = ar.getApiSite(_siteApiUrl);

    let ok = ar.checkPermission(null, 'delete');
    if (!ok) {
        return;
    }

    let tu = getTokenUser();

    swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({
                type: 'GET',
                headers: {
                    'Auth': tu.token,
                    'User': tu.user
                },
                async: false,
                url: url + 'Delete/' + id,
                success: function (rsp) {
                    swal(rsp.title, '', rsp.icon);

                    if (rsp.success) {
                        reloadTable();
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    });
}

/**
 * Create UUID https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
 */
function createUid() {
    let dt = new Date().getTime();

    let res = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return res;
}

/**
 * Checking if a string is empty, null or undefined
 * @param {any} s Input string
 */
function isEmpty(s) {
    let a = s == undefined || s == null;
    return (a || 0 === s.length);
}

/**
 * Checking if a string is null or undefined
 * @param {any} s Input string
 */
function isNull(s) {
    let res = s === undefined || s === null;
    return res;
}

/**
 * Concatenates the members of a collection, using the specified separator between each member
 * @param {any} a A collection that contains the objects to concatenate
 * @param {any} c Separator (default is semicolon)
 */
function zoin(a, c = ';') {
    let res = '';

    if (Array.isArray(a)) {
        res = c + a.join(c) + c;
    }

    return res;
}

/**
 * Show error message
*/
function showErrorMessage() {
    $('.display-z').show();
}

/**
 * Hide error message
*/
function hideErrorMessage() {
    $('.display-z').hide();
}

/**
 * Render checked
 * @param {any} v Value
 */
function renderChecked(v) {
    return v ? '<i class="far fa-check-square"></i>' : '<i class="far fa-square"></i>';
}

/**
 * Support check failed using for AJAX
 * @param {any} self This is VueJS app
 * @param {any} rsp AJAX failed response
 */
function checkFailed(self, rsp) {
    if (isNull(rsp)) {
        return;
    }

    if (isNull(self)) {
        let msg = '';
        if (rsp.status == 0) {
            msg = EM994 + ' (API)';
        }
        else if (rsp.status == 401) {
            msg = EM996;

            if (!isNull(rsp.responseJSON)) {
                msg = rsp.responseJSON.message;
            }
        }
        else {
            if (!isNull(rsp.responseJSON) && rsp.responseJSON.length > 0) {
                msg = rsp.responseJSON[0].message;
            }
        }

        return msg;
    }

    if (isNull(self.valid)) {
        alert('Wrong template self.valid');
        return;
    }
    if (isNull(self.err)) {
        alert('Wrong template self.err');
        return;
    }

    self.valid.processing = false;
    self.valid.error = true;

    if (rsp.status == 0) {
        let msg = EM994 + ' (API)';
        self.showErrorMessage(msg);
        return;
    }

    if (rsp.status == 401) {
        let msg = EM996;
        if (!isNull(rsp.responseJSON)) {
            msg = rsp.responseJSON.message;
        }

        self.showErrorMessage(msg);
        return;
    }

    if (isNull(rsp.responseJSON)) {
        return;
    }

    if (rsp.responseJSON.length > 0) {
        let msg = rsp.responseJSON[0].message;
        self.showErrorMessage(msg);
        return;
    }

    let e = rsp.responseJSON.errors;
    if (isNull(e)) {
        return;
    }

    let msg = '';
    for (let [key, value] of Object.entries(e)) {
        if (isNull(key)) {
            continue;
        }

        if ((value != undefined && value.length > 0)) {
            key = key.toCamelcase();
            self.valid[key] = false;
            let t = value[0];
            self.err[key] = t;

            if (!isEmpty(t)) {
                msg += t + ', ';
            }
        }
    }

    // Remove last colon
    if (!isEmpty(msg)) {
        msg = msg.trim()
        msg = msg.slice(0, -1)
    }

    return {
        valid: self.valid,
        err: self.err,
        msg: msg
    };
}

/**
 * Get error message
 * @param {any} val Value need to check
 * @param {any} tit Title of message
 * @param {any} max Maximum length
 * @param {any} valid true: validate email, false: validate phone, null: validate text only
 * @param {any} min Minimum length
 */
function getErrorMessage(val, tit, max = 0, valid = null, min = 1) {
    let res = '';

    let empty = isEmpty(val);
    if (empty) {
        res = tit + ' is required';
    }
    else {
        if (valid == true) {
            let ok = validEmail(val);
            if (!ok) {
                res = 'Invalid email';
            }
        }
        if (valid == false) {
            let ok = validPhone(val);
            if (!ok) {
                res = 'Invalid phone';
            }
        }

        if (isEmpty(res) && max > 0) {
            let len = val.length;
            let ok = len < min || max < len;
            if (ok) {
                res = tit + ' must be a string with a minimum length of ' + min + ' and a maximum length of ' + max + '.';
            }
        }
    }

    return res;
}

/**
 * Is valid date
 * @param {any} d Input date
 */
function isValidDate(d) {
    return d != null && !isNaN(d.getTime());
}

/**
 * To local time with format yyyy-MM-dd HH:mm
 * @param {any} sd Input string date
 */
function toLocal(sd) {
    if (isEmpty(sd)) {
        return '';
    }

    let d = new Date(sd);
    let local = toLocalTime(d);

    if (local == null) {
        return '';
    }

    let res = formatYmdHm(local);
    return res;
}

/**
 * To UTC time with ISO format
 * @param {any} sd
 */
function toUtc(sd) {
    if (isEmpty(sd)) {
        return '';
    }

    let d = new Date(sd);
    let res = d.toISOString();
    return res;
}

/**
 * Format yyyy-MM-dd HH:mm
 * @param {any} d Input date
 * @param {any} sep Date separate
 */
function formatYmdHm(d, sep = '-') {
    if (!isValidDate(d)) {
        return null;
    }

    if (isEmpty(sep)) {
        sep = '';
    }

    let year = padZero(d.getFullYear());
    let month = padZero(d.getMonth() + 1);
    let date = padZero(d.getDate());
    let hour = padZero(d.getHours());
    let minute = padZero(d.getMinutes());

    let ymd = [year, month, date].join(sep);
    let hm = [hour, minute].join(':');

    let res = ymd + ' ' + hm;
    return res;
}

/**
 * Format dd-MMM-yyyy
 * @param {any} d Input date
 * @param {any} f True: full name else short name
 * @param {any} sep Date separate
 */
function formatDmy(d, f, sep = '-') {
    if (!isValidDate(d)) {
        return null;
    }

    if (isEmpty(sep)) {
        sep = '';
    }

    let year = padZero(d.getFullYear());
    let month = getMonthName(d, f);
    let date = padZero(d.getDate());

    let res = [date, month, year].join(sep);
    return res;
}

/**
 * Pad start zero
 * @param {any} v Value
 * @param {any} l Max length
 */
function padZero(v, l = 2) {
    let t = v + '';
    let res = t.padStart(l, '0');
    return res;
}

/**
 * Convert local to UTC time
 * @param {any} d Input date
 */
function toUtcTime(d) {
    if (!isValidDate(d)) {
        return null;
    }

    return new Date(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
        d.getUTCHours(),
        d.getUTCMinutes(),
        d.getUTCSeconds(),
        d.getUTCMilliseconds()
    );
}

/**
 * Convert UTC to local time
 * @param {any} d Input date
 */
function toLocalTime(d) {
    if (!isValidDate(d)) {
        return null;
    }

    return new Date(Date.UTC(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
        d.getMilliseconds()
    ));
}

/**
 * Get timezone offset (minute)
 */
function getTimezone() {
    let now = new Date();
    return now.getTimezoneOffset();
}

/**
 * Get month name
 * @param {any} d Input date
 * @param {any} f True: full name else short name
 */
function getMonthName(d, f) {
    if (!isValidDate(d)) {
        return '';
    }

    let names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let m = d.getMonth();
    let res = names[m];

    if (!f) {
        res = res.substring(0, 3);
    }

    return res;
}

/**
 * Check image exists
 * @param {any} uri URI
 * @param {any} callback Callback
 * @param {any} host Host
 */
function checkImage(uri, callback, host = null) {
    if (isEmpty(host)) {
        let l = window.location;
        host = l.protocol + '//' + l.host;
    }
    uri = host + uri;

    let http = new XMLHttpRequest();
    http.open('HEAD', uri);
    http.send();

    http.onload = function () {
        let res = false;
        if (http.status == 200) {
            res = true;
        }
        callback(res);
    }
}

/**
 * Build query
 * @param {any} filter Input filter
 * @param {any} question Question mark
 */
function buildQuery(filter, question = true) {
    let res = '';

    for (let key in filter) {
        if (res === '') {
            res += question ? '?' : '&';
        }
        else {
            res += '&';
        }

        res += key + '=' + encodeURIComponent(filter[key]);
    }

    return res;
};

/**
 * Toast
 * @param {any} id Toast ID | Default: auto generate
 * @param {any} content Content
 * @param {any} type Toast type: success, warning, danger | Default: information
 * @param {any} dispose True: remove on the DOM | Default: true
 * @param {any} hide True: auto hide remain on the DOM | Default: true
 * @param {number} delay Time for hide or remove | set null for default: 3000
 */
function toastCreate(id, content, type, dispose = true, hide = true, delay = null) {
    let title = '', color = '', icon = '', role = '', aria = '';
    let timeDelay = isEmpty(delay) ? 3000 : delay;

    switch (type) {
        case 'success':
            title = 'Success', color = 'success', icon = 'fas fa-check-circle', role = 'status', aria = 'polite';
            break;

        case 'warning':
            title = 'Warning', color = 'warning', icon = 'fas fa-exclamation-triangle', role = 'alert', aria = 'assertive';
            break;

        case 'danger':
            title = 'Error', color = 'danger', icon = 'fas fa-exclamation-circle', role = 'alert', aria = 'assertive';
            break;

        default:
            title = 'Information', color = 'primary', icon = 'fas fa-info-circle', role = 'status', aria = 'polite';
    }

    if (isEmpty(id)) {
        id = 'toast' + (new Date()).getTime();
    }

    let mess = toastItem(id, content, title, color, icon, role, aria, hide, timeDelay);
    toastWrapping(mess); toastShow(id);

    if (dispose) {
        setTimeout(function () {
            $(document).find('[data-id="' + id + '"]').slideUp(600, function () {
                $(this).remove();
            });
        }, timeDelay);
    }
}

/**
 * Toast wrapping
 * @param {any} ti Toast item
 */
function toastWrapping(ti) {
    let html = `<div id="toastWrapping" class="position-fixed bottom-0 right-0 p-3" style="z-index: 9999; right: 0; bottom: 0; color:black">` + ti + `</div>`;

    if ($('#toastWrapping').length) {
        $('#toastWrapping').append(ti);
    } else {
        $('body').append(html);
    }
}

/**
 * Toast item
 * @param {any} id ID
 * @param {any} content Content
 * @param {any} title Title
 * @param {any} color Color
 * @param {any} icon Icon
 * @param {any} role Role
 * @param {any} aria Aria
 * @param {any} hide Hide
 * @param {any} delay Delay
 */
function toastItem(id, content, title, color, icon, role, aria, hide, delay) {
    let res = `
        <div data-id="`+ id + `" class="toast p-3 border-left-` + color + `" role="` + role + `" aria-live="` + aria + `" aria-atomic="true" data-autohide="` + hide + `" data-delay="` + delay + `" >
            <div class="d-flex align-items-center">
                  <div class="h4 text-`+ color + ` mb-0 mr-3"><i class="` + icon + `"></i></div>
                  <div><strong class="mr-auto text-dark">`+ title + `</strong><div>` + content + `</div></div>
                  <div class="ml-auto"><button type="button" class="ml-4 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true"><i class="fal fa-times"></i></span>
                  </button></div>
            </div>
        </div>
        `;
    return res;
}

/**
 * Toast show
 * @param {any} id ID
 */
function toastShow(id) {
    $('.toast[data-id="' + id + '"]').toast('show');
}

/**
 * Comfirm modal
 * @param {any} title title
 * @param {any} message message
 */
function confirmModal(title, message) {
    let htm = `
    <div class="modal fade" id="ConfirmModalId" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-body p-0 text-center">
                    <div class="border-bottom p-4">
                       <div class="h3"><i class="far fa-trash-alt"></i></div>
                       <div class="h5 text-red">`+ title + `</div>
                    </div>
                    <div class="px-4">
                        <p class="mt-3">`+ message + `</p>
                        <div class="d-flex justify-content-center py-4">
                            <button class="btn btn-secondary mx-2" type="button" data-dismiss="modal" aria-label="Close">No</button>
                            <button id="ConfirmModalYes" class="btn btn-red  mx-2" type="button" data-dismiss="modal" aria-label="Close">Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    $('body').append(htm);
    $('#ConfirmModalId').modal('show');

    $('#ConfirmModalId').on('hidden.bs.modal', function () {
        $(this).remove();
    });
}

/**
 * Download file by path and file name
 * @param {any} apiPrefix API prefix
 * @param {any} objectName Object name (include full path and file extension)
 * @param {any} fileName File name to save
 * @param {any} bucketName Bucket name
 */
function downloadFile(apiPrefix, objectName, fileName, bucketName) {
    let t = `${apiPrefix}/UserFile/Download?objectName=${objectName}&fileName=${fileName}`;

    if (!isEmpty(bucketName)) {
        t += `&bucketName=${bucketName}`;
    }

    window.location.href = t;
}

/**
 * View file by path and file name
 * @param {any} apiPrefix API prefix
 * @param {any} objectName Object name (include full path and file extension)
 * @param {any} bucketName Bucket name
 */
function viewFile(apiPrefix, objectName, bucketName, siteDevName) {
    let t = `${apiPrefix}/UserFile/View?objectName=${objectName}`;

    if (!isEmpty(bucketName)) {
        t += `&bucketName=${bucketName}`;
    }

    window.open(t, '_blank');
}

/**
 * Check browser is Safari
 */
function isSafari() {
    let ag = navigator.userAgent;
    let res = ag.indexOf("Safari") > -1;
    let isChrome = ag.indexOf('Chrome') > -1;

    if (isChrome && res) {
        res = false;
    }

    return res;
}