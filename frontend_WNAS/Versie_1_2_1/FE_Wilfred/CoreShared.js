/**
 * CoreShared contains all 'constants'
 * 
 * @author Tim Heesters
 */
/* Maven artifact DCO Core - AgentTerminal service version 1.2.1-1 */
 
// CoreServer Activate Session Retry Configuration ///////////////////////////////////////////////////////////////
var CS_ACTIVATE_SESSION_RETRIES                         = 3,        // # of reties
    CS_ACTIVATE_SESSION_BACKOFF                         = 1000;     // timeout = backoff * ( # tries - 1 ) in ms
     
// Commands //////////////////////////////////////////////////////////////////////////////////////////////////////
var CMD_LOGIN                                           = "agentLogIn",
    CMD_LOGOUT                                          = "agentLogOff",
    CMD_CONNECT                                         = "callAgentPhone",
    CMD_DISCONNECT                                      = "disconnectAgentPhone",
    CMD_RESUME                                          = "stopPauze",
    CMD_PAUZE                                           = "requestPauze",
    CMD_PAUZE_CANCEL                                    = "cancelPauze", 
    CMD_NEXT                                            = "nextTask",
    CMD_SUBMIT                                          = "submit",
    CMD_MUTE                                            = "muteAgentPhone",
    CMD_UNMUTE                                          = "unmuteAgentPhone",

    CMD_CALL_CONNECT                                    = "connectCaller",
    CMD_CALL_DISCONNECT                                 = "disconnectCaller",            
    CMD_CALL_BLACKLIST                                  = "blackList",
    CMD_CALL_HOLD                                       = "callOnHold",
    CMD_CALL_UNHOLD                                     = "callReConnect",
    CMD_CALL_TRANSFER                                   = "coldTransfer",
    CMD_CALL_TRANSFER_TO_IVRAPP                         = "redirectToIvrApplication",
    CMD_CONSULT_CONNECT                                 = "consultExtern",
    CMD_CONSULT_DISCONNECT                              = "disconnectConsult",
    CMD_CONSULT_TRANSFER                                = "warmTransfer";

    CMD_CALL_RECORD_START                               = "startRecording";
    CMD_CALL_RECORD_STOP                                = "stopRecording";
// Events ////////////////////////////////////////////////////////////////////////////////////////////////////////
var EVT_LOAD                                            = "onload",
    EVT_UNLOAD                                          = "onunload",
    EVT_LS_CREATE                                       = "agentLoggedIn",
    EVT_LS_MESSAGE                                      = "agentMessage",
    EVT_LS_DESTROY                                      = "agentLoggedOff",
    EVT_WS_SETUP                                        = "agentPhoneDialing",
    EVT_WS_CREATE                                       = "agentPhoneConnected",
    EVT_WS_DESTROY                                      = "agentPhoneStartable",
    EVT_WS_SUSPENDED                                    = "agentPhoneSuspended",
    EVT_WS_MUTE                                         = "agentPhoneMuted",
    EVT_WS_UNMUTE                                       = "agentPhoneUnmuted",
    EVT_WS_PAUZE                                        = "pauze",
    EVT_WS_PAUZE_REQUESTED                              = "pauzeRequested",
    EVT_WS_STOP_REQUESTED                               = "waitForTaskEnd",
    EVT_WS_RESUME                                       = "noPauze",
    EVT_TASK_SETUP                                      = "callsheet",
    EVT_TASK_SUBMIT                                     = "submitted",
    
    EVT_CONSULT_ALLOWED                                 = "consultAllowed",
    EVT_CONSULT_NOTALLOWED                              = "consultNotAllowed",
    EVT_CONSULT_SETUP                                   = "consultSetup",
    EVT_CONSULT_CONNECTED                               = "consultConnected",
    EVT_CONSULT_ONHOLD                                  = "consultOnHold",
    EVT_CONSULT_STOPPED                                 = "consult",
    EVT_CALL_SETUP                                      = "callSetup",
    EVT_CALL_CREATE                                     = "call",
    EVT_CALL_ONHOLD                                     = "callOnHold",
    EVT_CALL_RECONNECTED                                = "callReconnected",
    EVT_CALL_DESTROY                                    = "noCall",

    EVT_CALLER_BLACKLISTED                              = "callerBlacklisted",

    EVT_CALL_RECORD_STARTED                             = "recordingStarted",
    EVT_CALL_RECORD_STOPPED                             = "recordingStopped",

    EVT_CALL_SETUP_SUBMITTED                            = "submittedCallSetup",
    EVT_CALL_CREATE_SUBMITTED                           = "submittedCall",
    EVT_CALL_DESTROY_SUBMITTED                          = "submittedNoCall";

// Message ///////////////////////////////////////////////////////////////////////////////////////////////////////
var MSG_ONBEFOREUNLOAD                                  = "Er kunnen gegevens verloren gaan als u doorgaat met het sluiten van dit venster.";
    
// HTTP Endpoints ////////////////////////////////////////////////////////////////////////////////////////////////
var HTTP_ENDPOINT_EVENTS                                = "/agentterminal-web/comet",
    HTTP_ENDPOINT_COMMANDS                              = "/agentterminal-web/agentTerminalService",
    HTTP_ENDPOINT_LOGIN                                 = "/agent-web/authenticate";
    HTTP_ENDPOINT_CONSOLE_DUMPER                        = "/frontend-console-dumper.php";
    
// Endpoints /////////////////////////////////////////////////////////////////////////////////////////////////////
var ENDPOINT_AGENT                                      = "agent",
    ENDPOINT_CALL                                       = "call",
    ENDPOINT_AGENTPHONE                                 = "agentphone",
    ENDPOINT_PAUZE                                      = "pause",
    ENDPOINT_CONSULT                                    = "consult";
    
// Mappings //////////////////////////////////////////////////////////////////////////////////////////////////////
    
// Map parameterless notify-events to their client event-handlers
var NOTIFY_EVENT_MAP = {};
    NOTIFY_EVENT_MAP[ EVT_WS_CREATE ]                   = "onworksessioncreate";
    NOTIFY_EVENT_MAP[ EVT_WS_MUTE ]                     = "onworksessionmute";
    NOTIFY_EVENT_MAP[ EVT_WS_UNMUTE ]                   = "onworksessionunmute";
    NOTIFY_EVENT_MAP[ EVT_CONSULT_ALLOWED ]             = "onconsultallowed";
    NOTIFY_EVENT_MAP[ EVT_CONSULT_SETUP ]               = "onconsultsetup";
    NOTIFY_EVENT_MAP[ EVT_CONSULT_CONNECTED ]           = "onconsultcreate";
    NOTIFY_EVENT_MAP[ EVT_CONSULT_NOTALLOWED ]          = "onconsultnotallowed";
    NOTIFY_EVENT_MAP[ EVT_CALL_RECORD_STARTED ]         = "oncallrecordstart";
    NOTIFY_EVENT_MAP[ EVT_CALL_RECORD_STOPPED ]         = "oncallrecordstop";
    NOTIFY_EVENT_MAP[ EVT_CALLER_BLACKLISTED ]          = "oncallerblacklisted";
    
// Map commands to their endpoints
var COMMAND_ENDPOINT_MAP = {};
    COMMAND_ENDPOINT_MAP[ CMD_LOGIN ]                   = ENDPOINT_AGENT;
    COMMAND_ENDPOINT_MAP[ CMD_LOGOUT ]                  = ENDPOINT_AGENT;
    COMMAND_ENDPOINT_MAP[ CMD_CONNECT ]                 = ENDPOINT_AGENTPHONE;
    COMMAND_ENDPOINT_MAP[ CMD_DISCONNECT ]              = ENDPOINT_AGENTPHONE;
    COMMAND_ENDPOINT_MAP[ CMD_MUTE ]                    = ENDPOINT_AGENTPHONE;
    COMMAND_ENDPOINT_MAP[ CMD_UNMUTE ]                  = ENDPOINT_AGENTPHONE;
    COMMAND_ENDPOINT_MAP[ CMD_PAUZE ]                   = ENDPOINT_PAUZE;
    COMMAND_ENDPOINT_MAP[ CMD_PAUZE_CANCEL ]            = ENDPOINT_PAUZE;
    COMMAND_ENDPOINT_MAP[ CMD_RESUME ]                  = ENDPOINT_PAUZE;
    COMMAND_ENDPOINT_MAP[ CMD_NEXT ]                    = ENDPOINT_CALL;
    COMMAND_ENDPOINT_MAP[ CMD_SUBMIT ]                  = ENDPOINT_CALL;
    COMMAND_ENDPOINT_MAP[ CMD_CALL_DISCONNECT ]         = ENDPOINT_CALL;
    COMMAND_ENDPOINT_MAP[ CMD_CALL_BLACKLIST ]          = ENDPOINT_CALL;
    COMMAND_ENDPOINT_MAP[ CMD_CALL_HOLD ]               = ENDPOINT_CALL;
    COMMAND_ENDPOINT_MAP[ CMD_CALL_UNHOLD ]             = ENDPOINT_CALL;
    COMMAND_ENDPOINT_MAP[ CMD_CALL_TRANSFER ]           = ENDPOINT_CALL;
    COMMAND_ENDPOINT_MAP[ CMD_CALL_RECORD_START ]       = ENDPOINT_CALL;
    COMMAND_ENDPOINT_MAP[ CMD_CALL_RECORD_STOP ]        = ENDPOINT_CALL;
    COMMAND_ENDPOINT_MAP[ CMD_CALL_TRANSFER_TO_IVRAPP ] = ENDPOINT_CALL;
    COMMAND_ENDPOINT_MAP[ CMD_CONSULT_TRANSFER ]        = ENDPOINT_CONSULT;
    COMMAND_ENDPOINT_MAP[ CMD_CONSULT_CONNECT ]         = ENDPOINT_CONSULT;
    COMMAND_ENDPOINT_MAP[ CMD_CONSULT_DISCONNECT ]      = ENDPOINT_CONSULT;

// Map events to their endpoints
var EVENT_ENDPOINT_MAP = {};
    EVENT_ENDPOINT_MAP[ EVT_LS_CREATE ]                 = ENDPOINT_AGENT;
    EVENT_ENDPOINT_MAP[ EVT_LS_MESSAGE ]                = ENDPOINT_AGENT;
    EVENT_ENDPOINT_MAP[ EVT_LS_DESTROY ]                = ENDPOINT_AGENT;
    EVENT_ENDPOINT_MAP[ EVT_LS_MESSAGE ]                = ENDPOINT_AGENT;
    EVENT_ENDPOINT_MAP[ EVT_WS_SETUP ]                  = ENDPOINT_AGENTPHONE;
    EVENT_ENDPOINT_MAP[ EVT_WS_CREATE ]                 = ENDPOINT_AGENTPHONE;
    EVENT_ENDPOINT_MAP[ EVT_WS_DESTROY ]                = ENDPOINT_AGENTPHONE;
    EVENT_ENDPOINT_MAP[ EVT_WS_SUSPENDED ]              = ENDPOINT_AGENTPHONE;
    EVENT_ENDPOINT_MAP[ EVT_WS_MUTE ]                   = ENDPOINT_AGENTPHONE;
    EVENT_ENDPOINT_MAP[ EVT_WS_UNMUTE ]                 = ENDPOINT_AGENTPHONE;
    EVENT_ENDPOINT_MAP[ EVT_WS_STOP_REQUESTED ]         = ENDPOINT_AGENTPHONE;
    EVENT_ENDPOINT_MAP[ EVT_WS_PAUZE ]                  = ENDPOINT_PAUZE;
    EVENT_ENDPOINT_MAP[ EVT_WS_PAUZE_REQUESTED ]        = ENDPOINT_PAUZE;
    EVENT_ENDPOINT_MAP[ EVT_WS_RESUME ]                 = ENDPOINT_PAUZE;
    EVENT_ENDPOINT_MAP[ EVT_TASK_SETUP ]                = ENDPOINT_CALL;
    EVENT_ENDPOINT_MAP[ EVT_TASK_SUBMIT ]               = ENDPOINT_CALL;
    EVENT_ENDPOINT_MAP[ EVT_CALL_SETUP ]                = ENDPOINT_CALL;
    EVENT_ENDPOINT_MAP[ EVT_CALL_CREATE ]               = ENDPOINT_CALL;
    EVENT_ENDPOINT_MAP[ EVT_CALL_ONHOLD ]               = ENDPOINT_CALL;
    EVENT_ENDPOINT_MAP[ EVT_CALL_RECONNECTED ]          = ENDPOINT_CALL;
    EVENT_ENDPOINT_MAP[ EVT_CALL_DESTROY ]              = ENDPOINT_CALL;
    EVENT_ENDPOINT_MAP[ EVT_CONSULT_ALLOWED ]           = ENDPOINT_CONSULT;
    EVENT_ENDPOINT_MAP[ EVT_CONSULT_SETUP ]             = ENDPOINT_CONSULT;
    EVENT_ENDPOINT_MAP[ EVT_CONSULT_CONNECTED ]         = ENDPOINT_CONSULT;
    EVENT_ENDPOINT_MAP[ EVT_CONSULT_ONHOLD ]            = ENDPOINT_CONSULT;
    EVENT_ENDPOINT_MAP[ EVT_CONSULT_NOTALLOWED ]        = ENDPOINT_CONSULT;
    EVENT_ENDPOINT_MAP[ EVT_CALL_RECORD_STARTED ]       = ENDPOINT_CALL;
    EVENT_ENDPOINT_MAP[ EVT_CALL_RECORD_STOPPED ]       = ENDPOINT_CALL;
    EVENT_ENDPOINT_MAP[ EVT_CALLER_BLACKLISTED ]        = ENDPOINT_CALL;

    EVENT_ENDPOINT_MAP[ EVT_CALL_SETUP_SUBMITTED ]      = ENDPOINT_CALL;
    EVENT_ENDPOINT_MAP[ EVT_CALL_CREATE_SUBMITTED ]     = ENDPOINT_CALL;
    EVENT_ENDPOINT_MAP[ EVT_CALL_DESTROY_SUBMITTED ]    = ENDPOINT_CALL;

// Map commands to their DOM ID's
var COMMAND_ACTION_MAP = {};
    COMMAND_ACTION_MAP[ CMD_LOGIN ]                     = "actLogin";
    COMMAND_ACTION_MAP[ CMD_LOGOUT ]                    = "actLogout";
    COMMAND_ACTION_MAP[ CMD_CONNECT ]                   = "actConnect";
    COMMAND_ACTION_MAP[ CMD_DISCONNECT ]                = "actDisconnect";
    COMMAND_ACTION_MAP[ CMD_MUTE ]                      = "actMute";
    COMMAND_ACTION_MAP[ CMD_UNMUTE ]                    = "actUnmute";
    COMMAND_ACTION_MAP[ CMD_PAUZE ]                     = "actPauze";
    COMMAND_ACTION_MAP[ CMD_PAUZE_CANCEL ]              = "actPauzeCancel";
    COMMAND_ACTION_MAP[ CMD_RESUME ]                    = "actResume";
    COMMAND_ACTION_MAP[ CMD_NEXT ]                      = "actNext";
    COMMAND_ACTION_MAP[ CMD_SUBMIT ]                    = "actSubmit";
    COMMAND_ACTION_MAP[ CMD_CALL_DISCONNECT ]           = "actDisconnectCaller";
    COMMAND_ACTION_MAP[ CMD_CALL_BLACKLIST ]            = "actBlockCaller";
    COMMAND_ACTION_MAP[ CMD_CALL_HOLD ]                 = "actHold";
    COMMAND_ACTION_MAP[ CMD_CALL_UNHOLD ]               = "actUnhold";
    COMMAND_ACTION_MAP[ CMD_CALL_TRANSFER ]             = "actCallTransfer";
    COMMAND_ACTION_MAP[ CMD_CALL_TRANSFER_TO_IVRAPP ]   = "actTransferToIVRApp";
    COMMAND_ACTION_MAP[ CMD_CONSULT_TRANSFER ]          = "actConsultTransfer";
    COMMAND_ACTION_MAP[ CMD_CONSULT_CONNECT ]           = "actConsultConnect";
    COMMAND_ACTION_MAP[ CMD_CONSULT_DISCONNECT ]        = "actConsultDisconnect";
    COMMAND_ACTION_MAP[ CMD_CALL_RECORD_START ]         = "actStartRecording";
    COMMAND_ACTION_MAP[ CMD_CALL_RECORD_STOP ]          = "actStopRecording";


var ERRORS_GENERAL = {
    // Logon session
    101: "Je bent afgemeld, sluit Internet Explorer helemaal af en log opnieuw in.",
    102: "Je was langer aangemeld dan gebruikelijk, daarom ben je afgemeld.",
    103: "",
    104: "Je inlognaam en tincode zijn gebruikt om ergens anders in te loggen.",
    
    // Work session
    201: "Je inlognaam en tincode zijn gebruikt om ergens anders in te loggen.",
    202: "Het nummer dat je hebt opgegeven en waar we je nu op proberen te bellen is in gesprek.",
    203: "Het nummer dat je hebt opgegeven en waar we je nu op proberen te bellen is niet correct.",
    204: "Op het nummer dat je hebt opgegeven en waar we je nu op bellen wordt niet opgenomen.",
    205: "Je telefoon is niet bereikbaar. Log opnieuw in en controleer daarbij het nummer dat je hebt opgegeven.",
    206: "Je telefoonverbinding is verbroken, daardoor ben je gestopt met werken.",
    207: "Je telefoonverbinding is verbroken. Je wordt weer gebeld als er werk is.",
    208: "Je telefoon is niet bereikbaar. Zorg dat je telefoon bereikbaar is of stop met werken.",

    // Calls
    302: "Het nummer is in gesprek.",
    303: "Het nummer bestaat niet.",
    304: "Er wordt niet opgenomen.",
    305: "Het bellen is niet gelukt.",
    306: "",
    307: "Het gesprek is door onbekende oorzaak be&euml;indigd.",
    308: "Het gesprek is door onbekende oorzaak be&euml;indigd.",
    309: "De klant heeft opgehangen.",
    310: "",

    // Other
    900: "Ongeldige combinatie van inlognaam en tincode.",
    901: "Er is een fout opgetreden. Je bent afgemeld, sluit Internet Explorer helemaal af en log opnieuw in.",
    902: "Er is een fout opgetreden. Je bent afgemeld, sluit Internet Explorer helemaal af en log opnieuw in.",
    903: "Er is een fout opgetreden. Je bent afgemeld, sluit Internet Explorer helemaal af en log opnieuw in.",
    904: "Er is een fout opgetreden. Je bent afgemeld, sluit Internet Explorer helemaal af en log opnieuw in.",
    905: "Er is een fout opgetreden. Je bent afgemeld, sluit Internet Explorer helemaal af en log opnieuw in.",
    906: "Er is een fout opgetreden. Je bent afgemeld, sluit Internet Explorer helemaal af en log opnieuw in.",
    907: "Er is een fout opgetreden. Je bent afgemeld, sluit Internet Explorer helemaal af en log opnieuw in.",
    908: "Er is een fout opgetreden. Je bent afgemeld, sluit Internet Explorer helemaal af en log opnieuw in.",
    909: "Er is een fout opgetreden. Je bent afgemeld, sluit Internet Explorer helemaal af en log opnieuw in.",
    910: "Er is een fout opgetreden. Je bent afgemeld, sluit Internet Explorer helemaal af en log opnieuw in.",
    911: "Er is een fout opgetreden. Je bent afgemeld, sluit Internet Explorer helemaal af en log opnieuw in.",
    912: "Er is een fout opgetreden. Je bent afgemeld, sluit Internet Explorer helemaal af en log opnieuw in.",
    913: "Er is een fout opgetreden. Je bent afgemeld, sluit Internet Explorer helemaal af en log opnieuw in.",
    914: "Deze browser wordt nog niet offici&euml;el ondersteund. Gebruik Internet Explorer."
};

var ERRORS_LICENSEES = {
  8: {
      // Logon session
      101: "Your session has been terminated, please restart your browser and log on.",
      102: "You have been logged on longer than usual, therefore your session has been terminated.",
      103: "Your session has been terminated.",
      104: "Your username and tincode are logged on to a different workstation.",
      
      // Work session
      201: "Your username and tincode are logged on to a different workstation.",
      202: "The number you have issued is busy.",
      203: "The number you have issued is incorrect.",
      204: "The number you have issued is not being answered.",
      205: "Please check the number you have issued as we are unable to make contact.",
      206: "", // TODO: translate generic message 206 to english

      // Calls
      302: "The number you attempted to call is busy.",
      303: "The number you attempted to call does not exist.",
      304: "Your call is not being answered.",
      305: "We have not been able to establish a call.",
      306: "",
      307: "The conversation has been terminated due to an unidentified issue.",
      308: "The conversation has been terminated due to an unidentified issue.",
      309: "Your call has been terminated.",
      310: "",

      // Other
      900: "Invalid username or tincode.",
      901: "An error has occurred, your session has been terminated. Please restart your browser and log on.",
      902: "An error has occurred, your session has been terminated. Please restart your browser and log on.",
      903: "An error has occurred, your session has been terminated. Please restart your browser and log on.",
      904: "An error has occurred, your session has been terminated. Please restart your browser and log on.",
      905: "An error has occurred, your session has been terminated. Please restart your browser and log on.",
      906: "An error has occurred, your session has been terminated. Please restart your browser and log on.",
      907: "An error has occurred, your session has been terminated. Please restart your browser and log on.",
      908: "An error has occurred, your session has been terminated. Please restart your browser and log on.",
      909: "An error has occurred, your session has been terminated. Please restart your browser and log on.",
      910: "An error has occurred, your session has been terminated. Please restart your browser and log on.",
      911: "An error has occurred, your session has been terminated. Please restart your browser and log on.",
      912: "An error has occurred, your session has been terminated. Please restart your browser and log on.",
      913: "An error has occurred, your session has been terminated. Please restart your browser and log on.",
      914: "" // cannot display this message for specific licensees
  }
};
