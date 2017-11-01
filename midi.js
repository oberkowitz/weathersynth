var selectMIDIIn = null;
var selectMIDIOut = null;
var midiAccess = null;
var midiIn = null;
var midiOut = null;
var pushInputFound = false;
var pushOutputFound = false;
var weatherSynth;

function midiInit(ws) {
    weatherSynth = ws;
    return function(midi) {
        midiAccess = midi;
        selectMIDIIn = document.getElementById("midiIn");
        selectMIDIOut = document.getElementById("midiOut");

        // clear the MIDI input/output select
        selectMIDIIn.options.length = 0;
        selectMIDIOut.options.length = 0;
		selectMIDIIn.add(new Option("None", -1, true, true));
		selectMIDIOut.add(new Option("None", -1, true, true));

        for (var input of midiAccess.inputs.values()) {
            if (input.name.toString().indexOf("Ableton Push 2") != -1) {
                pushInputFound = true;
                selectMIDIIn.add(new Option(input.name, input.id, true, true));
            } else {
                selectMIDIIn.add(new Option(input.name, input.id, false, false));
            }
        }
        selectMIDIIn.onchange = changeMIDIIn;

        // clear the MIDI output select
        for (var output of midiAccess.outputs.values()) {
            if ((output.name.toString().indexOf("Ableton Push 2") != -1)) {
                pushOutputFound = true;
                selectMIDIOut.add(new Option(output.name, output.id, true, true));
            } else
                selectMIDIOut.add(new Option(output.name, output.id, false, false));
        }
        selectMIDIOut.onchange = changeMIDIOut;
    }
}

function onMIDIInit(midi) {
}


function onMIDIFail(err) {
    alert("MIDI initialization failed.");
}

function changeMIDIIn(ev) {
    // if (midiIn)
    //     midiIn.onmidimessage = null;
    var selectedID = selectMIDIIn[selectMIDIIn.selectedIndex].value;
    for (var input of midiAccess.inputs.values()) {
        if (selectedID == input.id)
            midiIn = input;
    }
}

function handle(ev) {
    console.log(ev);
    if (weatherSynth) {
        weatherSynth.handleMidiMessage(ev);
    }
}

function changeMIDIOut(ev) {
    var selectedID = selectMIDIOut[selectMIDIOut.selectedIndex].value;
    for (var output of midiAccess.outputs.values()) {
        if (selectedID == output.id) {
            midiOut = output;
        }
    }
}


function startWeatherSynthMidi() {
    // TODO: Do something
    midiIn.onmidimessage = function(ev) {
    	weatherSynth.handleMidiMessage(ev);
    }
}



