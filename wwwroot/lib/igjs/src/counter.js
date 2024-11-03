'use strict';

var chSignalR = null;
var chClientId = null;
var chSessionId = null;
var chTabActive = true;
var chActionTabs = new Array();

var chKeyActionTab = 'ActionTab';
var chKeyClientId = 'ClientId';
var chKeySessionId = 'SessionId';
var chKeyTabId = 'TabId';

var chSessionCookie = 1; // minute
var chCountdown = chSessionCookie * 60; // second
var chZLogUi = false;
var chTimer;

var chCounter = 0;
var chMouseX = 0;
var chMouseY = 0;

var chScreenSize = new Array();
var chMouseInfos = new Array();

setStorageS(chKeyActionTab, null); // clear storage

$(function () {
    // 1. Get config & start signalR
    $.ajax({
        method: 'GET',
        url: prefixApi.authorize + 'GetConfig',
    }).done((rsp) => {
        if (rsp.success) {
            let d = rsp.data;
            setConfig(d);

            chKeyActionTab = d.keyActionTab;
            chKeyClientId = d.keyClientId;
            chKeySessionId = d.keySessionId;
            chKeyTabId = d.keyTabId;
            chSessionCookie = d.sessionCookie;
            chZLogUi = d.zLogUi;

            // Start counter online
            chSignalR = new signalR.HubConnectionBuilder().withUrl(d.basePath + '/CounterHub').build();
            chSignalR.on('ReceiveMessage', function (user, message) {
                console.log(user + ': ' + message + '\n');
            });
            chSignalR.on('DoItNow', function (id, method, data) {
                console.log(id + ': ' + method + ', data:' + data + '\n');
                $(id).val(data);

                if (method == 'click') {
                    $(id).click();
                }
                if (method == 'keypress') {
                    $(id).keypress();
                }
            });
            chSignalR.start().then(function () {
                console.log('Starting counter online...');
            }).catch(function (err) {
                return console.error(err.toString());
            });

            // Show log information on UI
            let url = new URL(window.location.href);
            chZLogUi = url.searchParams.get('zlog') == '' || chZLogUi;
            if (chZLogUi) {
                $('#zlog').show();
            }

            setCookie("TabId", createUid());
            setTimeout(function () {
                insertLog(window.location.pathname);
            }, 2000); // delay 2 seconds
        }
        else {
            console.log(rsp.message);
        }
    });

    // 2. Detect user is active or idle
    let idleState = false;
    let idleTimer = null;
    // https://arjunphp.com/detect-user-is-active-or-idle-on-web-page-using-jquery
    $('*').bind('mousemove click mouseup mousedown keydown keypress keyup submit change mouseenter scroll resize dblclick', function () {
        if (idleState == true) {
            chTabActive = true;
        }
        idleState = false;

        clearTimeout(idleTimer);
        idleTimer = setTimeout(function () {
            chTabActive = false;
            idleState = true;
        }, 2000); // delay 2 seconds
    });
    $('body').trigger('mousemove');

    // 3. Track mouse position
    document.onmousemove = handleMouseMove;

    // 4. Tab closed
    window.onbeforeunload = function () {
        invokeHub('CloseTab');
    };

    // 5. Tab activated
    window.onfocus = function () {
        chTabActive = true;
        setActionTab(chTabActive);
    };

    // 6. Tab inactivated
    window.onblur = function () {
        chTabActive = false;
        setActionTab(chTabActive);
    };

    // 7. Update action tab
    clearInterval(chTimer);
    chTimer = setInterval(function () {
        updateActionTab(chTabActive);

        if (chCounter % 10 == 0) { // run every 10 seconds
            chCounter = 0;
            invokeHub('UpdateTab');
        }
        chCounter++;

        chCountdown--;
        if (chCountdown <= 0) {
            clearInterval(chTimer);
        }

        showLog();
    }, 1000); // run every 1 second

    showLog();
});

/**
 * Show log
 */
function showLog() {
    let xx = chTabActive ? 'active' : 'inactive';
    let path = window.location.pathname;
    let pad = '-------------------------- > ';
    let htm = pad + 'Path [' + path + '] is <b>' + xx.toUpperCase() + '</b>';

    let at = chActionTabs.find(p => p.path === path);
    if (at != undefined) {
        htm += '<br/>' + pad + ' Time ACTIVE: ' + at.timeActive + 's' + ', INACTIVE: ' + at.timeInactive + 's, session expired in <span style="color:red">' + chCountdown.toHhMmSs() + '</span>';
        htm += '<br/>' + pad + ' Tab ID: ' + at.uid;
        htm += '<br/>' + pad + ' Start   active: ' + at.startActive;
        htm += '<br/>' + pad + ' Start inactive: ' + at.startInactive;
        htm += '<br/>' + pad + ' Last    active: ' + at.lastActive;
        htm += '<br/>' + pad + ' Last  inactive: ' + at.lastInactive;
    }

    // ClientId & SessionId
    let clientId = getCookie(chKeyClientId);
    let sessionId = getCookie(chKeySessionId);
    htm += ')<br/>' + pad + ' Client  ID: ' + clientId;
    htm += '<br/>' + pad + ' Session ID: <b>' + (sessionId == null ? 'EXPIRED' : sessionId) + '</b>';

    // Backup clientId & sessionId
    if (chClientId == null) {
        chClientId = clientId;
    }
    if (chSessionId == null) {
        chSessionId = sessionId;
    }

    // Stop counter
    if (sessionId == null || chCountdown <= 0) {
        invokeHub('CloseSession');
    }

    // Screen
    let sh = window.screen.height;
    let sw = window.screen.width;
    htm += '<br/>' + pad + ' Screen (h,w) = (' + sh + ',' + sw;
    chScreenSize = [sh, sw];

    // Window
    let wh = $(window).height();
    let ww = $(window).width();
    htm += ') | Window (h,w) = (' + wh + ',' + ww;
    let wSize = [wh, ww];

    // Document
    let dh = $(document).height();
    let dw = $(document).width();
    htm += ')<br/>' + pad + ' Document (h,w) = (' + dh + ',' + dw;
    let dSize = [dh, dw];

    // Mouse
    htm += ') | Mouse (x,y) = (' + chMouseX + ',' + chMouseY + ')';
    let mPos = [chMouseX, chMouseY];
    if (chMouseInfos.length > 0) {
        chMouseInfos[0].mousePosition.push(mPos);
    }
    else {
        chMouseInfos = [{ windowSize: wSize, documentSize: dSize, mousePosition: [mPos] }];
    }

    $('#zlog').html(htm);
}

/**
 * Invoke
 * @param {any} name Method name
 */
function invokeHub(name) {
    if (chSignalR == null) {
        return;
    }

    if (chZLogUi) {
        console.log('Calling ' + name + '...');
    }

    let tab = getActionTab(); // current data
    let t = {
        clientId: chClientId,
        sessionId: chSessionId,
        sessionExpired: name == 'CloseSession',
        sessionClosed: name == 'CloseTab',
        tabs: [tab],
        screenSize: chScreenSize,
        mouseInfos: chMouseInfos,
        browser: detectBrowser()
    };

    if (t.sessionExpired || t.sessionClosed) {
        chSessionId = null;
        setStorageS(chKeyActionTab, null); // clear storage
        clearInterval(chTimer);
    }

    let data = JSON.stringify(t);
    chSignalR.invoke(name, data).then(function () {
        if (chZLogUi) {
            console.log('Called ' + name + '...');
        }
    }).catch(function (err) {
        console.log(err.message);
    });
}

/**
 * Insert log
 * @param {any} button Button
 * @param {any} page Page
 * @param {any} query Query
 */
function insertLog(button, page = null, query = null) {
    if (chSignalR == null) {
        return;
    }

    if (isEmpty(query)) {
        query = window.location.search;
    }

    let tabId = getCookie("TabId");
    chSignalR.invoke('InsertLog', tabId, button, page, query).catch(function (err) {
        console.log(err.message);
    });
}

/**
 * Send message
 * @param {any} user User
 * @param {any} message Message
 */
function sendMessage(user, message) {
    if (chSignalR == null) {
        return;
    }

    chSignalR.invoke('SendMessage', user, message).catch(function (err) {
        console.log(err.message);
    });
}

/**
 * Invoke message
 * @param {any} id HTML ID
 * @param {any} method JS method: click, keypress
 * @param {any} data Data
 */
function invokeMessage(id, method, data) {
    if (chSignalR == null) {
        return;
    }

    chSignalR.invoke('InvokeMessage', id, method, data).catch(function (err) {
        console.log(err.message);
    });
}

/**
 * Update data action tab to storage
 * @param {any} active Is active
 */
function updateActionTab(active) {
    let at = getActionTab();

    if (at == undefined) {
        at = new ActionTab(window.location.pathname);
        setCookie("TabId", at.uid);
        insertLog(at.uid, window.location.pathname);

        if (active) {
            calcActive(at);
        }
        else {
            calcInactive(at);
        }

        chActionTabs.push(at);
    }
    else {
        if (active) {
            calcActive(at);
        }
        else {
            calcInactive(at);
        }
    }

    // Save data to storage
    setStorageS(chKeyActionTab, chActionTabs);
}

/**
 * Set action tab
 * @param {any} active Is active
 */
function setActionTab(active) {
    let d = new Date();
    let at = getActionTab();

    if (at == undefined) {
        at = new ActionTab(window.location.pathname);
        setCookie("TabId", at.uid);
        insertLog(at.uid, window.location.pathname);

        if (active) {
            at.lastActive = d;
        }
        else {
            at.lastInactive = d;
        }

        chActionTabs.push(at);
    }
    else {
        if (active) {
            at.lastActive = d;
        }
        else {
            at.lastInactive = d;
        }
    }

    // Save data to storage
    setStorageS(chKeyActionTab, chActionTabs);
}

/**
 * Get action tab
 */
function getActionTab() {
    // Load data from storage
    let t = getStorageS(chKeyActionTab);
    if (t != null) {
        chActionTabs = t;
    }

    // Find path name exists
    let path = window.location.pathname;
    let res = chActionTabs.find(p => p.path === path);

    return res;
}

/**
 * Calculate time active
 * @param {any} o Object
 */
function calcActive(o) {
    o.timeActive += 1;
    o.lastActive = new Date();
    chCountdown = chSessionCookie * 60; // reset countdown (second)

    let v = getCookie(chKeySessionId);
    setCookie(chKeySessionId, v, chSessionCookie);

    v = getCookie(chKeyTabId);
    setCookie(chKeyTabId, v, chSessionCookie);
}

/**
 * Calculate time inactive
 * @param {any} o Object
 */
function calcInactive(o) {
    o.timeInactive += 1;
    o.lastInactive = new Date();

    if (o.startInactive == null) {
        o.startInactive = o.lastInactive;
    }
}

/**
 * Handle mouse move https://stackoverflow.com/questions/7790725/javascript-track-mouse-position
 * @param {any} e Event
 */
function handleMouseMove(e) {
    let eventDoc, doc, body;
    e = e || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX / Y, logic taken from jQuery
    // This is to support old IE
    if (e.pageX == null && e.clientX != null) {
        eventDoc = (e.target && e.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        e.pageX = e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
        e.pageY = e.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
    }

    chMouseX = e.pageX;
    chMouseY = e.pageY;
}

/**
 * Data action of tab
 */
class ActionTab {
    constructor(path) {
        this.path = path;
        this.uid = createUid();

        this.timeActive = 1;
        this.timeInactive = 0;

        this.startActive = new Date();
        this.startInactive = null;
        this.lastActive = null;
        this.lastInactive = null;
    }
}