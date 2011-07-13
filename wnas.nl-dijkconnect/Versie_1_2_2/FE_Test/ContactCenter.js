/* Maven artifact DCO Core - AgentTerminal service version 1.2.2 */

var testURLS = 
{
    "Welcome":      "https://callcenter.annie.nl/medewerkers/daginfo/main.php",
    "Dialing":      "https://callcenter.annie.nl/atwt/paginas/CallingAgent.php",
    "Idle":         "https://callcenter.annie.nl/atwt/paginas/Idle.php",
    "Pauzed":       "https://callcenter.annie.nl/atwt/paginas/Pause.php",
    "Stopped":      "https://callcenter.annie.nl/atwt/paginas/EndWorkOverview.php"
};

var IDLE_TIMEOUT  = 250;

var autologinURL        = "http://callcenter.annie.nl/DCOLogin.php";
var autologinURLSecure  = "https://callcenter.annie.nl/DCOLogin.php";
var autologoutURL       = "https://callcenter.annie.nl/dco/annie/autologout.php";

function checkEnabled( elem )
{
    var className = elem.getAttribute( "class" );
    if ( !className )
        className = elem.getAttribute( "className" );
        
    return !(/Disabled/.test(className));
}

var AS_START        = "Start",
    AS_WELCOME      = "Welcome",
    AS_DIALING      = "Dialing",
    AS_IDLE         = "Idle",
    AS_WORKING      = "Working",
    AS_WRAPUP       = "Wrapup",
    AS_DONE         = "Done",
    AS_PAUZED       = "Pauzed",
    AS_STOPPED      = "Stopped";


var CS_DIALING        = "Dialing",
    CS_CONNECTED      = "Connected",
    CS_DISCONNECTED   = "Disconnected",
    CS_ONHOLD         = "On Hold",
    CS_MUTED          = "Muted",
    CS_TRANSFERRED    = "Transferred";

var ErrorCodeMappings = 
{
    onloginsessiondestroy:
    {
        ERROR:                  101,
        MAXWORKTIMEEXCEEDED:    102,
        AGENTREQUEST:           103,
        OTHERSESSION:           104
    },
    onworksessiondestroy:
    {
        LOGIN:                  201,
        NUMBERBUSY:             202,
        BADNUMBER:              203,
        NOANSWER:               204,
        DIALERROR:              205,
        DISCONNECTED:           206
    },
    onworksessionsuspended: {
        FLEX_STARTED: 207,
        AGENTPHONE_UNAVAILABLE: 208
    },
    oncalldestroy:
    {
        NUMBERBUSY:             302,
        BADNUMBER:              303,
        NOANSWER:               304,
        DIALERROR:              305,
        DISCONNECTEDBYCALLER:   309,
        DISCONNECTEDBYAGENT:    310,
        DIALTERMINATEDBYAGENT:  310,
        DISCONNECTEDOTHER:      307,
        DIALTERMINATEDBYOTHER:  308,
        DISCONNECTED_REDIRECT_IVR: 306
    }
};

var States = 
{
    Start: 
    {
        title: "ATWT - Aanmelden",
        transitions:
        {
            onloginsessioncreate: ""
        },
        actions: 
        [
            "actLogin"
        ],
        disabled:
        [
        ]
    },
    Welcome: 
    {
        title: "Welkom",
        actions: 
        [
            "actMute",
            "actUnmute",
            "actLogout",
            "actConnect",
            "actPauze",
        ],
        disabled:
        [
            "actMute",
            "actPauze",
        ]
    },
    Dialing: 
    {
        title: "Bellen",
        actions: 
        [
            "actMute",
            "actUnmute",
            "actLogout",
            "actDisconnect",
            "actPauze",
        ],
        disabled:
        [
            "actMute",
            "actUnmute",
            "actLogout",
            "actPauze",
        ]
    },
    Idle: 
    {
        title: "Wachten",
        actions: 
        [
            "actMute",
            "actUnmute",
            "actLogout",
            "actDisconnect",
            "actPauze",
        ],
        disabled:
        [
            "actLogout",
        ]
    },

    Pauzed: 
    {
        title: "Pauze",
        actions: 
        [
            "actLogout",
            "actDisconnect",
            "actMute",
            "actUnmute",
            "actResume",
            "actNext"
        ],
        disabled:
        [
            "actLogout",
            "actNext"
        ]
    },
    Working: 
    {
        title: "Bezig",
        actions: 
        [
            "actStartRecording",
            "actMute",
            "actUnmute",
            "actDisconnectCaller",
            "actTransferToIVRApp",
            "actConsultDisconnect"
        ],
        disabled:
        [
            "actStartRecording",
            "actTransferToIVRApp",
            "actConsultDisconnect"
        ]
    },
    Wrapup: 
    {
        title: "Bezig",
        actions: 
        [
            "actStartRecording",
            "actMute",
            "actUnmute",
            "actDisconnectCaller",
            "actTransferToIVRApp",
            "actBlockCaller",
            "actConsultDisconnect"
        ],
        disabled:
        [
            "actStartRecording",
            "actBlockCaller",
            "actConsultDisconnect"
        ]
    },
    Done: 
    {
        title: "Klaar",
        actions: 
        [
            "actLogout",
            "actDisconnect",
            "actMute",
            "actUnmute",
            "actPauze",
            "actNext"
        ],
        disabled:
        [
            "actLogout"
        ]
    },
    Stopped: 
    {
        title: "Gestopt",
        actions: 
        [
            "actMute",
            "actUnmute",
            "actLogout",
            "actConnect",
            "actPauze",
            "actNext"
        ],
        disabled:
        [
            "actMute",
            "actUnmute",
            "actPauze",
            "actNext"
        ]
    }
};
 
var ContactCenter = (function()
{
    var _instance           = null,
        _errorTimer         = false,
        _username           = null,
        _password           = null,
        _licenseeId         = null,
        _actions            = [], // Contains a dynamic DOM NodeList object for all anchor-tags
        _transitionStartTime= Number( new Date ),
        _viewportStartTime  = null,

        _userProfile        = null,
        _callInfo           = null,
        _phonenumber        = null,
        _mute               = false,

        _viewport           = null,
        _buffer             = null,
        _loader             = null,
        _error              = null,

        _recordingState     = false,
        _connectionState    = false,
        _callState          = false,
        _newState           = false,
        _state              = false,
        _frontendSettings   = {};
        
    
    // Implementation ///////////////////////////////////////////////////////////////////////////////////////////////// 
    function _ContactCenter()
    {
        this.create = function()
        {
            CoreClient.addObserver( "ContactCenter", ContactCenter );

            this.setConnectionState( CS_DISCONNECTED );
            this.setCallState( CS_DISCONNECTED );
            
            _viewport   = $("Viewport");
            _buffer     = $("Buffer");
            
            _loader     = $("Loading");
            _error      = $("Error");
            
            var actionsTop = $("SidebarControlsTop").getElementsByTagName("a");
            var actionsBottom = $("SidebarControlsBottom").getElementsByTagName("a");
            
            for ( var i = 0; i < actionsTop.length; i++ )
                _actions.push( actionsTop.item( i ) );
            for ( var i = 0; i < actionsBottom.length; i++ )
                _actions.push( actionsBottom.item( i ) );
        };

        this.destroy = function()
        {
            CoreClient.removeObserver( "ContactCenter" );
            this.transitionFinish( AS_START );
        }; 
        
        this.transitionStart    = function()              
        { 
            _loader.style.display = "block";
            _transitionStartTime = Number( new Date );                                                             
            if ( this.getState() != AS_WORKING )
            {
                var length = _actions.length;
                for ( var i = 0 ; i < length; i++ )
                {
                    if ( _actions[ i ].id != "actMute" && _actions[ i ].id != "actUnmute" )
                        System.setClassName( _actions[ i ], "Action Disabled" );
                }
            }
            Console.log( { "event": "ontransitionstart" } );
        };

        this.transitionCancel   = function()                        
        { 
            _loader.style.display = "none";
            this.setState( _state );
            Console.log( { "event": "ontransitioncancel", "duration": Number( new Date ) - _transitionStartTime  } );
        };
        
        this.transitionFinish   = function(newState) { 
            _newState = newState;
            if (newState == AS_START) {
                Console.log( { "event": "ontransitionfinish", "newState": newState, "duration": Number( new Date ) - ContactCenter.getTransitionStartTime() } );
                this.setState(newState);
            } else if (newState == AS_DONE) {
                this.setState( newState );
            
            // load viewport with per-state page (not for working/wrapup because those show a callsheet)
            } else if (newState != AS_WORKING && newState != AS_WRAPUP) {
                this.loadViewport( newState);
            } else if (newState == AS_WRAPUP) {
                _loader.style.display = "none";
                this.setState( newState );
            } 

            // Added for dumping console contents to Annie-beheer
            if (newState == AS_START || newState == AS_STOPPED) {
                setTimeout( System.methodize( this, function(){
                    var request = System.getRequest("consoledumper");
                    request.open( "POST", HTTP_ENDPOINT_CONSOLE_DUMPER + "?username="+encodeURI($("username").value), true);
                    request.send(Console.getConsoleContents());
                }), 0); 
            }
            // End of dumping console.
            
            if ( newState != AS_STOPPED && newState != AS_START )
                this.clearError();            
        };
        
        this.loadViewport = function( id )
        {
            if ( _userProfile && _userProfile.usergroup && _userProfile.usergroup.usergroupPauseUrl != "http://pause-url/" )
            {    
                switch( id )
                {
                    case AS_WELCOME:    var url = _userProfile.usergroup.usergroupDailyInfoUrl; break;
                    case AS_IDLE:       var url = _userProfile.usergroup.usergroupIdleUrl; break;
                    case AS_PAUZED:     var url = _userProfile.usergroup.usergroupPauseUrl; break;
                    case AS_STOPPED:    var url = _userProfile.usergroup.usergroupEndWorkOverviewUrl; break;
                    case AS_DIALING:    var url = _userProfile.usergroup.usergroupCallingAgentUrl; break; 
                    default: return;
                }
            } 
            else 
                var url = testURLS[ id ];
            
            var profile = this.getUserProfile();
            var userId = ( profile && profile.user && profile.user.userId ) ? profile.user.userId : 0;
            
            if ( _viewport ) 
                System.eventClear( _viewport, "load", ContactCenter.onviewportcreate );
            
            if ( _buffer )
            {
                System.eventClear( _buffer, "load", ContactCenter.onviewportcreate );
                document.body.removeChild( _buffer );
            }
            _buffer = document.createElement( "iframe" );
            _buffer.isLoading = true;
            _buffer.setAttribute( "id", "Buffer" );
            _buffer.setAttribute( "frameBorder", 0 );
            _buffer.setAttribute( "src", url + "?id=" + userId );
            _buffer.style.width = ( document.body.clientWidth - 61 ) + "px";;
            _buffer.style.display = "none";                        
            document.body.appendChild( _buffer );
            System.eventSet( _buffer, "load", ContactCenter.onviewportcreate );
            Console.log( { "event": "onviewportsetup", "url": url } );
            _loader.style.display = "block";
            _viewportStartTime = Number( new Date );
        };

        this.setCallState= function( newCallState )   
        {
            _callState = newCallState;
            if ( _callState == CS_DISCONNECTED ) {
                this.setRecording( false );
            }

            if ( _callState == CS_DISCONNECTED || _callState == CS_DIALING ) {
                var disableOrEnable = this.disableAction;
            } else {
                var disableOrEnable = this.enableAction;
            }
            disableOrEnable($("actStartRecording"));
            disableOrEnable($("actStopRecording"));

            /* 
             * Show 'blacklist caller' in case of inbound, BMNR in all other cases.
             * This is determined using the project info from the core, specifically the projectType field
             */
            var projectType = (this.getCallInfo() != null) ? this.getCallInfo().project.projectType : "";
            if (/inbound/i.test(projectType)) {
                $("actBlockCaller").style.display = "block";
                $("actTransferToIVRApp").style.display = "none";
                if (this.getCallInfo().service && this.getCallInfo().service.serviceBlackListingAllowed) {
                    disableOrEnable($("actBlockCaller"));
                }
            } else {
                $("actBlockCaller").style.display = "none";
                $("actTransferToIVRApp").style.display = "block";
                if (!this.isTunnelProject()) {
                    disableOrEnable($("actTransferToIVRApp"));
                }
            }
            
            System.setClassName( $("actHold"), "Action Disabled" );
            System.setClassName( $("actUnhold"), "Action Disabled" );
            /* TIM: Disable hold button
            disableOrEnable( $("actHold"));
            disableOrEnable( $("actUnhold"));
            */

            System.setClassName( $("actDisconnectCaller"), ( _callState == CS_CONNECTED || _callState == CS_DIALING ) ? "Action" : "Action Disabled" );
            

        };

        this.setState= function( newState )   
        { 
            Console.log( { "event": "setState", "msg" : "old state: "+_state + ", new state: " + newState } );
            
            if ( newState == AS_START )
                System.unprotectUnloading();
            else
                System.protectUnloading();
            
            _state = newState;

            var length = _actions.length;
            for ( var i = 0 ; i < length; i++ )
                _actions[ i ].style.display = "none";
            
            var s = States[ newState ];

            var title = s.title;

            if ( _userProfile && _userProfile.usergroup && _userProfile.usergroup.usergroupClientTitle )
                title = _userProfile.usergroup.usergroupClientTitle + " - "  + title;

            this.setTitle( title );

            var actions = s.actions;

            var newActions = [];
            var act = null;

            length = actions.length;
            for ( var i = 0 ; i < length; i++ )
            {
                act = $( actions[ i ] );
                newActions.push( act );
                System.setClassName( act, "Action" );
            }

            var disabled = s.disabled;
            length = disabled.length;
            for ( var i = 0 ; i < disabled.length; i++ )
                System.setClassName( $( disabled[ i ] ), "Action Disabled" );
            
            length = newActions.length;
            for ( var i = 0 ; i < length; i++ )
                if ( newActions[i] )
                    newActions[i].style.display = "block";
            if ( newState == AS_WORKING )
            {
                
            }
            if ( newState != AS_START )
            {
                if ( this.getMute() )
                { 
                    if ( newState == AS_WELCOME || this.getConnectionState() == CS_DISCONNECTED )
                        System.setClassName( $( "actUnmute" ), "Action Disabled" );
                    else if ( newState != AS_STOPPED && newState != AS_DIALING )
                        System.setClassName( $( "actUnmute" ), "Action Active" );
                }
                else
                {
                    if ( newState == AS_WELCOME || this.getConnectionState() == CS_DISCONNECTED )
                        System.setClassName( $( "actMute" ), "Action Disabled" );
                }
                $("actUnmute").style.display    = this.getMute() ? "block" : "none";
                $("actMute").style.display      = this.getMute() ? "none" : "block";
            }
            
            if ( _viewport )
                _viewport.style.display = ( newState != AS_START ) ? "block" : "none";
            
            $("Login").style.display = ( newState != AS_START ) ? "none" : "block";
            
            if ( newState == AS_START )
            {
                System.setClassName( $("actLogin"), "Action" );
                //$("licenseeId").removeAttribute( "disabled" );
                $("username").removeAttribute( "disabled" );
                $("password").removeAttribute( "disabled" );
                $("phone").removeAttribute( "disabled" );
                $("remember").removeAttribute( "disabled" );

                if ( _viewport )
                {
                    System.eventClear( _viewport, "load", ContactCenter.onviewportcreate );
                    document.body.removeChild( _viewport );
                    _viewport = null;
                }
                if ( _buffer )
                {
                    System.eventClear( _buffer, "load", ContactCenter.onviewportcreate );
                    document.body.removeChild( _buffer );
                    _buffer = null;
                }

                $("Login").style.display = "block";
                $("username").focus();
                $("username").select();
                $("password").value = "";
            }
            
            // Always disable bmnr in case of a tunnel project.
            if (this.isTunnelProject()) {
                this.disableAction($("actTransferToIVRApp"));
            }
            _loader.style.display = "none";
        };                          

        this.setConnectionState= function( newConnectionState )   
        { 
            if ( _connectionState != newConnectionState )
                _connectionState = newConnectionState;
        };

        this.setTitle           = function( newTitle )              
        {
             document.title = newTitle;
        };
        
        this.setUserProfile        = function( newUserProfile )           
        {
            _userProfile = newUserProfile;
        };
        
        this.setPassword        = function( newPassword )           
        {
            if ( _password != newPassword )
            {
                _password = newPassword;
            }
        };
        
        this.setLicenseeId      = function( newLicenseeId )         
        {
            if ( _licenseeId != newLicenseeId )
            {
                _licenseeId = newLicenseeId;
            }
        };
        
        this.setPhonenumber     = function( newPhonenumber )        
        {
            if ( _phonenumber != newPhonenumber )
            {
                _phonenumber = newPhonenumber;
            }
        };

        this.setMute            = function( muted )        
        {
            if ( _mute != muted )
            {
                _mute = muted;
                if ( _mute )
                    this.setConnectionState( CS_MUTED );
                else if ( this.getConnectionState() == CS_MUTED )
                    this.setConnectionState( CS_CONNECTED );
            }
        };
        
        this.getNewState= function() { return _newState; };
        this.getTransitionStartTime= function() { return _transitionStartTime; };
        this.getViewportStartTime= function() { return _viewportStartTime; };
        this.getConnectionState = function()                        { return _connectionState; };
        this.getCallState       = function()                        { return _callState; };
        this.getState           = function()                        { return _state; };
        
        this.getTitle           = function()                        { return document.title; };
        this.getUserProfile     = function()                        { return _userProfile; };
        this.getCallInfo        = function()                        { return _callInfo; };
        
        this.isTunnelProject    = function()                        { 
            return (_callInfo && _callInfo.project && /tunnel=1/.test(_callInfo.project.projectFrontEndSettingsUrl));
        };
        
        this.setCallInfo        = function(callInfo)                        { _callInfo = callInfo; };

        this.getPassword        = function()                        { return _password; };
        this.getLicenseeId      = function()                        { return _licenseeId; };
        this.getPhonenumber     = function()                        { return _phonenumber; };
        this.getMute            = function()                        { return _mute; };

        this.login              = function( username, password )    { };

        this.addErrorMessage           = function(code, technicalDetails) {
            
            

            var message = this.resolveErrorMessage(code);

            Console.log({"event" : "onerror", "message" : "app error, code " + code + ", user-message '" + message + "', details: " + technicalDetails});
            
            if (message === "") {
                return; // Message is empty: do not show.
            }
            
            message = message + ' <span class="errorCode">[' + code + "]</span>";
            
            var e = $("Error");
            e.style.display = "block";
            e.innerHTML = "<strong style=\"font-weight: normal\">" + message + "<\/strong><a href=\"#\" style=\"position: absolute; z-index: 100000000000000; width: 24px; height: 24px; text-align: center; line-height: 24px; padding: 0; border: 0; display: block; top: 2px; right: 4px;; color: gray;\" onclick=\"ContactCenter.clearError(); return false;\" class=\"Action\">x<\/a><br/>";
            System.setClassName( document.body, ( System.getClassName( document.body ) == "Debug" ) ? "Debug Error" : "Error" );
            var w = ( document.body.clientWidth - 91 - 20 ) + "px";
            e.style.width = w;
            $("Loading").style.width = w;

            if ( _errorTimer )
                window.clearTimeout( _errorTimer );
            _errorTimer = window.setTimeout( System.methodize( this, function() { ContactCenter.clearError(); } ), 10000 );

            
            
        };
        this.resolveErrorMessage = function(code) {
          var msg = ""; 
            if (ERRORS_GENERAL[code]) {
              msg = ERRORS_GENERAL[code];
          }
          if (ERRORS_LICENSEES[_licenseeId] && ERRORS_LICENSEES[_licenseeId][code]) {
              msg = ERRORS_LICENSEES[_licenseeId][code];
          }
          return msg;
        };
        
        this.clearError = function()
        {
            if ( _errorTimer )
                window.clearTimeout( _errorTimer );
            _errorTimer = false;
            System.setClassName( document.body, ( System.getClassName( document.body ) == "Debug Error" ) ? "Debug" : "" );
            $("Error").style.display = "none";
            
            return false;
        };
        this.getViewport        = function()                        { return _viewport; };
        this.getBuffer          = function()                        { return _buffer; };
        this.setViewport        = function( node )                  { _viewport = node; };
        this.setBuffer          = function( node )                  { _buffer = node; };

        this.setRecording       = function( newValue )              
        { 
            if ( this.getConnectionState() != CS_CONNECTED )
            {
                _recordingState = false;
                return;
            }
            if ( newValue != _recordingState )
            {
                _recordingState = newValue;
                $("actStartRecording").style.display = (newValue) ? "none" : "block";
                $("actStopRecording").style.display = (newValue) ? "block" : "none";
                System.setClassName( $("actStartRecording"), (newValue) ? "Action Disabled" : "Action" );
                System.setClassName( $("actStopRecording"), (newValue) ? "Action" : "Action Disabled" );
            }


        };
        this.getRecording       = function()                        { return _recordingState; };
        
        this.enableAction = function (node) {
            var currentClass = System.getClassName(node);
            System.setClassName(node, currentClass.replace(/Disabled/g, ""));
        };
        
        this.disableAction = function (node) {
            var currentClass = System.getClassName(node);
            if (!/Disabled/.test(currentClass))
                System.setClassName(node, currentClass + " Disabled");
        };
    }

    // Interface ////////////////////////////////////////////////////////////////////////////////////////////////////// 
    return new function()     
    {
        this.submitted = false;
        
        var _getInstance = function()
        {
            if ( _instance == null )
            {
                _instance = new _ContactCenter();
                _instance.constructor = null;
            }
            return _instance;
        };

        this.create             = function()                        { return _getInstance().create(); };
        this.destroy            = function()                        { return _getInstance().destroy(); };
        this.error              = function( message, displayTime )  { return _getInstance().error( message, displayTime ); };

        this.transitionStart    = function()                        { return _getInstance().transitionStart(); };
        this.transitionCancel   = function()                        { return _getInstance().transitionCancel(); };
        this.transitionFinish   = function( newState )              { return _getInstance().transitionFinish( newState ); };

        this.setTitle           = function( newTitle )              { return _getInstance().setTitle( newTitle ); };
        this.getTitle           = function()                        { return _getInstance().getTitle(); };

        this.setUserProfile     = function( newUserProfile )        { return _getInstance().setUserProfile( newUserProfile ); };
        this.getUserProfile     = function()                        { return _getInstance().getUserProfile(); };
        this.getCallInfo        = function()                        { return _getInstance().getCallInfo(); };
        this.setCallInfo        = function(callInfo)                { return _getInstance().setCallInfo(callInfo); };
        this.isTunnelProject    = function()                        { return _getInstance().isTunnelProject(); };
        this.setPassword        = function( newPassword )           { return _getInstance().setPassword( newPassword ); };
        this.getPassword        = function()                        { return _getInstance().getPassword(); };
        
        this.setLicenseeId      = function( newLicenseeId )         { return _getInstance().setLicenseeId( newLicenseeId ); };
        this.getLicenseeId      = function()                        { return _getInstance().getLicenseeId(); };

        this.setPhonenumber     = function( newPhonenumber )        { return _getInstance().setPhonenumber( newPhonenumber ); };
        this.getPhonenumber     = function()                        { return _getInstance().getPhonenumber(); };

        this.setState           = function( newState )              { return _getInstance().setState( newState ); };
        this.getState           = function()                        { return _getInstance().getState(); };

        this.setCallState       = function( newState )              { return _getInstance().setCallState( newState ); };
        this.getCallState       = function()                        { return _getInstance().getCallState(); };

        this.setRecording       = function( newValue )              { return _getInstance().setRecording( newValue ); };
        this.getRecording       = function()                        { return _getInstance().setRecording(); };

        this.setConnectionState = function( newState )              { return _getInstance().setConnectionState( newState ); };
        this.getConnectionState = function()                        { return _getInstance().getConnectionState(); };

        this.getNewState= function()                        { return _getInstance().getNewState(); };
        this.getViewportStartTime= function()                        { return _getInstance().getViewportStartTime(); };
        this.getTransitionStartTime= function() { return _getInstance().getTransitionStartTime(); };
        this.setMute            = function( muted )                 { return _getInstance().setMute( muted ); };
        this.getMute            = function()                        { return _getInstance().getMute(); };

        this.addErrorMessage    = function(code, technicalDetails)  { return _getInstance().addErrorMessage(code, technicalDetails); };
        this.login              = function( username, password )    { return _getInstance().login( username, password ); };
        this.loadViewport       = function( name )                  { return _getInstance().loadViewport( name ); };

        this.getViewport        = function()                        { return _getInstance().getViewport(); };
        this.getBuffer          = function()                        { return _getInstance().getBuffer(); };

        this.setViewport        = function( node )                  { return _getInstance().setViewport( node ); };
        this.setBuffer          = function( node )                  { return _getInstance().setBuffer( node ); };
        
        this.disableAction      = function( node )                  { return _getInstance().disableAction( node ); };
        this.enableAction       = function( node )                  { return _getInstance().enableAction( node ); };
        
        this.clearError = function() { return _getInstance().clearError(); };

        this.oncoreclientsetup  = function( serverUrl )             { };
        this.oncoreclientcreate = function( serverUrl, clientUrl )  { };

        this.onerror                    = function( code, techDetails ) {
            _state = "";
            this.transitionFinish( AS_START );
            this.addErrorMessage(code, techDetails);
        };
        
        this.getFrontendSetting = function(key) {
            return _frontendSettings[key];
        };
        
        /**
         * Use the given URL as a (JSON) resource for frontend settings.
         * 
         * Apply these to the current state. As there is no check for already existing settings, this function
         * should be called in the right order: overriding settings should be applied after defaults.
         * 
         * @param url the URL where the settings reside. Should return JSONP.
         * @param callback an optional callback function that will be called upon completion, even when given URL was empty or invalid.
         */
        this.applyFrontendSettings = function(url, callback) {
            // coarse sanity check
            if (/^(http|https):\/\//.test(url)) {
                // Get JSONP from URL, apply to _frontendSettings
                System.getJSONP(url, function(data) {
                    for (i in data) {
                     _frontendSettings[i] = data[i];
                    }
                    
                    if (callback) {
                        callback();
                    } 
                });
            } else {
                // do callback, even if there was no url to call to.
                if (callback) {
                    callback();
                }
            }
        };
        
        this.onloginsessioncreate       = function( userProfile ) {
            
            // Apply settings from urls by licensee, usergroup, user. Later ones override former ones.
            this.applyFrontendSettings(userProfile.licensee.licenseeFrontendSettingsUrl);
            this.applyFrontendSettings(userProfile.usergroup.usergroupFrontendSettingsUrl);
            this.applyFrontendSettings(userProfile.user.userFrontendSettingsUrl);
            
            this.setMute( false );
            this.setUserProfile( userProfile );
            System.setCookie( "username", $("username").value, $("remember").checked ? 1000 * 60 * 60 * 24 * 365 : -1 );
            System.setCookie( "phone", $("phone").value, $("remember").checked ? 1000 * 60 * 60 * 24 * 365 : -1 );
            //System.setCookie( "lidx", $("licenseeId").selectedIndex, $("remember").checked ? 1000 * 60 * 60 * 24 * 365 : -1 );
            System.setCookie( "remember", $("remember").checked, $("remember").checked ? 1000 * 60 * 60 * 24 * 365 : -1 );

            var url = autologinURL + "?user=" +  userProfile.user.username +  "&pswd=" + this.getPassword() + "&rnd=" + Math.random();
            Console.log( { "event": "onexternalloginsessionsetup", "url": autologinURL } );
            var autologin = document.createElement( "iframe" );
            autologin.style.position = "absolute";
            autologin.style.top = "-10000px";
            autologin.style.left = "-10000px";
            autologin.style.display = "none";
            autologin.setAttribute( "src", url );

            var that = this;
            eventPush( 
                autologin, 
                'load', 
                function()
                {
                    Console.log( { "event": "onexternalloginsessioncreate", "url": autologinURL } );
                    document.body.removeChild( autologin );
                } 
            );
            document.body.appendChild( autologin );

            var url = autologinURLSecure + "?user=" +  userProfile.user.username +  "&pswd=" + this.getPassword() + "&rnd=" + Math.random();
            Console.log( { "event": "onexternalloginsessionsetup", "url": autologinURLSecure } );
            var autologins = document.createElement( "iframe" );
            autologins.style.position = "absolute";
            autologins.style.top = "-10000px";
            autologins.style.left = "-10000px";
            autologins.style.display = "none";
            
            autologins.setAttribute( "src", url );

            var that = this;
            eventPush( 
                autologins, 
                'load', 
                function()
                {
                    Console.log( { "event": "onexternalloginsessioncreate", "url": autologinURLSecure } );
                    that.transitionFinish( AS_WELCOME );
                    document.body.removeChild( autologins );
                } 
            );
            document.body.appendChild( autologins );
        };
        
        this.onloginsessiondestroy      = function( reason )
        {

            this.setUserProfile( {} );
            Console.log( { "event": "onexternalloginsessionteardown", "url": autologoutURL } );
            var autologout = document.createElement( "iframe" );
            autologout.style.position = "absolute";
            autologout.style.top = "-10000px";
            autologout.style.left = "-10000px";
            autologout.style.display = "none";
            autologout.setAttribute( "src", autologoutURL + "?rnd=" + Math.random() );
            var that = this;
            eventPush( 
                autologout, 
                'load', 
                function()
                {
                    Console.log( { "event": "onexternalloginsessiondestroy", "url": autologoutURL } );
                    that.transitionFinish( AS_START );
                    document.body.removeChild( autologout );
                    $("actMute").style.display = "none";
                    $("actUnmute").style.display = "none";
                }
            );
            document.body.appendChild( autologout );

            if (ErrorCodeMappings.onloginsessiondestroy && ErrorCodeMappings.onloginsessiondestroy[reason]) {
                this.addErrorMessage(ErrorCodeMappings.onloginsessiondestroy[reason], "reason: " + reason);
            }
        };


        this.onworksessionsetup         = function(phonenumber) {
            this.setMute( false );
            this.setConnectionState( CS_DIALING );
            this.setPhonenumber( phonenumber );
            this.transitionFinish( AS_DIALING );
        };
        
        this.onworksessioncreate        = function( phonenumber )
        {
            this.setConnectionState( CS_CONNECTED );
            this.setPhonenumber( phonenumber );
            
            if ( this.idleTimer )
                clearTimeout( this.idleTimer );
            this.idleTimer = setTimeout( System.methodize( this, function() { this.transitionFinish( AS_IDLE ); } ), IDLE_TIMEOUT );
            
            this.transitionStart();
        };
        
        this.onworksessiondestroy       = function( reason )
        {
            this.setMute( false );
            if ( ErrorCodeMappings.onworksessiondestroy && ErrorCodeMappings.onworksessiondestroy[ reason ] )
                this.addErrorMessage(ErrorCodeMappings.onworksessiondestroy[reason], "reason: " + reason);
            
            this.setConnectionState( CS_DISCONNECTED );
            this.setCallState( CS_DISCONNECTED );
            this.setPhonenumber( false );
            if ( !this.submitted && 
                 ( this.getState() == AS_WORKING || 
                   this.getState() == AS_WRAPUP ) )
                return;
                    
            this.transitionFinish( AS_STOPPED );

        };

        
        this.onloginsessionmessage = function( type, message, duration )
        {
            alert( message );
        };
        
        this.onworksessionpauzerequested = function()
        {
            if ( this.getState() == AS_DONE )
                CoreClient.next();
        };
        this.onworksessionstoprequested = function()
        {
            CoreClient.next();
        };
        this.onworksessionpauze         = function()
        {
            if ( this.idleTimer )
                clearTimeout(this.idleTimer);
            this.transitionFinish(AS_PAUZED);
        };
        
        this.onworksessionresume         = function() {
            // Only handle this event in case of current state==PAUZED. It will occur when logged in (noPauze is sent) but then it has no meaning other than 'now you can start a pause'
            if (this.getState() == AS_PAUZED) {
                if ( this.idleTimer )
                    clearTimeout( this.idleTimer );
                this.idleTimer = setTimeout( System.methodize( this, function() { 
                    // check again whether we're actually still in pause-state... might be changed by now. (for example, when 'stopping' from within pause state)
                    if (this.getState() == AS_PAUZED) {
                        this.transitionFinish( AS_IDLE ); }
                } ), IDLE_TIMEOUT );
            }
        };

        this.onworksessionsuspended = function(reason) {
            if (this.idleTimer) {
                clearTimeout(this.idleTimer);
            }

            
            if (this.getState() == AS_DIALING) {
                this.transitionFinish( AS_IDLE );
            }

            if (ErrorCodeMappings.onworksessionsuspended && ErrorCodeMappings.onworksessionsuspended[reason]) {
                this.addErrorMessage(ErrorCodeMappings.onworksessionsuspended[reason], "reason: " + reason);
            }
        };

        this.onworksessionmute          = function()
        {
            this.setMute( true );
            $("actMute").style.display = "none";
            $("actUnmute").style.display = "block";
            if ( this.getConnectionState() != CS_DISCONNECTED )
                System.setClassName( $("actUnmute" ), "Action Active" );
        };
        
        this.onworksessionunmute        = function()
        {
            this.setMute( false );
            $("actMute").style.display = "block";
            $("actUnmute").style.display = "none";
            if ( this.getConnectionState() != CS_DISCONNECTED )
                System.setClassName( $("actMute" ), "Action" );
        };
        
        this.ontasksetup                = function( callInfo )
        {
            this.submitted = false;
            // See DCO-579
            // this.setCallState( CS_DISCONNECTED );
            
            if ( this.idleTimer )
            {
                clearTimeout( this.idleTimer );
                this.idleTimer = false;
            }
            

            if ( !callInfo ) {
                Console.log( { "event": "ontasksetup", "msg" : "No callInfo, will return." } );
                return;
            }
                
            this.setCallInfo(callInfo);

            this.transitionFinish( AS_WORKING );
            var profile = this.getUserProfile();
            var userId = ( profile && profile.user && profile.user.userId ) ? profile.user.userId : 0;
            var contactId = (callInfo) ? callInfo.contactId : 0;
            var serviceNumber = (callInfo && callInfo.service && callInfo.service.serviceNumber) ? callInfo.service.serviceNumber.replace(/^\+31/, "0") : "";
            var submitNotifyUrl = escape(CoreClient.getTargetUrl().replace(/CoreServer.html$/, "acs/callsheetSubmitted?username=transfers&password=Dohee5Mo&agentId=" + profile.user.userId));
            
            this.applyFrontendSettings(callInfo.project.frontendSettingsUrl, System.methodize(this, this.onprojectfrontendsettingsapply));
            
            if (this.isTunnelProject()) {
                // Do not use the submitNotifyUrl-method for tunnel-projects. They're safe already.
                submitNotifyUrl = "";
            }
            var url = (callInfo) ? (callInfo.project.projectUrl + "?csmode=random&annie=" + userId + 
                    "&contactId=" + contactId + 
                    "&cli=" + callInfo.cli + 
                    "&callId=" + callInfo.callId + 
                    "&submitNotifyUrl=" + submitNotifyUrl +
                    "&servicenr=" + serviceNumber + 
                    "&lookup=&pass=yes") : "about:blank";
            
            if (this.isTunnelProject()) {
                var coreProxyUrl = url.replace(/\/[^\/]*$/, "/CoreProxy.html"); // same as projectUrl but replace last file-part with 'coreProxy.html'.
                callsheetClient.initialize({
                    remoteUrl: coreProxyUrl,
                    handlers: {
                        "redirectToBelMeNiet": function() {
                            CoreClient.callTransferToIvr( 'bel_me_niet' );
                        },
                        "beforeSubmitCallsheet": System.methodize(this, this.ontaskbeforesubmit),
                        "afterSubmitCallsheet": System.methodize(this, this.ontaskaftersubmit),
                        "oncallsheetserverinitialize": System.methodize(this, this.oncallsheetinitialize),
                        "coldTransfer": function (phonenumber) {
                            CoreClient.callTransfer(phonenumber);
                        },
                        "consultSetup": function (phonenumber) {
                            CoreClient.consultConnect(phonenumber);
                        },
                        "consultDisconnect": function () {
                            CoreClient.consultDisconnect();
                        },
                        "transferToConsult": function () {
                            CoreClient.consultTransfer();
                        }
                    }
                });
            }
            
            this.callsheetLoading = true;

            var _viewport = ContactCenter.getViewport();
            var _buffer = ContactCenter.getBuffer();
            
            if ( _viewport )
                System.eventClear( _viewport, "load", ContactCenter.onviewportcreate );

            if ( _buffer )
            {
                System.eventClear( _buffer, "load", ContactCenter.onviewportcreate );
                document.body.removeChild( _buffer );
            }
            _buffer = document.createElement( "iframe" );
            _buffer.isLoading = true;
            _buffer.setAttribute( "id", "Buffer" );
            _buffer.setAttribute( "frameBorder", 0 );
            _buffer.setAttribute( "src", url );
            _buffer.style.visibility = "visible";
            _buffer.style.display = "none";
            _buffer.style.width = ( document.body.clientWidth - 61 ) + "px";;
            _buffer.submitted = false;
            document.body.appendChild( _buffer );

            System.eventSet( _buffer, "load", ContactCenter.onviewportcreate );

            ContactCenter.setBuffer( _buffer );
            Console.log( { "event": "onviewportsetup", "url": url } );
            _loader.style.display = "block";
            _viewportStartTime = Number( new Date );
        };
        
        // Callback that is executed once project-specific frontendsettings have been applied
        this.onprojectfrontendsettingsapply = function() {
            if (!this.getFrontendSetting("defaultRecordingStateOn")) {
                CoreClient.callStopRecording();
            }
        };
        
        this.oncallsheetinitialize = function() {
            ContactCenter.setState( ContactCenter.getNewState() );
            ContactCenter.setCallState( ContactCenter.getCallState() );
            this.callsheetLoading = false;
            _viewport.style.display = "block";
            _loader.style.display = "none";
            _viewport.isLoading = false;
            _viewport.style.display = "block";
        };
        
        this.ontaskbeforesubmit = function() {
            CoreClient.submit();
            this.transitionStart();
        };
        
        this.ontaskaftersubmit = function() {
        };
        
        this.ontasksubmitCoreAck               = function()
        {
            if (this.isTunnelProject()) {
                callsheetClient.destroy();
            }
            
            this.submitted = true;
            if ( this.getConnectionState() == CS_DISCONNECTED )
            {
                //CoreClient.next();
                //this.transitionStart();
                this.transitionFinish( AS_STOPPED );
            }
            else if ( this.getCallState() != CS_CONNECTED && this.getCallState() != CS_DIALING )
            {
                this.transitionStart();
                this.transitionFinish( AS_DONE );
                Console.log( { "event": "ontransitionfinish", "newState": AS_DONE, "duration": Number( new Date ) - ContactCenter.getTransitionStartTime() } );
            }
            else 
            {
                this.transitionFinish( AS_WRAPUP );
                Console.log( { "event": "ontransitionfinish", "newState": AS_WRAPUP, "duration": Number( new Date ) - ContactCenter.getTransitionStartTime() } );

                /*
                 * If current task is not an inbound, explicitly disable the blacklist-button.
                 * As the button should be available after task submit (but only for inbound), it cannot be listed in the 'disabled' buttons in that state.
                 * That means it will be enabled every time the 'wrapup' state is entered, which is not desired.
                 */
                if (this.getCallInfo()
                        && this.getCallInfo().project
                        && /inbound/i.test(this.getCallInfo().project.projectType)) {
                    $("actBlockCaller").style.display = "block";
                    $("actTransferToIVRApp").style.display = "none";
                    if (this.getCallInfo().service && this.getCallInfo().service.serviceBlackListingAllowed) {
                        this.enableAction($("actBlockCaller"));
                    }
                } else {
                    $("actBlockCaller").style.display = "none";
                    $("actTransferToIVRApp").style.display = "block";
                    this.disableAction($("actBlockCaller"));
                }

            }
        };

        
        this.oncallsetup                = function()
        {
            if ( this.getConnectionState() != CS_CONNECTED && this.getConnectionState() != CS_MUTED )
                return;
                
            this.setCallState( CS_DIALING );
        };
        
        this.oncallcreate               = function()
        {
            if ( this.getConnectionState() != CS_CONNECTED && this.getConnectionState() != CS_MUTED )
                return;

            
            if ( this.idleTimer )
            {
                clearTimeout( this.idleTimer );
                this.idleTimer = false;
            }
            
            this.setCallState( CS_CONNECTED );
        };
        
        this.oncalldestroy              = function( reason )
        {
            var code = false;
            if ( ErrorCodeMappings.oncalldestroy && ErrorCodeMappings.oncalldestroy[ reason ] )
                code = ErrorCodeMappings.oncalldestroy[ reason ];

            // Do not show a message in case of autonextrecord.
            var callInfo = this.getCallInfo();
            if (callInfo && callInfo.project && callInfo.project.projectAutoNextRecord) {
                code = false;
            }
            
            if ( this.getConnectionState() != CS_CONNECTED && this.getConnectionState() != CS_MUTED )
            {
                if ( code !== false )
                    this.addErrorMessage(code, "reason: " + reason);
                return true;
            }

            this.setCallState( CS_DISCONNECTED );
            if ( this.submitted )
            {
                this.transitionFinish( AS_DONE );
                Console.log( { "event": "ontransitionfinish", "newState": AS_DONE, "duration": Number( new Date ) - ContactCenter.getTransitionStartTime() } );
            }
            if ( code !== false )
                this.addErrorMessage(code, "reason: " + reason);
        };
        this.oncallrecordstart          = function()
        {
            this.setRecording( true );
        };
        
        this.oncallrecordstop           = function()
        {
            this.setRecording( false );
        };
        
        this.oncallerblacklisted        = function()
        {
            this.disableAction($("actBlockCaller"));
        };
        
        this.oncallhold                 = function()
        {
            //this.setCallState( CS_ONHOLD );
            $("actHold").style.display = "none";
            $("actUnhold").style.display = "block";
        };
        
        this.oncallunhold               = function()
        {
            //this.setCallState( CS_CONNECTED );
            $("actHold").style.display = "block";
            $("actUnhold").style.display = "none";
        };
        
        this.oncalltransfer             = function()
        {
            this.setCallState( CS_TRANSFERRED );
        };

        this.onconsultallowed = function()
        {
            this.disableAction($("actConsultDisconnect"));
            callsheetClient.sendEvent({"event" : "consultallowed"}, true);

        };
        this.onconsultnotallowed = function()
        {
            this.disableAction($("actConsultDisconnect"));
        };
        this.onconsultsetup             = function()
        {
            this.enableAction($("actConsultDisconnect"));
            callsheetClient.sendEvent({"event" : "consultsetup"}, true);
        };

        this.onconsultcreate            = function()
        {
        };

        this.onconsultdestroy           = function()
        {
        };

        this.onfailure           = function( url, message, id, status )
        {
            var errorCode;
            var agentTerminalErrorCode = parseInt(id);
            switch(agentTerminalErrorCode) {
                case 10:
                    errorCode = 900;
                    message = "Authentication failure";
                    break;
                case 11:
                    errorCode = 912;
                    message = "Bad token data";
                    break;
                case 20:
                    errorCode = 911;
                    message = "Http Session Dirty";
                    break;
                case 30:
                    errorCode = 913;
                    message = "Terminal session not found";
                    break;
                case 40:
                    errorCode = 909;
                    message = "Unknown command";
                    break;
                case 50:
                    errorCode = 908;
                    message = "Session stopped";
                    break;
            }
            this.addErrorMessage(errorCode, message + ", Agent Terminal error code " + agentTerminalErrorCode);
            this.transitionCancel();
        };
        this.oncommandfinish = function(cmd) {
            if (cmd == CMD_NEXT) {
                if (this.getConnectionState() == CS_DISCONNECTED)
                {
                    this.transitionFinish( AS_STOPPED );
                    return;
                }
                if (this.idleTimer)
                    clearTimeout( this.idleTimer );
                this.idleTimer = setTimeout( System.methodize( this, function() {
                    this.transitionFinish( AS_IDLE );
                }), IDLE_TIMEOUT );
            }
        };

        this.oncommandstart                  = function( cmd )
        {
            this.clearError();

             
            switch( cmd )
            {
                case CMD_CALL_BLACKLIST:
                    this.disableAction($("actBlockCaller"));
                    break;
                case CMD_CALL_DISCONNECT:
                case CMD_CALL_TRANSFER_TO_IVRAPP:
                    System.setClassName( $("actStartRecording"), "Action Disabled" );
                    System.setClassName( $("actStopRecording"), "Action Disabled" );
                    System.setClassName( $("actHold"), "Action Disabled" );
                    System.setClassName( $("actUnhold"), "Action Disabled" );
                    System.setClassName( $("actTransferToIVRApp"), "Action Disabled");
                    System.setClassName( $("actDisconnectCaller"), "Action Disabled" );
                    break;
                case CMD_LOGIN:
                    System.setClassName( $("actLogin"), "Action Disabled" );
                    $("username").setAttribute( "disabled", "disabled" );
                    $("password").setAttribute( "disabled", "disabled" );
                    $("phone").setAttribute( "disabled", "disabled" );
                    $("remember").setAttribute( "disabled", "disabled" );
                    //$("licenseeId").setAttribute( "disabled", "disabled" );
                case CMD_CONNECT:
                case CMD_DISCONNECT:
                case CMD_LOGOUT:
                case CMD_RESUME:
                case CMD_PAUZE:
                case CMD_NEXT:                      
                    return ContactCenter.transitionStart();
            }
            return true;
        };
        
        this.onconsulttransfer          = function()
        {
            this.setCallState( CS_TRANSFERRED );
        };
        
        this.onviewportcreate            = function( evt )
        {
            Console.log( { "event": "onviewportcreate", "msg" : "origin event: " + evt.type});
            
//            if (!ContactCenter.isTunnelProject()) {
//                if ( !this.callsheetLoading && ContactCenter.getState() == AS_WORKING )
//                {
//    
//                    ContactCenter.transitionStart();
//                    CoreClient.submit();
//                    if ( ContactCenter.getConnectionState() != CS_DISCONNECTED )
//                        return; 
//                }
//            }
            if ( !evt ) 
                evt = window.event;
            
            var target =  ( evt.target ) ? evt.target : evt.srcElement;

            var _viewport = ContactCenter.getViewport();
            var _buffer = ContactCenter.getBuffer();

            if ( _viewport && _buffer )
                _viewport.setAttribute( "id", "ViewportDelete" );
                
            if ( _buffer )
                _buffer.setAttribute( "id", "Viewport" );

            if ( _viewport && _buffer )
            {
                System.eventClear( _viewport, "load", ContactCenter.onviewportcreate );
                if ( parent ) 
                    parent.document.body.removeChild( _viewport );
                else
                    document.body.removeChild( _viewport );
                ContactCenter.setViewport( null ); 
                _viewport = null;
            }
            if ( _buffer )
            {
                _buffer.style.width = ( document.body.clientWidth - 61 ) + "px";
                _viewport = _buffer;
                ContactCenter.setViewport( _buffer );
                _buffer = null;
                ContactCenter.setBuffer( null );
            }
                
            if ( target == null )
                target = _viewport;
            
            if ( _viewport && _viewport.isLoading )
            {
                /*
                Console.log( { "event": "onviewportcreate", "url": target.src, "duration": Number( new Date ) - ContactCenter.getViewportStartTime() } );
                if ( ContactCenter.getNewState() == AS_WORKING ) Console.log( { "event": "ontaskcreate" } );
                Console.log( { "event": "ontransitionfinish", "newState": ContactCenter.getNewState(), "duration": Number( new Date ) - ContactCenter.getTransitionStartTime() } );
                */
                ContactCenter.oncallsheetinitialize(); // delegate to the new event handler
                return;
            }
        };
    };
})();

var callsheetClient = {
    _socket: null,
    _eventHandlers: [],
    _buffer: [],
    
    initialize: function(config) {
        var that = this; 
        // first register the handlers, to not lose any events. 
        for (var event in config.handlers) {
            this.registerEvent(event, config.handlers[event]);
        }
        
        this._socket = new easyXDM.Socket({
            channel: "callsheetCommunication", // neccessary to let coreProxy refer to it
            remote: config.remoteUrl,
            onMessage: function(message, origin){
                that.receive(message);
            }
        });
        
        // Send potentially buffered events
        for (i in this._buffer) {
            this.sendEvent(this._buffer[i]);
        }
        this._buffer = [];
        this.sendEvent({"event" : "oncallsheetclientinitialize"});
    },
    
    receive: function(message) {
        Console.log({"event" : "oncallsheetevent", "message" : message});
        var eventObj = System.parse(message);

        var params = Array();
        for (var key in eventObj) {
            if (key != "event") {
                params.push(eventObj[key]);
            }
        }

        if (this._eventHandlers[eventObj.event]) {
            // Notify observers..
            for (var i in this._eventHandlers[eventObj.event]) {
                var handler = this._eventHandlers[eventObj.event][i];
                //console.log("applying params " + params + " to function " + handler);
                if (handler) {
                    handler.apply(handler, params);
                }
            }
        }

    },
    sendEvent: function(event, bufferIfNotReady) {
        if (this._socket) {
            var message = System.stringify(event);
            this._socket.postMessage(message);
        } else if (bufferIfNotReady) {
            this._buffer.push(event);
        }
        // else: message will be lost.
    },
    
    registerEvent: function(event, handler) {
        if (!this._eventHandlers[event])
            this._eventHandlers[event] = Array();
        this._eventHandlers[event].push(handler);
    },
    
    destroy: function() {
        this._socket.destroy();
        this._socket = null;
        this._eventHandlers = [];
        this._buffer = [];
    }
};
