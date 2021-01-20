let webex;

var url_string = window.location.href;
var url = new URL(url_string);

function initWebex() {
    token = url.searchParams.get("token");
    console.log('Authentication#initWebex()');
  
    webex = window.webex = Webex.init({
      config: {
        logger: {
          level: 'info'
        },
        meetings: {
          reconnection: {
            enabled: true
          },
          enableRtx: true
        }
      },
      credentials: {
        access_token: token
      }
    });
  
    webex.once('ready', () => {
      console.log('Authentication#initWebex() :: Webex Ready');
      register();
    });
  }

  function register() {
    console.log('Authentication#register()');
  
    webex.meetings.register()
      .then(() => {
        console.log('Authentication#register() :: successfully registered');
        createMeeting();
      })
      .catch((error) => {
        console.warn('Authentication#register() :: error registering', error);
      });
  
    webex.meetings.on('meeting:added', (m) => {
      const {type} = m;
  
      if (type === 'INCOMING') {
        const newMeeting = m.meeting;
          newMeeting.acknowledge(type);
      }
    });
  }

  function createMeeting() {
    link = url.searchParams.get("meeting_url");
    webex.meetings.create(link)
      .then((meeting) => {
          console.log(meeting);
         joinMeeting(meeting.id);
      });
  }

  function getCurrentMeeting() {
    const meetings = webex.meetings.getAllMeetings();
  
    return meetings[Object.keys(meetings)[0]];
  }

  function joinMeeting(meetingId) {
    const meeting = webex.meetings.getAllMeetings()[meetingId];
  
    if (!meeting) {
      throw new Error(`meeting ${meetingId} is invalid or no longer exists`);
    }
    const resourceId = webex.devicemanager._pairedDevice ?
      webex.devicemanager._pairedDevice.identity.id :
      undefined;
  
    meeting.join({
      moveToResource: false,
      resourceId
    })
      .then(() => {
        console.log("Joined meeting")
        addMedia()
      });
  }

  settings = {};
  settings['receiveAudio'] = true;
  settings['receiveVideo'] = true;
  settings['receiveShare'] = true;
  settings['sendAudio'] = true;

  async function addMedia() {
      let meeting = getCurrentMeeting();

      while(meeting['state'] != "JOINED") {
        await new Promise(r => setTimeout(r, 2000));
        meeting = getCurrentMeeting();
        console.log("Not yet joined")
      }

      if (!meeting) {
        console.log('MeetingStreams#addMedia() :: no valid meeting object!');
      }
    
      meeting.addMedia({
        mediaSettings: settings
      }).then(() => {
        console.log('MeetingStreams#addMedia() :: successfully added media!');
      }).catch((error) => {
        console.log('MeetingStreams#addMedia() :: Error adding media!');
        console.error(error);
      });
  }


  function unregister() {
    console.log('Authentication#unregister()');
  
    webex.meetings.unregister()
      .then(() => {
        console.log('Authentication#register() :: successfully unregistered');
      })
      .catch((error) => {
        console.warn('Authentication#register() :: error unregistering', error);
      });
  }

  function leaveMeeting(meetingId) {
    if (!meetingId) {
      return;
    }
  
    const meeting = webex.meetings.getAllMeetings()[meetingId];
  
    if (!meeting) {
      throw new Error(`meeting ${meetingId} is invalid or no longer exists`);
    }
  
    meeting.leave()
      .then(() => {
          console.log("Left meeting")
      });
  }
