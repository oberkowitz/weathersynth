function Keyboard(weatherSynth, push2) {
    this.weatherSynth = weatherSynth;
    this.push2 = push2;
    this.heldNotes = {};
}

Keyboard.prototype.onKeyDown = function(keyName) {
    if (!this.heldNotes[keyName]) { // False or undefined
        switch (keyName) {
            case "a":
                this.weatherSynth.noteOn(60, 100);
                break;
            case "w":
                this.weatherSynth.noteOn(61, 100);
                break;
            case "s":
                this.weatherSynth.noteOn(62, 100);
                break;
            case "e":
                this.weatherSynth.noteOn(63, 100);
                break;
            case "d":
                this.weatherSynth.noteOn(64, 100);
                break;
            case "f":
                this.weatherSynth.noteOn(65, 100);
                break;
            case "t":
                this.weatherSynth.noteOn(66, 100);
                break;
            case "g":
                this.weatherSynth.noteOn(67, 100);
                break;
            case "y":
                this.weatherSynth.noteOn(68, 100);
                break;
            case "h":
                this.weatherSynth.noteOn(69, 100);
                break;
            case "u":
                this.weatherSynth.noteOn(70, 100);
                break;
            case "j":
                this.weatherSynth.noteOn(71, 100);
                break;
            case "k":
                this.weatherSynth.noteOn(72, 100);
                break;
        }
        this.heldNotes[keyName] = true;
    }
}

Keyboard.prototype.onKeyUp = function(keyName) {
    switch (keyName) {
        case "a":
            this.weatherSynth.noteOff(60);
            break;
        case "w":
            this.weatherSynth.noteOff(61);
            break;
        case "s":
            this.weatherSynth.noteOff(62);
            break;
        case "e":
            this.weatherSynth.noteOff(63);
            break;
        case "d":
            this.weatherSynth.noteOff(64);
            break;
        case "f":
            this.weatherSynth.noteOff(65);
            break;
        case "t":
            this.weatherSynth.noteOff(66);
            break;
        case "g":
            this.weatherSynth.noteOff(67);
            break;
        case "y":
            this.weatherSynth.noteOff(68);
            break;
        case "h":
            this.weatherSynth.noteOff(69);
            break;
        case "u":
            this.weatherSynth.noteOff(70);
            break;
        case "j":
            this.weatherSynth.noteOff(71);
            break;
        case "k":
            this.weatherSynth.noteOff(72);
            break;
    }
    this.heldNotes[keyName] = false;
}