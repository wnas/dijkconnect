/* Maven artifact DCO Core - AgentTerminal service version 1.2.2 */
// DCOCall ///////////////////////////////////////////////////////////////////////////////////////////////////////
var 
    // Call Types
    CT_INBOUND             = 0,
    CT_OUTBOUND            = 1, 

    // Call States
    CS_SETUP               = 0,
    CS_CALL                = 1,
    CS_ONHOLD              = 2,
    CS_NOCALL              = 3;

var DCOCall = (function()
{
    var 
        _instance       = null,
        _type           = null,
        _state          = CS_NOCALL,
        _callOnHold     = false,
        _callInfo       = null;
    
    // Implementation ///////////////////////////////////////////////////////////////////////////////////////////////// 
    function _DCOCall()
    {
        this.create         = function( phoneNumber) {};
        
        this.destroy        = function() {
            CoreClient.send( CMD_CALL_DISCONNECT );
        };
        
        this.blackList      = function( blackListGroup )
        {
            CoreClient.send(
                {
                    "command"       : CMD_CALL_BLACKLIST,
                    "blackListGroup": blackListGroup
                }
            );
        };
        
        this.hold           = function() { CoreClient.send( CMD_CALL_HOLD ); };
        this.unhold         = function() { CoreClient.send( CMD_CALL_UNHOLD ); };
        
        this.transferToIvr = function( appName )
        {
            CoreClient.send(
                {
                    "command"       : CMD_CALL_TRANSFER_TO_IVRAPP,
                    "application"   : appName
                }
            );
        };
        this.coldTransfer       = function( targetNumber, ringTimeout )
        {
            CoreClient.send(
                {
                    "command"       : CMD_CALL_TRANSFER,
                    "targetNumber"  : targetNumber,
                    "ringTimeout"   : ringTimeout
                }
            );
        };
        
        this.getType        = function() { return _type; };
        this.getState       = function() { return _state; };
        this.getSubmitted   = function() { return _submitted; };
        this.getCallOnHold  = function() { return _callOnHold; };
        this.getCallInfo    = function() { return _callInfo; };

    }

    // Interface ////////////////////////////////////////////////////////////////////////////////////////////////////// 
    return new function()     
    {
        var _getInstance = function()
        {
            if ( _instance == null )
            {
                _instance = new _DCOCall();
                _instance.constructor = null;
            }
            return _instance;
        };
        this.create         = function( phoneNumber )   { return _getInstance().create( phoneNumber ); };
        this.destroy        = function()                { return _getInstance().destroy(); };
        this.blackList      = function( blackListGroup ){ return _getInstance().blackList( blackListGroup ); };
        this.hold           = function()                { return _getInstance().hold(); };
        this.unhold         = function()                { return _getInstance().unhold(); };
        this.coldTransfer       = function( targetNumber, 
                                        ringTimeout )   { return _getInstance().transfer( targetNumber, ringTimeout ); };
        this.transferToIvr  = function( appName )       { return _getInstance().transferToIvr( appName ); };
        this.getType        = function()                { return _getInstance().getType(); };
        this.getState       = function()                { return _getInstance().getState(); };
        this.getSubmitted   = function()                { return _getInstance().getSubmitted(); };
        this.getCallOnHold  = function()                { return _getInstance().getCallOnHold(); };
        this.getCallInfo    = function()                { return _getInstance().getCallInfo(); };
    };   
})();

var 
    // Call States
    CS_SETUP               = 0,
    CS_CALL                = 1,
    CS_NOCALL              = 2,
    CS_TRANSFERRED         = 3;



var DCOConsult = (function()
{
    var 
        _instance       = null,
        _state          = CS_NOCALL,
        _targetNumber   = null,
        _ringTimeout    = null;
    
    // Implementation ///////////////////////////////////////////////////////////////////////////////////////////////// 
    function _DCOConsult()
    {
        this.create = function( targetNumber )    
        {  
            CoreClient.send(
                {
                    "command"      : CMD_CONSULT_CONNECT,


                    "phoneNumber"  : targetNumber
                }
            );
            
        };
        
        this.destroy = function() {
            CoreClient.send(CMD_CONSULT_DISCONNECT);            
        };
        
        this.transfer = function() {
            CoreClient.send(CMD_CONSULT_TRANSFER);
        };

        this.getState       = function()                { return _state; };
        this.getPhoneNumber = function()                { return _phoneNumber; };
        this.getRingTimeout = function()                { return _ringTimeout; };
    }

    // Interface ////////////////////////////////////////////////////////////////////////////////////////////////////// 
    return new function()     
    {
        var _getInstance = function()
        {
            if ( _instance == null )
            {
                _instance = new _DCOConsult();
                _instance.constructor = null;
            }
            return _instance;
        };
        this.create         = function( targetNumber )  { return _getInstance().create( targetNumber ); };

        this.destroy        = function()                { return _getInstance().destroy(); };
        this.transfer       = function()                { return _getInstance().transfer(); };
        this.getState       = function()                { return _getInstance().getState(); };
        this.getPhoneNumber = function()                { return _getInstance().getPhoneNumber(); };
        this.getRingTimeout = function()                { return _getInstance().getRingTimeout(); };
    };
})();
 
// CoreClient ////////////////////////////////////////////////////////////////////////////////////////////////////
var CoreClient = (function()
{
    var 
        _instance       = null,
        _targetURL      = null,
        _observers      = Array(),
        _callback       = null;
    
    // Implementation ///////////////////////////////////////////////////////////////////////////////////////////////// 
    function _CoreClient()
    {
        this.initialize = function( url, callback )
        {
            // If there already is an IFRAME for @url, use that instead
            if ( _targetURL == url && callback ) 
                return callback();
                

            _callback               = callback;
            _targetURL              = url;

            System.receiveMessage( function( message ) { CoreClient.receive( message.data ); }, _targetURL + "#" + document.location.href);
            return true;
        };
        
        this.finalize = function() {
        };
        
        this._dispatch = function( msg )
        {
            if ( msg.event == "oncoreclientcreate" && _callback ) 
                _callback();

            // Send the message to the console
            Console.log( msg );

            // Parse given parameters into a array
            var params = Array();
            for ( var key in msg )
                if ( key != "event" )
                    params.push( msg[ key ] );

            // Notify observers..
            for ( var key in _observers )
            {
                var f = CoreClient.getObserver( key );
                if ( f && f[ msg.event ] )
                    f[ msg.event ].apply( f, params );
            }
        };

        /**
         * send message/command to CoreServer.
         * @param message can be either an object (hash) containing a 'command'-key+value 
         * and more arguments OR can be a string that is only the command name.  
         */
        this.send = function(message) {
            window.setTimeout(function() {
                System.postMessage( 
                    ( typeof message === "object" ) ? System.stringify( message ) :  '{"command":"' + message + '"}', 
                    _targetURL
                );
            }, 0);
        };
        
        /**
         * Receive a message from CoreServer.
         * @param message the message as stringified json.
         */
        this.receive = function( message )
        {
            return setTimeout(System.methodize(this, function() {
                this._dispatch(System.parse(message));
            }), 0);
        };
        
        this.addObserver = function( token, obj )
        { 
            _observers[ token ] = obj;
        };
        
        this.getObserver = function( token )                   
        { 
            return _observers[ token ];
        };
        this.removeObserver = function( token )                   
        { 
            _observers[ token ] = null;
        };

        this.login              = function( user, pass, lid, url ) 
        { 
            var user1 = user;
            var pass1 = pass;
            var lid1 = lid;
            this._dispatch( { "event": "oncoreclientsetup" } );
            CoreClient.initialize( url, 
                function() 
                { 
                    CoreClient.send( 
                        { 
                            "command"       : CMD_LOGIN, 
                            "username"      : user1, 
                            "password"      : pass1,
                            "licenseeId"    : lid1 
                        } 
                    );
                }
            ); 
        };
        
        this.logout             = function() { CoreClient.send( CMD_LOGOUT ); };
        this.connect            = function( phoneNumber ) 
        { 
           if ( phoneNumber == "" )
                return CoreClient.send( { "command"       : CMD_CONNECT } );
            
            return CoreClient.send( 
                {
                    "command"       : CMD_CONNECT,
                    "phoneNumber"   : phoneNumber
                }
            );
        };
        this.disconnect         = function() { CoreClient.send( CMD_DISCONNECT ); };
        this.pauze              = function() { CoreClient.send( CMD_PAUZE ); };
        this.resume             = function() { CoreClient.send( CMD_RESUME ); };
        this.mute               = function() { CoreClient.send( CMD_MUTE ); };
        this.unmute             = function() { CoreClient.send( CMD_UNMUTE ); };
        this.submit             = function() { CoreClient.send( CMD_SUBMIT ); };
        this.next               = function() { CoreClient.send( CMD_NEXT ); };
        this.callConnect        = function( phoneNumber ) { return DCOCall.create( phoneNumber ); };
        this.callDisconnect     = function() { return DCOCall.destroy(); };
        this.callTransfer       = function( phoneNumber ) { return DCOCall.coldTransfer( phoneNumber ); };
        this.callTransferToIvr  = function( appName )     { return DCOCall.transferToIvr( appName ); };
        this.callBlackList      = function( blackListGroup ) { return DCOCall.blackList( blackListGroup ); };
        this.callHold           = function() { return DCOCall.hold(); };
        this.callUnhold         = function() { return DCOCall.unhold(); };
        this.callStartRecording = function() { return CoreClient.send( CMD_CALL_RECORD_START ); };
        this.callStopRecording  = function() { return CoreClient.send( CMD_CALL_RECORD_STOP ); };

        this.consultConnect     = function( phoneNumber ) { return DCOConsult.create( phoneNumber ); };
        this.consultDisconnect  = function() { return DCOConsult.destroy(); };
        this.consultTransfer    = function() {  return DCOConsult.transfer(); };

        this.getTargetUrl       = function() { return _targetURL; };
    }

    // Interface ////////////////////////////////////////////////////////////////////////////////////////////////////// 
    return new function()     
    {
        var _getInstance = function()
        {
            if ( _instance == null )
            {
                _instance = new _CoreClient();
                _instance.constructor = null;
            }
            return _instance;
        };

        this.initialize         = function( url, callback )         { return _getInstance().initialize( url, callback ); };
        this.login              = function( user, pass, lid, url )  { return _getInstance().login( user, pass, lid, url ); };
        this.connect            = function( phoneNumber )           { return _getInstance().connect( phoneNumber ); };
        this.send               = function( command )               { return _getInstance().send( command ); };
        this.receive            = function( events )                { return _getInstance().receive( events ); };
        this.callConnect        = function( phoneNumber )           { return _getInstance().callConnect( phoneNumber ); };
        this.callDisconnect     = function()                        { return _getInstance().callDisconnect(); };
        this.callTransfer       = function( phoneNumber )           { return _getInstance().callTransfer( phoneNumber ); };
        this.callHold           = function()                        { return _getInstance().callHold(); };
        this.callUnhold         = function()                        { return _getInstance().callUnhold(); };
        this.callBlackList      = function( blackListGroup )        { return _getInstance().callBlackList( blackListGroup ); };
        this.callTransferToIvr  = function( appName )               { return _getInstance().callTransferToIvr( appName ); };
        this.callStartRecording = function()                        { return _getInstance().callStartRecording(); };
        this.callStopRecording  = function()                        { return _getInstance().callStopRecording(); };
        this.consultConnect     = function( phoneNumber )           { return _getInstance().consultConnect( phoneNumber ); };
        this.consultDisconnect  = function()                        { return _getInstance().consultDisconnect(); };
        this.consultTransfer    = function()                        { return _getInstance().consultTransfer(); };
        this.mute               = function()                        { return _getInstance().mute(); };
        this.unmute             = function()                        { return _getInstance().unmute(); };
        this.pauze              = function()                        { return _getInstance().pauze(); };
        this.resume             = function()                        { return _getInstance().resume(); };
        this.submit             = function()                        { return _getInstance().submit(); };
        this.next               = function()                        { return _getInstance().next(); };
        this.disconnect         = function()                        { return _getInstance().disconnect(); };
        this.logout             = function()                        { return _getInstance().logout() ; };
        this.finalize           = function()                        { return _getInstance().finalize(); };
        this.addObserver        = function( token, obj )            { return _getInstance().addObserver( token, obj); };
        this.removeObserver     = function( token )                 { return _getInstance().removeObserver( token ); };
        this.getObserver        = function( token )                 { return _getInstance().getObserver( token ); };
        this.getTargetUrl       = function()                        { return _getInstance().getTargetUrl(); };

    };
})();

