/* Maven artifact DCO Core - AgentTerminal service version 1.0.10 */
/*
 * This is the interface the callsheet-side has to use to communicate 'directly' with the DCO Core.
 * 
 * List of events that are possibly fired by DCO Core:
 * 
 * oncallsheetclientinitialize: when the Core/callsheet-xdm tunnel has been set up.      
 */

/*
 * Example usage from within a callsheet, registering 1 event handler and firing one command towards Core (bmnr):
 * 
 * <script type="text/javascript" src="http://lg2.dijkconnect.com/agentterminal-web/CallsheetServer.js">
 * </script>
 * <script type="text/javascript">
 * 
 * 
 * window.onload = function() {
 *     CallsheetServer.initialize();
 *     
 *     // example event handler
 *     CallsheetServer.registerEvent("oncallsheetclientinitialize", function() { 
 *                             div = document.createElement("div");
 *                             div.innerHTML = "core-callsheet communication is ready";
 *                             document.body.appendChild(div);
 *     });
 * }
 * 
 * window.onunload = function() {
 *     CallsheetServer.finalize();
 * }
 * </script>
 * <a href="#" onclick="CallsheetServer.bmnr()">bmnr</a>
 * 
 */

/*jslint browser: true, evil: true */
/*global window */

// this is json2.js (minified), version 2011-01-18, from https://github.com/douglascrockford/JSON-js/blob/master/json2.js
var JSON;if(!JSON){JSON={};}(function(){"use strict";function f(n){return n<10?'0'+n:n;}if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+f(this.getUTCMonth()+1)+'-'+f(this.getUTCDate())+'T'+f(this.getUTCHours())+':'+f(this.getUTCMinutes())+':'+f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}if(typeof rep==='function'){value=rep.call(holder,key,value);}switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v;}if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}return str('',{'':value});};}if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}return reviver.call(holder,key,value);}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}throw new SyntaxError('JSON.parse');};}}());

var System = (function() {
    var _options = {
        strictMode : false,
        key : [ "source", "protocol", "authority", "userInfo", "user",
                "password", "host", "port", "relative", "path", "directory",
                "file", "query", "anchor" ],
        q : {
            name : "queryKey",
            parser : /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser : {
            strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose : /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
    };
    return {

        parseURL : function(str) {
            var o = _options, m = o.parser[o.strictMode ? "strict" : "loose"]
                    .exec(str), uri = {}, i = 14;

            while (i--) {
                uri[o.key[i]] = m[i] || "";
            }

            uri[o.q.name] = {};
            uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
                if ($1) {
                    uri[o.q.name][$1] = $2;
                }
            });
            return uri;
        },
        stringify : function(obj) {
            try {
                return JSON.stringify(obj);
            } catch (e) {
                return "{}";
            }
        },
        parse : function(str) {
            if (str === "") {
                return {};
            }
            try {
                return JSON.parse(str);
            } catch (e) {
                return {
                    "event" : "onfailure",
                    "message" : "'"
                            + str.replace(/&/g, "&amp;").replace("/<\/g",
                                    "&lt;").replace(/>/g, "&gt;")
                            + "' is not valid JSON",
                    "id" : 100,
                    status : "0"
                };
            }
        }
    };
}());

var CallsheetServer = (function() {
    var _instance = null, 
        _coreProxy = null, 
        _eventHandlers = [];

    // impl
    function _CallsheetServer() {

        this.initialize = function(config) {
            this._initialize(config, 20); // retry, at most x times
        };
        
        this._initialize = function(config, recursionLevel) {
            var that  = this, // reference to self
                event = null; // iterator

            //console.log("config: ");
            //console.dir(config);
            try { // TODO: remove try/catch once all projects use the tunnel.
                _coreProxy = window.parent.frames.easyXDM_callsheetCommunication_provider;
            } catch (e) {
                //console.log("Cannot get to proxy iframe, is it loaded by the frontend? Excp. message: " + e);
                return false;
            }

            if (_coreProxy && _coreProxy.init) {

                if (config && config.handlers) {
                    for (event in config.handlers) {
                        this.registerEvent(event, config.handlers[event]);
                    }
                }

                _coreProxy.init({
                    receiver : this.receive
                });
                this.sendEvent({"event" : "oncallsheetserverinitialize"});
            } else {
                 //console.log("coreProxy not ready yet, retrying after 100 ms, counting " + recursionLevel);
                if (recursionLevel > 0) {
                    window.setTimeout(function() { that._initialize(config, --recursionLevel); }, 100);
                } else {
                    return false;
                }
            }
            return true;
        };

        this.receive = function(message) {
            // console.log("received message: " + message);
            var eventObj = System.parse(message),
                key      = null, // iterator in event object
                i        = 0,    // iterator
                handler  = null; // local var within loop

            var params = [];
            for ( key in eventObj) {
                if (key !== "event") {
                    params.push(eventObj[key]);
                }
            }

            if (_eventHandlers[eventObj.event]) {
                // Notify observers..
                for (i in _eventHandlers[eventObj.event]) {
                    handler = _eventHandlers[eventObj.event][i];
                    //console.log("applying params " + params + " to function " + handler);
                    if (handler) {
                        handler.apply(handler, params);
                    }
                }
            }
        };

        this.bmnr = function() {
            this.sendEvent({
                event : "redirectToBelMeNiet"
            });
        };
        
        this.beforeSubmit = function() {
            this.sendEvent({
                event : "beforeSubmitCallsheet"
            });
        };

        this.afterSubmit = function() {
            this.sendEvent({
                event : "afterSubmitCallsheet"
            });
        };

        this.sendEvent = function(message) {
            if (!_coreProxy || !_coreProxy.sendData) {
                // console.log("Proxy is not ready yet. Cannot send event '" +
                // message + "'");
                return;
            }
            var msgString = System.stringify(message);
            // console.log("about to send event as string: " + msgString);
            _coreProxy.sendData(msgString);
            return true;
        };

        this.finalize = function() {
            // _coreProxy.destroy();
            return true;
        };

        this.registerEvent = function(event, handler) {
            if (!_eventHandlers[event]) {
                _eventHandlers[event] = [];
            }
            _eventHandlers[event].push(handler);
        };
    }
    // interface
    return new function() {
        var _getInstance = function() {

            if (_instance === null) {
                _instance = new _CallsheetServer();
                _instance.constructor = null;
            }
            return _instance;
        };

        this.initialize = function(config) {
            return _getInstance().initialize(config);

        };

        this.bmnr = function() {
            _getInstance().bmnr();
        };
        
        this.beforeSubmit = function() {
            _getInstance().beforeSubmit();
        };
        
        this.afterSubmit = function() {
            _getInstance().afterSubmit();
        };


        this.finalize = function() {
            return _getInstance().finalize();
        };

        this.registerEvent = function(eventName, handler) {
            _getInstance().registerEvent(eventName, handler);
        };
    };

}());