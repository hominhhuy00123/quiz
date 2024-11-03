'use strict';

/**
 * Replace all https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string
 * @param {any} find Find string
 * @param {any} replace Replace string
 */
String.prototype.replaceAll = function (find, replace) {
    return this.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

/**
 * Convert string to PascalCase, e.g: [the something | TheSomeThing] return the string with PascalCase [TheSomething]
 * https://stackoverflow.com/questions/4068573/convert-string-to-pascal-case-aka-uppercamelcase-in-javascript
 */
String.prototype.toPascalCase = function () {
    return this
        .replace(new RegExp(/[-_]+/, 'g'), ' ')
        .replace(new RegExp(/[^\w\s]/, 'g'), '')
        .replace(
            new RegExp(/\s+(.)(\w+)/, 'g'),
            ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
        )
        .replace(new RegExp(/\s/, 'g'), '')
        .replace(new RegExp(/\w/), s => s.toUpperCase());
};

/**
 * Convert string to camelcase, e.g: [the something | TheSomeThing] return the string with camelcase [theSomething]
 * @param {any} str a string
 */
String.prototype.toCamelcase = function () {
    return this.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

/**
 * To HhMmSs https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
 */
Number.prototype.toHhMmSs = function () {
    let sec = this; // don't forget the second param
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    return hours + ':' + minutes + ':' + seconds;
}

/**
 * To HhMmSs https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
 */
String.prototype.toHhMmSs = function () {
    let sec = parseInt(this, 10); // don't forget the second param
    return sec.toHhMmSs();
}

/**
 * Create button
 * @param {any} label Label
 */
String.prototype.createButton = function (label, prefix = '', parent = '') {
    let ar = getRight();
    let right = checkAr(ar, this);
    let css = right.create ? '' : ' disabled-z';
    return '<a data-parent="' + parent + '" data-prefix="' + prefix + '" data-ar="' + this + '" href="" class="ml-2 btn btn-primary create-z' + css + '" title="Create"><i class="fas fa-plus"></i> ' + label + '</a>';
}

/**
 * Upload button
 * @param {any} label Label
 */
String.prototype.uploadButton = function (label) {
    let ar = getRight();
    let right = checkAr(ar, this);
    let css = right.create ? '' : ' disabled-z';
    return '<a data-ar="' + this + '" href="" class="ml-2 btn btn-primary upload-z' + css + '" title="Upload"><i class="fas fa-upload"></i> ' + label + '</a>';
}

/**
 * Sync button
 * @param {any} label Label
 */
String.prototype.syncButton = function (label) {
    let ar = getRight();
    let right = checkAr(ar, this);
    let css = right.create ? '' : ' disabled-z';
    return '<a data-ar="' + this + '"  class="ml-2 btn btn-primary sync-z' + css + '" title="Sync"><i class="fas fa-sync"></i> ' + label + '</a>';
}

/**
 * Modal button
 * @param {any} label Label
 * @param {any} target Modal target
 * @param {any} id Button ID
 * @param {any} icon Button icon
 */
String.prototype.modalButton = function (label, target, id, icon) {
    let ar = getRight();
    let right = checkAr(ar, this);
    let css = right.create ? '' : ' disabled-z';
    let t = ' data-toggle="modal" data-target="#' + target + '" id="' + id.replace('Modal', 'Btn') + '"';
    return '<a data-ar="' + this + '"' + t + '"  class="ml-2 btn btn-primary' + css + '" title="' + label + '"><i class="' + icon + '"></i> ' + label + '</a>';
}

/**
 * Update button
 * @param {any} id ID
 * @param {any} label Label
 */
String.prototype.updateButton = function (id, label, prefix = '') {
    let ar = getRight();
    let right = checkAr(ar, this);
    let css = right.edit ? '' : ' disabled-z';
    return '<a data-id="' + id + '" data-prefix="' + prefix + '" data-ar="' + this + '" href="" class="ml-2 btn btn-warning update-z' + css + '" title="Update"><i class="fas fa-edit"></i> ' + label + '</a>';
}

/**
 * Detail button
 * @param {any} id ID
 * @param {any} label Label
 */
String.prototype.detailButton = function (id, label, prefix = '') {
    let ar = getRight();
    let right = checkAr(ar, this);
    let css = right.read ? '' : ' disabled-z';
    return '<a data-id="' + id + '" data-prefix="' + prefix + '" data-ar="' + this + '" href="" class="ml-2 btn btn-info view-z' + css + '" title="Detail"><i class="fas fa-search"></i> ' + label + '</a>';
}

/**
 * View button
 * @param {any} id ID
 */
String.prototype.viewButton = function (id) {
    let ar = getRight();
    let right = checkAr(ar, this);
    let css = right.read ? '' : ' disabled-z';
    return '<a data-id="' + id + '" data-ar="' + this + '" href="" class="btn btn-sm btn-primary btn-hover view-z' + css + '" title="View"><i class="fas fa-eye fa-sm"></i></a>';
}

/**
 * View link
 * @param {any} id ID
 * @param {any} label Label
 */
String.prototype.viewLink = function (id, label) {
    let ar = getRight();
    let right = checkAr(ar, this);
    let css = right.read ? 'view-z' : '';
    return '<a data-id="' + id + '" data-ar="' + this + '" style="white-space: break-spaces;" class="' + css + '" title="View">' + label + '</a>';
}

/**
 * Edit button
 * @param {any} id ID
 */
String.prototype.editButton = function (id) {
    let ar = getRight();
    let right = checkAr(ar, this);
    let css = right.edit ? '' : ' disabled-z';
    return '<a data-id="' + id + '" data-ar="' + this + '" href="" class="btn btn-sm btn-warning btn-hover update-z' + css + '" title="Update"><i class="fas fa-edit fa-sm"></i></a>';
}

/**
 * Delete button
 * @param {any} id ID
 */
String.prototype.deleteButton = function (id, prefix = '') {
    let ar = getRight();
    let right = checkAr(ar, this);
    let css = right.delete ? '' : ' disabled-z';
    return '<a data-id="' + id + '" data-prefix="' + prefix + '" data-ar="' + this + '" href="" class="btn btn-sm btn-danger btn-hover delete-z' + css + '" title="Delete"><i class="fas fa-trash"></i></a>';
}

/**
 * Email button
 * @param {any} email Email address
 */
String.prototype.emailButton = function (email) {
    return '<a class="btn btn-sm btn-danger btn-hover" href="mailto:' + email + '" title="Send Email"><i class="fas fa-envelope"></i></a>';
}

/**
 * Call button
 * @param {any} phone Phone number
 */
String.prototype.callButton = function (phone) {
    return '<a class="btn btn-sm btn-info btn-hover" href="tel:' + phone + '" title="Call"><i class="fas fa-phone-square"></i></a>';
}

/**
 * Note button
 * @param {any} note Notes
 */
String.prototype.noteButton = function (id) {
    return '<a data-id="' + id + '" class="btn btn-sm btn-hover text-red btn-red" title="Notes"  data-toggle="modal" data-target="#profileNotes" ><i class="fas fa-comment"></i></a>';
}

/**
 * Check permission
 * @param {any} url URL
 * @param {any} action Action is create | read | update | delete
 */
String.prototype.checkPermission = function (url, action) {
    let ar = getRight();
    let right = checkAr(ar, this);
    let res = right.none;

    if (action == 'create') {
        res = right.create;
    }
    if (action == 'read') {
        res = right.read;
    }
    if (action == 'update') {
        res = right.edit;
    }
    if (action == 'delete') {
        res = right.delete;
    }

    if (res) {
        if (action != 'delete') {
            window.location.href = url;
        }
    } else {
        swal({
            title: 'No permission',
            text: "You don't have permission to access this function.",
            icon: 'info'
        });
    }

    return res;
}

/**
 * 
 * @param {any} filter Input filter
 * @param {any} column Column definition
 * @param {any} ag Arguments
 */
String.prototype.getDataTableSetting = function (filter, column, ag = null) {
    let self = this;

    if (ag == null) {
        ag = {
            token: '',
            user: '',
            jwt: ''
        }
    }

    let res = {
        order: [],
        paging: true,
        pageLength: DtPageSize,
        lengthMenu: DtPageSizeList,
        serverSide: true,
        processing: true,
        searching: false,
        pagingType: 'full_numbers',
        language: {
            loadingRecords: '&nbsp;',
            processing: '<div id="LoadingZ" class="m-loader m-loader--brand m-loader--right m-loader--lg">Loading... </div>'
        },
        dom: "<'row'<'col-sm-12'tr>>\n\t\t\t<'row'<'col-sm-12 col-md-4'i><'col-sm-12 col-md-8 dataTables_pager'lp>>",
        listAction: {
            disableResponseHtmlEncoding: true,
            ajaxFunction: function (ft) {
                let a = /^.*\?.*$/.test(self); // has ? in a string
                let query = buildQuery(ft, !a);

                return $.ajax({
                    method: 'GET',
                    headers: {
                        'Auth': ag.token,
                        'User': ag.user,
                        'Authorization': ag.jwt
                    },
                    url: self + query
                }).fail((rsp) => {
                    let msg = '';

                    if (rsp.status == 0) {
                        msg = EM994 + ' (API)';
                    }
                    if (rsp.status == 401) {
                        msg = EM996;
                    }
                    msg = `<div class="alert alert-danger" role="alert">` + msg + `</div>`;
                    $('#LoadingZ').html(msg);
                }).catch({
                    //console.clear();
                });
            },
            inputFilter: filter
        },
        columnDefs: column
    };

    return res;
}

/**
 * 
 * @param {any} url API URL with controller
 * @param {any} ft Input filter
 * @param {any} cols Column definition
 * @param {any} action Action
 * @param {any} ag Arguments
 */
String.prototype.loadDataTable = function (url, ft, cols, action = 'Read', ag = null) {
    let self = this;

    if (isEmpty(url)) {
        return;
    }

    let ok = $.fn.DataTable.isDataTable(self);
    if (ok) {
        $(self).DataTable().ajax.reload();
        return;
    }

    let uri = url + action;
    let dts = uri.getDataTableSetting(ft, cols, ag);
    $(self).DataTable(dts);
}

/**
 * Get API site
 * @param {any} url Site API URL
 * @param {any} api Prefix API
 */
String.prototype.getApiSite = function (url, api = 'api') {
    if (!isEmpty(api)) {
        api += '/';
    }

    let ct = this.replace('Syn', '');
    let res = url + '/' + api + ct + '/';
    return res;
}

/**
 * Get API URL
 */
String.prototype.getApiUrl = function (api = '') {
    if (!isEmpty(api)) {
        api += '/';
    }

    let res = '/' + api + this + '/';
    return res;
}

/**
 * Get visible tab setting
 */
Number.prototype.getVisible = function (display = true) {
    let res = '';

    let arr = {
        0: { name: 'Hidden', display: 'Tab Hidden' },
        1: { name: 'Off', display: 'Default Off' },
        2: { name: 'On', display: 'Default On' }
    };

    if (0 <= this && this <= 3) {
        let t = arr[this];
        res = display ? t.display : t.name;
    }

    return res;
}

/**
 * Convert standard object permissions to permissions DTO
 */
Number.prototype.toPermisObj = function () {
    let res = {
        none: true,
        read: false,
        create: false,
        edit: false,
        delete: false,
        viewAll: false,
        modifyAll: false,
        full: false
    };

    /*let n = (int)SKG.Dto.PrivilegeDto.Sop.None; //0
    let c = (int)SKG.Dto.PrivilegeDto.Sop.Create; //2
    let r = (int)SKG.Dto.PrivilegeDto.Sop.Read; //1
    let e = (int)SKG.Dto.PrivilegeDto.Sop.Edit; //4
    let d = (int)SKG.Dto.PrivilegeDto.Sop.Delete; //8
    let v = (int)SKG.Dto.PrivilegeDto.Sop.ViewAll; //1
    let m = (int)SKG.Dto.PrivilegeDto.Sop.ModifyAll; //13
    let f = (int)SKG.Dto.PrivilegeDto.Sop.Full; //15*/

    let c = 2;
    let r = 1;
    let e = 4;
    let d = 8;
    let v = 1;
    let m = 13;

    /*Read = (e & Sop.Read) == Sop.Read;
    Create = (e & Sop.Create) == Sop.Create;
    Edit = (e & Sop.Edit) == Sop.Edit;
    Delete = (e & Sop.Delete) == Sop.Delete;

    ViewAll = (e & Sop.ViewAll) == Sop.ViewAll;
    ModifyAll = (e & Sop.ModifyAll) == Sop.ModifyAll;*/

    let t = this & r; res.read = t == r;
    t = this & c; res.create = t == c;
    t = this & e; res.edit = t == e;
    t = this & d; res.delete = t == d;

    t = this & v; res.viewAll = t == v;
    t = this & m; res.modifyAll = t == m;

    t = res.read || res.create || res.edit || res.delete || res.viewAll || res.modifyAll;
    res.none = !t;
    res.full = res.modifyAll && res.create;

    return res;
}

/**
 * Convert standard site permissions to permissions DTO
 */
Number.prototype.toPermisSte = function () {
    let res = {
        none: true,
        access: false,
        createUser: false,
        updateUser: false,
        resetPassword: false,
        loginAs: false,
        useSiteProfile: false,
        syncData: false,
        full: false
    };

    let x = {
        access: 1 << 0,
        createUser: 1 << 1,
        updateUser: 1 << 2,
        resetPassword: 1 << 3,
        loginAs: 1 << 4,
        useSiteProfile: 1 << 5,
        syncData: 1 << 6
    };

    let t = this & x.access; res.access = t == x.access;
    t = this & x.createUser; res.createUser = t == x.createUser;
    t = this & x.updateUser; res.updateUser = t == x.updateUser;
    t = this & x.resetPassword; res.resetPassword = t == x.resetPassword;
    t = this & x.loginAs; res.loginAs = t == x.loginAs;
    t = this & x.useSiteProfile; res.useSiteProfile = t == x.useSiteProfile
    t = this & x.syncData; res.syncData = t == x.syncData

    t = res.access || res.createUser || res.updateUser || res.resetPassword || res.loginAs || res.useSiteProfile || res.syncData;
    res.none = !t;
    res.full = res.access && res.createUser && res.updateUser && res.resetPassword && res.loginAs && res.useSiteProfile && res.syncData;

    return res;
}

/**
 * Convert string boolean to boolean
 */
String.prototype.toBool = function () {
    let res = null;

    if (isEmpty(this)) {
        return res;
    }

    try {
        res = JSON.parse(this.toLowerCase());
    }
    catch (e) {
        res = null;
    }

    return res;
}

/**
 * Get query parameters from a URL
 * @param {any} search Use location search or hash
 */
String.prototype.toParam = function (search = true) {
    let uri = search ? window.location.search : window.location.hash;
    uri = uri.substring(1);
    let params = new URLSearchParams(uri);
    let res = params.get(this);
    if (res == 'null') {
        res = null;
    }
    return res;
}

/**
 * Make data for view model
 */
String.prototype.makeVm = function () {
    let js = this;
    let x = JSON.parse(js);
    x.mode = null;
    x.timezoneOffset = getTimezone();

    let t = js.replaceAll(`""`, 'true');
    let y = JSON.parse(t);
    y.submit = false;
    y.processing = false;
    y.loaded = false;
    y.error = false;

    t = js.replaceAll(`""`, 'false');
    let z = JSON.parse(t);

    let res = { vm: x, valid: y, inline: z };
    return res;
}

/**
 * Is domain
 */
String.prototype.isDomain = function () {
    let a = window.location.hostname == this;
    let b = window.location.hostname == 'www.' + this;
    return a || b;
};