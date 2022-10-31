let activeMeeting;
let remoteShareStream;
let webex;

let videoToggle = "shareVideo";
let audioToggle = "shareAudio";
let recordToggle = "record";
let screenShareToggle = "false";
let linkArray = [];
let weblinktest = "";

const token = 'N2E4ZWRjYzktZmZjMy00M2IzLWE3OTktMWFmMjViOTAwNTU4ZDVmODQ0YzQtNDBm_P0A1_d1d17980-94b0-4f95-af6e-224afebb719b';

let redirect_uri = `${window.location.protocol}//${window.location.host}`;

if (window.location.pathname) {
    redirect_uri += window.location.pathname;
}




function registerToken() {
    const webex = window.webex = Webex.init({
        config: {
            credentials: {
                client_id: 'C29fe69d8107c5dfebfb49c03adef0d94d03fc7e1e4d8dc2e002555c7861aacc2',
                redirect_uri,
                scope: 'spark:all spark:kms'
            }
        }
    });
    if (webex.canAuthorize) {
        return new Promise((resolve) => {
            console.log("The device is ", webex.meetings.registered)
            if (!webex.meetings.registered) {
                webex.meetings.register()
                    .then(() => webex.meetings.syncMeetings())
                    .then(() => {
                        document.body.classList.add('listening');
                        document.getElementById("joinCall").disabled = false;
                        resolve();
                    })
                    .catch((err) => {
                        resolve();
                        webex.meetings.unregister();
                        throw err;
                    });
            } else {
                resolve();
            }
        });
    }
    else {
        // No user is authenticated
        webex.authorization.initiateLogin();
    }

}


function displayTokenForm() {
    registerToken();
    listenForIncomingMeetings();
    createEventListenerForMediaButtons();
}


function createEventListenerForMediaButtons() {
    // Adding event handler for share screen button to share device's screen
    document.getElementById('share-screen').addEventListener('click', () => {
        console.log("share-screen Button clicked!");
        if (activeMeeting) {
            // First check if we can update
            if(screenShareToggle === 'false'){
                waitForMediaReady(activeMeeting).then(() => {
                    console.info('SHARE-SCREEN: Sharing screen via `shareScreen()`');
                    console.log("before sharing screen!");
                    activeMeeting.shareScreen()
                        .then(() => {
                            let share = document.getElementById('share-screen');
                            share.style.backgroundColor = '#228999';
                            share.style.color = '#fff';
                            console.log("after sharing screen!");
                            console.log("controll in After share screen !!!");
                            console.info('SHARE-SCREEN: Screen successfully added to meeting.');
                            var parent = document.getElementById('message-container');
                            var newChild = '<p>Screen Sharing Started!</p>';
                            parent.insertAdjacentHTML('beforeend', newChild);
                            screenShareToggle = "true";
                        })
                        .catch((e) => {
                            console.error('SHARE-SCREEN: Unable to share screen, error:');
                            console.error(e);
                        });
                });
            } else {
                activeMeeting.stopShare()
                    .then(() => {
                        let share = document.getElementById('share-screen');
                        share.style.backgroundColor = '#f2f2f2';
                        share.style.color = '#000';
                        console.log("after stop sharing screen!");
                        console.log("controll in After share screen !!!");
                        var parent = document.getElementById('message-container');
                        var newChild = '<p>Screen Sharing Stopped!</p>';
                        parent.insertAdjacentHTML('beforeend', newChild);
                        screenShareToggle = "false";
                    });
            }
        }
        else {
            console.error('No active meeting available to share screen.');
        }
    });
}

function joinCall() {

    const destination = document.getElementById("joinCall").value;

    listenForIncomingMeetings().then(() => {
        // Create the meeting
        return webex.meetings.create(destination).then((meeting) => {
            // Pass the meeting to our join meeting helper
            let audio = document.getElementById('stop-sending-audio');
            audio.style.backgroundColor = '#228999';
            audio.style.color = '#fff';
            let video = document.getElementById('stop-sending-video');
            video.style.backgroundColor = '#228999';
            video.style.color = '#fff';
            document.getElementById("hangup").onmouseover = function() {
                this.style.backgroundColor = "#ff0000";
                this.style.color = '#fff';
            }
            document.getElementById("hangup").onmouseleave = function() {
                this.style.backgroundColor = "#f2f2f2";
                this.style.color = '#000';
            }
            var parent = document.getElementById('message-container');
            var parentFile = document.getElementById('file-container');
            parent.innerHTML = parentFile.innerHTML = '';
            var newChild = '<p>Meeting Joined Successfully</p>';
            parent.insertAdjacentHTML('beforeend', newChild);
            return joinMeeting(meeting);
        });
    })
        .catch((error) => {
            // Report the error
            console.error(error);

        });
}

function listenForIncomingMeetings() {
    return new Promise((resolve) => {
        webex.meetings.on('meeting:added', (addedMeetingEvent) => {
            if (addedMeetingEvent.type === 'INCOMING') {
                const addedMeeting = addedMeetingEvent.meeting;
                addedMeeting.acknowledge(addedMeetingEvent.type)
                    .then(() => {
                        if (confirm('Answer incoming call')) {
                            joinMeeting(addedMeeting);
                        }
                        else {
                            addedMeeting.decline();
                        }
                    });
            }
        });
        resolve();
    });
}

function bindMeetingEvents(meeting) {
    meeting.on('error', (err) => {
        console.error(err);
    });

    meeting.on('meeting:startedSharingRemote', () => {
        document.getElementById('remote-screen').srcObject = remoteShareStream;
    });

    meeting.on('meeting:stoppedSharingRemote', () => {
        document.getElementById('remote-screen').srcObject = null;
    });

    meeting.on('media:ready', (media) => {
        if (!media) {
            return;
        }
        console.log(`MEDIA:READY type:${media.type}`);
        if (media.type === 'local') {
            document.getElementById("joinCall").style.display = "none";
            document.getElementById('self-view').srcObject = media.stream;
        }
        if (media.type === 'remoteVideo') {
            document.getElementById('remote-view-video').srcObject = media.stream;
        }
        if (media.type === 'remoteAudio') {
            document.getElementById('remote-view-audio').srcObject = media.stream;
        }
        if (media.type === 'remoteShare') {
            remoteShareStream = media.stream;
        }
        if (media.type === 'localShare') {
        }
    });

    meeting.on('media:stopped', (media) => {
        if (media.type === 'local') {
            document.getElementById('self-view').srcObject = null;
        }
        if (media.type === 'remoteVideo') {
            document.getElementById('remote-view-video').srcObject = null;
        }
        if (media.type === 'remoteAudio') {
            document.getElementById('remote-view-audio').srcObject = null;
        }
        if (media.type === 'localShare') {
        }
    });

    meeting.on('meeting:startedSharingLocal', () => {

        document.getElementById('screenshare-tracks').innerText = 'SHARING';
        var parent = document.getElementById('message-container');
        var newChild = '<p>Screen Sharing Started!</p>';
        parent.insertAdjacentHTML('beforeend', newChild);
    });
    meeting.on('meeting:stoppedSharingLocal', () => {
        document.getElementById('screenshare-tracks').innerText = 'STOPPED';
        var parent = document.getElementById('message-container');
        var newChild = '<p>Screen Sharing Stopped!</p>';
        parent.insertAdjacentHTML('beforeend', newChild);
    });
    meeting.members.on('members:update', (delta) => {
        const {full: membersData} = delta;
        const memberIDs = Object.keys(membersData);

        memberIDs.forEach((memberID) => {
            const memberObject = membersData[memberID];

            if (memberObject.isUser) {
                if (memberObject.isSelf) {
                }
                else {
                }
            }
        });
    });

    const leaveMeeting = () => meeting.leave();

    document.getElementById('hangup').addEventListener('click', leaveMeeting, {once: true});
    document.getElementById('hangup').addEventListener('click', () => {
        var parent = document.getElementById('message-container');
        var newChild = '<p>Call Ended!</p>';
        parent.insertAdjacentHTML('beforeend', newChild);
        let video = document.getElementById('stop-sending-video');
        video.style.backgroundColor = '#f2f2f2';
        video.style.color = '#000';
        let audio = document.getElementById('stop-sending-audio');
        audio.style.backgroundColor = '#f2f2f2';
        audio.style.color = '#000';
        window.location.href="https://www.smartshipweb.com/__orion#/WebexConferencing";

    });
    document.getElementById('stop-sending-video').addEventListener('click', () => {
        console.error("Video mute Button Click !");
        if (activeMeeting) {
            if(videoToggle === "shareVideo") {
                activeMeeting.muteVideo();
                let video = document.getElementById('stop-sending-video');
                let videoIcon = video.getElementsByTagName('span')[0];
                videoIcon.innerHTML = 'videocam_off';
                video.style.backgroundColor = '#ff0000';
                video.style.color = '#fff';

                videoToggle = "dontShare";
                console.error("Video muted !");
                var parent = document.getElementById('message-container');
                var newChild = '<p>Video Muted!</p>';
                parent.insertAdjacentHTML('beforeend', newChild);

            } else {
                activeMeeting.unmuteVideo();
                let video = document.getElementById('stop-sending-video');
                let videoIcon = video.getElementsByTagName('span')[0];
                videoIcon.innerHTML = 'videocam';
                video.style.backgroundColor = '#228999';
                video.style.color = '#fff';
                videoToggle = "shareVideo";
                console.error("Video unmuted !");
                var parent = document.getElementById('message-container');
                var newChild = '<p>Video Unmuted!</p>';
                parent.insertAdjacentHTML('beforeend', newChild);
            }
        }
    })

    document.getElementById('stop-sending-audio').addEventListener('click', () => {
        console.error("audio mute Button Click !");
        if (activeMeeting) {
            if(audioToggle === "shareAudio") {
                let audio = document.getElementById('stop-sending-audio');
                let audioIcon = audio.getElementsByTagName('span')[0];
                audioIcon.innerHTML = 'mic_off';
                audio.style.backgroundColor = '#ff0000';
                audio.style.color = '#fff';
                activeMeeting.muteAudio();
                audioToggle = "dontShare";
                console.error("Audio muted !");

                var parent = document.getElementById('message-container');
                var newChild = '<p>Audio Muted!</p>';
                parent.insertAdjacentHTML('beforeend', newChild);

            } else {
                activeMeeting.unmuteAudio();
                let audio = document.getElementById('stop-sending-audio');
                let audioIcon = audio.getElementsByTagName('span')[0];
                audioIcon.innerHTML = 'mic';
                audio.style.backgroundColor = '#228999';
                audio.style.color = '#fff';
                audioToggle = "shareAudio";
                console.log("Audio unmuted !");
                var parent = document.getElementById('message-container');
                var newChild = '<p>Audio Unmuted!</p>';
                parent.insertAdjacentHTML('beforeend', newChild);

            }
        }
    });


    document.getElementById('start-recording').addEventListener ('click', () => {
        console.error("recording Button Click !");
        activeMeeting = getCurrentMeeting();
        console.log(activeMeeting);

        if (activeMeeting) {
            if(recordToggle === "record") {

                console.log("start recording section");
                activeMeeting.startRecording()
                    .then(() => {
                        let record = document.getElementById('start-recording');
                        record.style.backgroundColor = '#ff0000';
                        record.style.color = '#fff';
                        recordToggle = "dnt-record";
                        var parent = document.getElementById('message-container');
                        var newChild = '<p>Meeting Recording Started!</p>';
                        parent.insertAdjacentHTML('beforeend', newChild);
                    })
                    .catch((error) => {
                        console.error('MeetingControls#startRecording() :: unable to record meeting.');
                        console.error(error);
                    });
                console.log("start Record Method end!");
            } else {
                console.log("stop recording section");
                activeMeeting.stopRecording()
                    .then(() => {
                        let record = document.getElementById('start-recording');
                        record.style.backgroundColor = '#F2F2F2';
                        record.style.color = '#000';
                        recordToggle = "record";
                        var parent = document.getElementById('message-container');
                        var newChild = '<p>Meeting Recording Stopped!</p>';
                        parent.insertAdjacentHTML('beforeend', newChild);
                    })
                    .catch((error) => {
                        console.error('MeetingControls#stopRecording() :: unable to stop recording!');
                        console.error(error);
                    });
                console.log("stop Record Method end !");
            }
        }
    });

    meeting.on('all', (event) => {
        console.log(event);
    });
}

function waitForMediaReady(meeting) {
    return new Promise((resolve, reject) => {
        if (meeting.canUpdateMedia()) {
            resolve();
        }
        else {
            console.info('SHARE-SCREEN: Unable to update media, pausing to retry...');
            let retryAttempts = 0;

            const retryInterval = setInterval(() => {
                retryAttempts += 1;
                console.info('SHARE-SCREEN: Retry update media check');

                if (meeting.canUpdateMedia()) {
                    console.info('SHARE-SCREEN: Able to update media, continuing');
                    clearInterval(retryInterval);
                    resolve();
                }
                // If we can't update our media after 15 seconds, something went wrong
                else if (retryAttempts > 15) {
                    console.error('SHARE-SCREEN: Unable to share screen, media was not able to update.');
                    clearInterval(retryInterval);
                    reject();
                }
            }, 10000);
        }
    });
}

function getCurrentMeeting() {
    const meetings = webex.meetings.getAllMeetings();

    return meetings[Object.keys(meetings)[0]];
}

function joinMeeting(meeting) {
    console.log("MT : ",meeting);
    activeMeeting = meeting;
    bindMeetingEvents(meeting);

    var intervalId = window.setInterval(function() {
        //todo here we can make API request
        const url = new URL(window.location.href);
        weblinktest = url;
        console.log(weblinktest);
        getDataFromServer();
    },10000);



    function getDataFromServer() {
        const url = new URL(window.location.href);
        var param = url.searchParams.get("weblink");
        console.log(param);
        fetch(`https://www.smartshipweb.com/be__orion/getMediaArray?meetinglink=${param}`)
            .then(response => response.json())
            .then(arr => {
                var parent = document.getElementById('file-container');
                while (parent.hasChildNodes()) {
                    parent.removeChild(parent.lastChild);
                }
                if( Array.isArray(arr) ) {
                    arr.forEach(item => {
                        appendMessage(item);
                    })
                }
            });
    }

    var appendMessage = (url) => {
        var a = document.createElement('a');
        var link = document.createTextNode(url);
        a.appendChild(link);
        a.title = 'Local file uploaded Successfully -> Download Now';
        a.href = url;
        a.innerHTML = 'Local file uploaded Successfully -> Download Now';
        a.target="_blank"
        document.body.prepend(a);
        var parent = document.getElementById('file-container');
        var child = document.createElement('p');
        child.appendChild(a)
        parent.append(child);
    }

    return meeting.join().then(() => {
        const mediaSettings = {
            receiveVideo: true,
            receiveAudio: true,
            receiveShare: true,
            sendVideo: true,
            sendAudio: true,
            sendShare: false
        };

        return meeting.getMediaStreams(mediaSettings).then((mediaStreams) => {
            const [localStream, localShare] = mediaStreams;

            meeting.addMedia({
                localShare,
                localStream,
                mediaSettings
            });
        });
    });
};

displayTokenForm();