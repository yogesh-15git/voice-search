var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {

    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
        recognizing = true;
        document.getElementById("start_img").className += ' mic-activated';
    };

    recognition.onerror = function (event) {
        if (event.error == 'no-speech') {
            document.getElementById("start_img").className = 'fa fa-microphone';
            alert('No speech was detected. You may need to adjust your microphone settings.');
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            document.getElementById("start_img").className = 'fa fa-microphone';
            alert('No microphone was found. Ensure that a microphone is installed and that microphone settings are configured correctly.');
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                alert('Permission to use microphone is blocked. To change, go to chrome://settings/contentExceptions#media-stream');
            } else {
                alert('Permission to use microphone was denied.');
            }
            ignore_onend = true;
        }
    };

    recognition.onend = function () {
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        document.getElementById("start_img").className = 'fa fa-microphone';
        if (!final_transcript) {
            alert('Click on the microphone icon and begin speaking.');
            return;
        }
    };

    recognition.onresult = function (event) {
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        final_transcript = capitalize(final_transcript);

        var search = document.getElementById('search');
        search.value = linebreak(final_transcript);
        search.focus();
    };
}

function upgrade() {
    var start_button = document.getElementById('start_button');
    start_button.style.display = 'none';
    alert('Web Speech API is not supported by this browser. Upgrade to Chrome version 25 or later.');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, function (m) {
        return m.toUpperCase();
    });
}

function startButton(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.lang = 'en-US';
    recognition.start();
    ignore_onend = false;
    var search = document.getElementById('search');
    search.value = '';
    document.getElementById("start_img").className = 'fa fa-microphone-slash';
    start_timestamp = event.timeStamp;
}
