var activeAction = null;
    
function init() {
        
    if (arguments.callee.done) {
        return;  
    }
    arguments.callee.done = true;  
 
    var username = System.getCookie( "username" );
    if (username) {
        $("username").value = username;
    }
 
    $("username").setAttribute("autocomplete", "off");
    $("password").setAttribute("autocomplete", "off");
    $("phone").setAttribute("autocomplete", "off");
    
    var remember = System.getCookie("remember");
    if (remember) {
        $("remember").checked = remember;
    }

    var lidx = System.getCookie("lidx");
    if (lidx && $("licenseeId")) {
        $("licenseeId").selectedIndex = lidx;
        $("coreURL").selectedIndex = lidx;
    }
 
    var phone = System.getCookie("phone");
    if (phone) {
        $("phone").value = phone;
    }
 
    var nodes       = [];
    nodes.login     = $("Login");
    nodes.console   = $("Console");
    nodes.loading   = $("Loading");
    nodes.error     = $("Error");
 
    window.onresize = function() {
        var cw = document.body.clientWidth;
        var w = (cw - 61) + "px";
        var v = $("Viewport");
 
        if (v) {
            v.style.width = w;
        }
                
        nodes.login.style.width = w;
        nodes.console.style.width = w;
            
        w = ( cw - 91 - 20 ) + "px";
        nodes.error.style.width = w;
        nodes.loading.style.width = w;
    };

    window.onresize();
    nodes.console.style.display = "block";
    Console.create();
    Console.toggle();
    ContactCenter.create();
    ContactCenter.transitionFinish( AS_START );
 
    if (!ie && !window.allowNonIe) {
        ContactCenter.addErrorMessage(914, "not-IE");
        $("LoginForm").onsubmit = null;
        $("actLogin").onclick = null;
        System.setClassName($("actLogin"), "Action Disabled");
    }
 
    document.body.oncontextmenu = function() {
        return false;
    };
    
    $("Sidebar").onmousedown = function(evt) {
        if (!evt) {
            evt = window.event;
        } 
            
        var elem = null;
            
        if (evt && evt.srcElement) {
            elem = evt.srcElement;
        } else if (evt.target) {
            elem = evt.target;
        }
                
        if (elem.nodeName == "A" ||
            elem.nodeName == "SPAN" ||
            elem.nodeName == "INPUT" ||
            elem.nodeName == "SELECT" ||
            elem.nodeName == "TEXTAREA" ) {
            return true;
        } else {
            return false;
        }
    };
    
    $("Login").onmousedown = $("Sidebar").onmousedown;
    $("Loading").onmousedown = $("Sidebar").onmousedown;
    $("Error").onmousedown = $("Sidebar").onmousedown;
        
    window.onkeydown = function( evt )
    {
        if (!evt)
            evt = window.event;
        
        var key = evt.which || evt.keyCode;
        
        if (key == 19) {
            // Pause key: toggle console on/off
            Console.toggle();        
            evt.returnValue = false;
            evt.cancelBubble= true;
            evt.stopPropagation = true;
            return false;
            
        } else if (key == 13) {
            // RETURN
            var state = ContactCenter.getState();
            switch (state)
            {
                case AS_START:
                    if ( $("LoginForm").onsubmit )
                      $("LoginForm").onsubmit();
                    break;
                case AS_STOPPED:
                case AS_WELCOME:
                    CoreClient.connect( document.getElementById( 'phone' ).value );
                    break;
            }
            return false;
        } else if (key == 27) {
            // ESC
            var state = ContactCenter.getState();
            switch (state)
            {
                case AS_STOPPED:
                case AS_WELCOME:
                    CoreClient.logout();
                    break;
                case AS_DIALING:
                    CoreClient.disconnect();
                    break;
            }
            return false;
        } else {
            return true;
        }
    };
    
    window.onmouseup = function(event)
    {
            if (activeAction != null) {
                System.setClassName(activeAction, "Action");                        
            }
            activeAction = null;
            return false;
    };
    
    if (ie) {
        document.body.onkeydown = window.onkeydown;
        document.body.onmouseup = window.onmouseup;
        window.onmouseup = null;
        window.onkeydown = null;
    }
    
    var actions = document.body.getElementsByTagName("a");
    var len = actions.length;
    
    for (var i =0; i < len; i++) {
        
        var span =  actions.item(i).getElementsByTagName("span").item(0);
        
        if (span) {
            span.parentNode.ondragend = function(evt) {
                if (activeAction != null) {
                    System.setClassName( activeAction, "Action" );                        
                }
                activeAction = null;
                return false;
            };
            
            span.parentNode.ondragstart = function(evt) {
                return false;
            };

            span.onclick = function(evt) {
                var className = System.getClassName(this.parentNode);
                    
                if (className == "Action Disabled" || className == "Action Active Disabled") {
                    return false; 
                } else {
                    return true;
                }
            };
                
            span.onmousedown = function() { 
                var className = System.getClassName(this.parentNode);
                if (className == "Action Disabled" || className == "Action Active Disabled") {
                        return false; 
                }
 
                if (activeAction != null) {
                    System.setClassName(this.parentNode, "Action");
                }
                    
                System.setClassName(this.parentNode, "Action Active");                        
                activeAction = this.parentNode;
                return true;
            };
                
            span.onmouseup = function() { 
                var className = System.getClassName(this.parentNode);
                if (className == "Action Disabled" || className == "Action Active Disabled") {
                    return false; 
                }
 
                System.setClassName(this.parentNode, "Action");                        
                return true;
            };
        }   
    }
}

if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', init, false);
}

(function() {  
    /*@cc_on  
    try 
    {    
        document.body.doScroll('up');    
        return init();  
    } catch(e) {}  
    /*@if (false) @*/  
    if (/loaded|complete/.test(document.readyState)) 
        return init();  
    /*@end @*/  
    if (!init.done) {
        setTimeout(arguments.callee, 30);
    }
})();

if (window.addEventListener) 
    window.addEventListener('load', init, false);
else if (window.attachEvent) 
    window.attachEvent('onload', init);
    
