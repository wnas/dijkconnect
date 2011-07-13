/* Maven artifact DCO Core - AgentTerminal service version 1.2.2 */
/* global escape */

function $( id ) {
    return document.getElementById( id );
}

function eventPush(obj, event, handler) {
    if (!obj) {
        return;
    }
    if (obj.addEventListener) {
        obj.addEventListener(event, handler, false);
    } else if (obj.attachEvent) {
        obj.attachEvent('on' + event, handler);
    }
}
function eventPop(obj, event, handler) {
    if (!obj) {
        return;
    }
    if (obj.removeEventListener) {
        obj.removeEventListener(event, handler, false);
    } else if (obj.attachEvent) {
        obj.detachEvent('on' + event, handler);
    }
}

var System = (function()
{
    var interval_id,
        queue           = [],
        interval        = false,
        window          = this,
        _attached_cb    = null,
        _unloadMsg      = null,
        _requests       = [],
        _socket     = null,
        _lastMessage = "",
        _options = 
        {
            strictMode: false,
            key: [ "source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor" ],
            q:   
            {
                name:   "queryKey",
                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
            },
            parser: 
            {
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
            }
        };
    return {
        eventSet : function(node, eventName, fn) {
            if (!node) {
                return;
            }

            if (node.addEventListener) {
                node.addEventListener(eventName, fn, false);
            } else if (node.attachEvent) {
                node.attachEvent("on" + eventName, fn);
            } else {
                node["on" + eventName] = fn;
            }
        },
        eventClear: function( node, eventName, fn )
         {
            if (!node) {
                return;
            }
            if (node.removeEventListener) {
                node.removeEventListener(eventName, fn, false);
            } else if (node.detachEvent) {
                node.detachEvent("on" + event, fn);
            } else {
                node["on" + event] = null;
            }
        },
        setCookie: function( key, value, offset )
        {
            var expdate = new Date();
            expdate.setTime( expdate.getTime() + offset );
            document.cookie = key + "=" + escape( value ) + "; expires=" + expdate.toGMTString() + "; path=/";
        },
        getCookie : function(key) {
            var cookies = document.cookie;
            var indexOf = cookies.indexOf(key);
            if (indexOf === -1) {
                return false; // the cookie couldn't be found! it was never set before, or it expired.
            }
            var startpos = indexOf + key.length + 1;
            var endpos = cookies.indexOf(";", startpos);
            if (endpos === -1) {
                endpos = cookies.length;
            }
            return unescape(cookies.substring(startpos, endpos));
        },
        _protectUnloading : function(evt) {
            if (typeof evt === 'undefined') {
                evt = window.event;
            }

            if (evt) {
                evt.returnValue = _unloadMsg;
            }
            return _unloadMsg;
        },
        protectUnloading: function( msg )
        {
            _unloadMsg = ( !msg ) ? MSG_ONBEFOREUNLOAD : msg;
            window.onbeforeunload = this._protectUnloading;
        },
        unprotectUnloading: function()
        {
            _unloadMsg = null;            
            window.onbeforeunload = null;
        },
        getRequest: function( name )
        {
            var result = null;
            try { 
                result = new XMLHttpRequest();
            } catch(e) {
            }
            if (typeof(result) === "undefined" || result === null) {
                try { 
                    result = new ActiveXObject("Msxml2.XMLHTTP");
                } catch(e2) {
                    try { 
                        result = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch(e3) {
                    }
                }
            }                
            if (typeof(result) === "undefined" || result === null) {
                return null;
            }
            if (name) {
                _requests[name] = result;
            }
            return result;
        },
        stringify: function( obj )
         {
            try {
                return JSON.stringify(obj);
            } catch (e) {
                return "{}";
            }
        },
        parse: function( str )
        {
            if (str === "") {
                return {};
            }
            try {            
              return JSON.parse( str );
            } catch (e) {
                return  {
                    "event": "onfailure", 
                    "message": "'" + str.replace(/&/g, "&amp;").replace("/<\/g", "&lt;").replace(/>/g, "&gt;") + "' is not valid JSON", "id": 100, 
                    status: "0"
                 }; 
            }
        },
        parseURL: function( str ) 
        {
            var 
                o   = _options,
                m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
                uri = {},
                i   = 14;

            while ( i-- ) {
                uri[ o.key[i] ] = m[i] || "";
            }

            uri[ o.q.name ] = {};
            uri[ o.key[12] ].replace( 
                o.q.parser, 
                function($0, $1, $2) {
                    if ($1) {
                        uri[o.q.name][$1] = $2;
                    }
                }
            );
            return uri;
        },
        getClassName: function( elem )
         {
            if (!elem) {
                return false;
            }

            var className = elem.getAttribute("class");
            if (!className) {
                className = elem.getAttribute("className");
            }
            return className;
        },
        setClassName : function(elem, value) {
            if (!elem) {
                return false;
            }

            if (elem.getAttribute("className")) {
                elem.setAttribute("className", value);
            } else {
                elem.setAttribute("class", value);
            }
            return true;
        },
        methodize: function( instance, method ) {
            return function() { return method.apply( instance, arguments ); };
        },
        _postMessage : function() {
            if (queue.length > 0) {
                var f = queue.shift();
                f();
            }
        },
        getSocket : function(target_url) {
            if (_socket) {
                return _socket;
            } else {
                return false;
            }
        },
        postMessage : function(message, target_url) {
            if (!target_url) {
                return false; 
            }
                
            System.getSocket(target_url).postMessage(message);
            return true;

        },
        
        receiveMessage : function(callback, source_origin) {
            _socket = new easyXDM.Socket({
                remote: source_origin,
                onMessage: function(message, origin){
                    callback( { "data": message } );
                }
            });  
            return true;
        },
        
        /**
         * Inject a script element using the given URL as src. Data returned by the server will be fed to given callback function
         * @param url the URL used as SRC for the script element.
         * @param callback the function that will be fed with data returned by server
         * @returns void
         */
        getJSONP : function(url, callback) {

            var ud = '_' + +new Date,
                script = document.createElement('script'),
                head = document.getElementsByTagName('head')[0] 
                       || document.documentElement;

            // extra callback in between, to clean up the script after it's been executed.
            window[ud] = function(data) {
                head.removeChild(script);
                callback && callback(data);
            };
            script.src = url + (url.split('?')[1] ? '&':'?') + "callback=" + ud;

            head.appendChild(script);
        }
    };
}());

// Console ///////////////////////////////////////////////////////////////////////////////////////////////////////
var Console = (function()
{
    var 
        _instance       = null,
        _stats          = [],
        _console        = null,
        _events         = [],
        _buffer         = "";
    
    // Implementation ///////////////////////////////////////////////////////////////////////////////////////////////// 
    function _Console()
    {
        this.create = function()    
        {  
            _console = $("Console");
        };
        this.destroy = function()                
        {
            _console = null;
        };
        
        this.parse = function( event, prefix )
        {
            var key = null;
            
            if ( typeof[ event ] !== 'object' ) {
                return event + "<br\/>";
            } else {
                var result = "";
                for (key in event) {
                    if (key === "event") {
                        continue;
                    }

                    if (typeof event[key] === 'object') {
                        var s = this.parse(event[key], prefix + "&nbsp;");
                        result += prefix + key + " = <br\/>" + s;
                    } else if (typeof event[key] === 'string') {
                        result += prefix + key + " = " + event[key].replace("<", '&lt;').replace(/>/g,'&gt;') + "<br\/>";
                    } else {
                        result += prefix + key + " = " + event[key] + "<br\/>";
                    }
                }   
                return result;
            }
            
        };
        this.toggle = function()                
        { 
            if (!_console) {
                _console = $("Console");
            }
            _console.style.display = ( _console.style.display === "none" ) ? "block" : "none";
            
            var className = document.body.getAttribute( "className" );
            if (!className) {
                className = document.body.getAttribute("class");
            }
            
            var postfix = (className === "Error" || className === "Debug Error" ) ? "Error" : "";
            if ( _console.style.display === "block" ) {
                _buffer = "";
                this.parseEvents();
                document.body.setAttribute( "class", "Debug " + postfix );
                document.body.setAttribute( "className", "Debug " + postfix );
            } else {
                document.body.setAttribute( "class", postfix );
                document.body.setAttribute( "className", postfix );
            }
            window.onresize();
        };
        this.addEventToStats = function( eventKey, eventValue, event )
        {
            var 
            eventValue = eventValue.split("?").shift();

            if (!_stats[eventKey]) {
                _stats[eventKey] = {
                    "count" : 1,
                    "keys" : []
                };
            } else {
                _stats[eventKey].count++;
            }
            if ( !_stats[ eventKey ][ "keys" ][ eventValue ] ) {
                _stats[ eventKey ][ "keys" ][ eventValue ] = [];
                _stats[ eventKey ][ "keys" ][ eventValue ][ "count" ] = 0;
                _stats[ eventKey ][ "keys" ][ eventValue ][ "average" ] = 0;
                _stats[ eventKey ][ "keys" ][ eventValue ][ "total" ] = 0;
            }
            _stats[ eventKey ][ "keys" ][ eventValue ][ "count" ]++;
            _stats[ eventKey ][ "keys" ][ eventValue ][ "total" ] += event.duration;
            _stats[ eventKey ][ "keys" ][ eventValue ][ "average" ] = _stats[ eventKey ][ "keys" ][ eventValue ][ "total" ] / _stats[ eventKey ][ "keys" ][ eventValue ][ "count" ];
        };
        
        this.log = function( event )
        { 

            if (!event.event) {
                return;
            }

            var ts = new Date();
            var y = (ts.getUTCFullYear() - 2000);
            if ( y < 10 ) {
                y = "0" + y;
            }
            var m = (ts.getUTCMonth() + 1);
            if ( m < 10 ) {
                m = "0" + m;
            }
            var d = ts.getUTCDate();
            if ( d < 10 ) {
                d = "0" + d;
            }
            var h = ts.getUTCHours();
            if ( h < 10 ) {
                h = "0" + h;
            }
            var mi = ts.getUTCMinutes();
            if ( mi < 10 ) {
                mi = "0" + mi;
            }
            var s = ts.getUTCSeconds();
            if ( s < 10 ) {
                s = "0" + s;
            }
            var ms = ts.getUTCMilliseconds();
            if ( ms < 10 ) {
                ms = "00" + ms;
            } else if (ms < 100) {
                ms = "0" + ms;
            }
            var timestamp = d + "-" + m + "-" + y + " " + h + ":" + mi + ":" + s + "." + ms;
            

            if ( event.duration )
            {
                var duration = event.duration;
                switch( event.event )
                {
                    case "ontransitionfinish":
                        this.addEventToStats( "transition", event.newState, event );
                        if ( event.newState == AS_START )
                            this.log( { "event": "onstatsupdate", "stats": _stats } );
                        break;
                    case "oncommandfinish":
                        this.addEventToStats( "command", event.command, event );
                        break;
                    case "onviewportcreate":
                        this.addEventToStats( "viewport", event.url, event );
                        break;
                    case "onresponse":
                        this.addEventToStats( "network", event.url, event );
                        break;
                }
            }
            event.timestamp = timestamp;
            _events.push( event );
            if ( _events.length > 100 ) {
                //console.log("_events size before is: " + _events.length);
                _events.splice(0, 25); // remove oldest 25 events
                //console.log("_events size after is: " + _events.length);
            }
            if ( _console.style.display == "block" )
                this.parseEvents();
        };
        
        this.getConsoleContents = function()
        {
            this.parseEvents();
            return _console.innerHTML;
        };
        
        this.parseEvents = function()
        {
            
            for ( var i = 0; i <_events.length; i++ )
            {
                var event = _events[ i ];
                var timestamp = event.timestamp;
                var s = "<strong>" + event.event + "&nbsp;&nbsp;<br\/>" + timestamp + "<\/strong>";
                if ( event.duration )
                {
                    var duration = event.duration;
                    s = '<span style="float: right; padding-right: 4px;">' + duration + " ms&nbsp;<\/span>" + s;
                }
                
                delete event.duration;
                delete event.timestamp;

                var parsed = event;
                if ( typeof parsed === 'object' )
                    parsed = this.parse( parsed, "" );

                s += parsed;
    //            var parsed = "";
                switch( event.event )
                {
                    case "onsuccess":
                        s = '<div class="success" style="backgound:green; color: white;">' + s + '<span><\/span><\/div>';
                        break;
                    case "onfailure":
                        s = '<div class="failure">' +
                                '<strong>' + event.event + '&nbsp;&nbsp;<br\/>' + timestamp + '<\/strong>' + 
                                event.message + "(" + ((typeof event.id != 'undefined' ) ? event.id : 0 ) + ")" + '&nbsp;<a href="' + event.url + '">' + event.url + '<\/a> HTTP/1.1' +
                                '<\/div>';
                        break;
                    case "onrequest":
                        s = '<div class="network">' +
                                '<strong>' + event.event + '&nbsp;&nbsp;<br\/>' + timestamp + '<\/strong>' + 
                                '<a href="' + event.url + '">' + event.url + '<\/a> ' + event.method +
                                ((event.body && event.body.split) ? '<br\/>' + event.body.split("&").join("<br\/>") : "") +
                                '<span><\/span><\/div>';
                        break;
                    case "onresponse":
                        s = '<div class="network">' +
                                '<span>' + duration + "ms<\/span>" +
                                '<strong>' + event.event + '&nbsp;&nbsp;<br\/>' + timestamp + '<\/strong>' + 
                                '<a href="' + event.url + '">' + event.url + '<\/a> ' + event.status +
                                '<br\/>' + parsed + '<br\/>' +
                                '<\/div>';
                        break;
                    case "onerror":
                        s = '<div class="error">' +
                                '<strong>' + event.event + '&nbsp;&nbsp;<br\/>' + timestamp + '<\/strong>' + 
                                event.message +
                                '<\/div>';
                        break;
                    case "ontransitionfinish":
                        s = '<div class="frontend">' + s + event.newState + '<span><\/span><\/div>';
                        break;
                    case "ontransitioncancel":
                    case "ontransitionstart":
                        s = '<div class="frontend">' + s + '<span><\/span><\/div>';
                        break;
                    case "oncommandstart":
                    case "oncommandfinish":
                        s = '<div class="command">' +
                                '<strong>' + event.event + '&nbsp;&nbsp;<br\/>' + timestamp + '<\/strong>' + 
                                event.command + 
                                '<span><\/span><\/div>';
                        break;
                    default:
                        s = '<div class="message">' + s + '<span><\/span><br\/><\/div>';
                        break;
                }
                s +="<hr />";
                if ( _console.style.display == "block" )
                    _console.innerHTML = s + _console.innerHTML;
                else
                    _buffer += s;

            }
            if ( _console.style.display == "block" ) {
                _events = [];
            }
            else {
                _console.innerHTML +=  _buffer ;
            }
            _buffer = "";
        };
    }
    // Interface ////////////////////////////////////////////////////////////////////////////////////////////////////// 
    return new function()     
    {
        var _getInstance = function()
        {
            if ( _instance == null )
            {
                _instance = new _Console();
                _instance.constructor = null;
            }
            return _instance;
        };
        this.create         = function()                { return _getInstance().create(); };
        this.destroy        = function()                { return _getInstance().destroy(); };
        this.log            = function( event )         { return _getInstance().log( event ); };
        this.parse          = function( event, prefix ) { return _getInstance().parse( event, prefix ); };
        this._parseEvent    = function( index )         { return _getInstance()._parseEvent( index ); };
        this.toggle         = function()                { return _getInstance().toggle( ); };
        this.getConsoleContents = function()       { return _getInstance().getConsoleContents( ); };
    };
})();

//this is json2.js (minified), version 2011-01-18, from https://github.com/douglascrockford/JSON-js/blob/master/json2.js
var JSON;if(!JSON){JSON={};}(function(){"use strict";function f(n){return n<10?'0'+n:n;}if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+f(this.getUTCMonth()+1)+'-'+f(this.getUTCDate())+'T'+f(this.getUTCHours())+':'+f(this.getUTCMinutes())+':'+f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}if(typeof rep==='function'){value=rep.call(holder,key,value);}switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v;}if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}return str('',{'':value});};}if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}return reviver.call(holder,key,value);}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}throw new SyntaxError('JSON.parse');};}}());



