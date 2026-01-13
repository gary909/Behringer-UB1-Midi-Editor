// Variable to store the selected MIDI output port
let midiOutput = null;

// Variable to store the original text of the MIDI status element
let originalMidiStatusText = '';

// --- MIDI CC NUMBERS UB-1 MICRO ---
const CC_VCF_ENV_AMT = 3;
const CC_VCA_LEVEL = 7;
const CC_VCA_MIXER = 8;
const CC_DCO_SYNC = 9;
const CC_MIDI_TX_CH = 14;
const CC_MIDI_RX_CH = 15;
const CC_VCF_OSC2_AMT = 20;
const CC_OSC1_WAVE = 24;
const CC_OSC2_WAVE = 25;
const CC_AUX_TYPE = 26;
const CC_AUX_LEVEL = 27;
const CC_LFO2_AMT = 28;
const CC_NOISE_LEVEL = 29;
const CC_LFO1_WAVE = 30;
const CC_LFO2_WAVE = 31;
const CC_LFO1_AMT = 70;
const CC_VCF_RES = 71;
const CC_LFO1_RATE = 72;
const CC_LFO2_RATE = 73;
const CC_VCF_CUTOFF = 74;
const CC_VCA_A = 81;
const CC_VCA_D = 82;
const CC_VCA_S = 83;
const CC_VCA_R = 84;
const CC_VCF_A = 85;
const CC_VCF_D = 86;
const CC_VCF_S = 87;
const CC_VCF_R = 88;
const CC_OSC1_PW = 102;
const CC_OSC2_PW = 103;
const CC_ARP_ENABLE = 104;
const CC_ARP_HOLD = 105;
const CC_ARP_SCALE = 106;
const CC_ARP_TYPE = 107;
const CC_ARP_CLOCK = 108;
const CC_ARP_BPM = 109;
const CC_ARP_GATE = 110;
const CC_OSC1_FINE = 111;
const CC_OSC2_FINE = 112;
const CC_ARP_SWING = 113;
const CC_OCTAVE = 114;
const CC_OSC1_COARSE = 115;
const CC_OSC2_COARSE = 116;
const CC_DUO_MODE = 117;

// --- PATCH DEFAULTS ---
const ALL_PATCH_CONTROLS = [
    // Arpeggiator
    { id: 'arp-enable', cc: CC_ARP_ENABLE, value: 0, isCheckbox: true },
    { id: 'arp-hold', cc: CC_ARP_HOLD, value: 0, isCheckbox: true },
    { id: 'arp-scale', cc: CC_ARP_SCALE, value: 43 }, 
    { id: 'arp-type', cc: CC_ARP_TYPE, value: 0 },    
    { id: 'arp-clock-source', cc: CC_ARP_CLOCK, value: 0 }, 
    { id: 'arp-bpm', cc: CC_ARP_BPM, value: 120 },
    { id: 'arp-gate', cc: CC_ARP_GATE, value: 50 },
    { id: 'arp-swing', cc: CC_ARP_SWING, value: 50 },

    // Osc Common & OSC 1/2
    { id: 'osc-duo', cc: CC_DUO_MODE, value: 0, isCheckbox: true },
    { id: 'osc-octave', cc: CC_OCTAVE, value: 64 },
    { id: 'osc-sync', cc: CC_DCO_SYNC, value: 0, isCheckbox: true },
    { id: 'osc-aux-type', cc: CC_AUX_TYPE, value: 0 },
    { id: 'osc-aux-level', cc: CC_AUX_LEVEL, value: 0 },
    { id: 'osc-noise', cc: CC_NOISE_LEVEL, value: 0 },
    { id: 'osc1-wave', cc: CC_OSC1_WAVE, value: 32 },
    { id: 'osc1-fine', cc: CC_OSC1_FINE, value: 50 },
    { id: 'osc1-coarse', cc: CC_OSC1_COARSE, value: 50 },
    { id: 'osc1-pw', cc: CC_OSC1_PW, value: 0 },
    { id: 'osc2-wave', cc: CC_OSC2_WAVE, value: 32 },
    { id: 'osc2-fine', cc: CC_OSC2_FINE, value: 50 },
    { id: 'osc2-coarse', cc: CC_OSC2_COARSE, value: 50 },
    { id: 'osc2-pw', cc: CC_OSC2_PW, value: 0 },

    // Filter & VCA
    { id: 'vcf-cutoff', cc: CC_VCF_CUTOFF, value: 50 },
    { id: 'vcf-res', cc: CC_VCF_RES, value: 0 },
    { id: 'vcf-env-amt', cc: CC_VCF_ENV_AMT, value: 50 },
    { id: 'vcf-osc2-amt', cc: CC_VCF_OSC2_AMT, value: 0 },
    { id: 'vca-level', cc: CC_VCA_LEVEL, value: 5 },
    { id: 'vca-mixer', cc: CC_VCA_MIXER, value: 50 },

    // EGs
    { id: 'vca-a', cc: CC_VCA_A, value: 0 }, { id: 'vca-d', cc: CC_VCA_D, value: 20 },
    { id: 'vca-s', cc: CC_VCA_S, value: 127 }, { id: 'vca-r', cc: CC_VCA_R, value: 10 },
    { id: 'vcf-a', cc: CC_VCF_A, value: 0 }, { id: 'vcf-d', cc: CC_VCF_D, value: 20 },
    { id: 'vcf-s', cc: CC_VCF_S, value: 0 }, { id: 'vcf-r', cc: CC_VCF_R, value: 10 }
];

// ---------------------------------------------------------------------------- //
// --- ARPEGGIATOR HELPERS ---
function getArpEnableName(value) {
    return value >= 64 ? 'ARP: ON' : 'ARP: OFF';
}

function getArpHoldName(value) {
    return value >= 64 ? 'ARP HOLD: ON' : 'ARP HOLD: OFF';
}

function getArpScaleName(value) {
    if (value <= 21) return 'SCALE: 1/4';
    if (value <= 42) return 'SCALE: 1/4 T';
    if (value <= 63) return 'SCALE: 1/8';
    if (value <= 85) return 'SCALE: 1/8 T';
    if (value <= 106) return 'SCALE: 1/16';
    return 'SCALE: 1/16 T';
}

function getArpTypeName(value) {
    if (value <= 42) return 'TYPE: UP';
    if (value <= 85) return 'TYPE: DOWN';
    return 'TYPE: UP & DOWN';
}

function getArpClockName(value) {
    if (value <= 42) return 'CLOCK: INTERNAL';
    if (value <= 85) return 'CLOCK: USB';
    return 'CLOCK: MIDI';
}

// --- OSC COMMON HELPERS ---
function getDuoModeName(value) {
    return value >= 64 ? 'DUO MODE: ON' : 'DUO MODE: OFF';
}

function getDCOSyncName(value) {
    return value >= 64 ? 'DCO SYNC: ON' : 'DCO SYNC: OFF';
}

function getAuxTypeName(value) {
    return value <= 63 ? 'AUX: NOISE' : 'AUX: SUB';
}

function getOctaveName(value) {
    if (value <= 25) return 'OCTAVE: -2';
    if (value <= 51) return 'OCTAVE: -1';
    if (value <= 76) return 'OCTAVE: 0';
    if (value <= 102) return 'OCTAVE: +1';
    return 'OCTAVE: +2';
}

// --- OSC 1 FEEDBACK HELPERS ---
function getOscWaveName(value) {
    if (value <= 31) return 'OSC 1: OFF';
    if (value <= 63) return 'OSC 1: SAWTOOTH';
    if (value <= 95) return 'OSC 1: TRIANGLE';
    return 'OSC 1: SQUARE';
}

function getOscCoarseName(value) {
    // Assuming 0-99 range from manual, centered at 50 for 0 pitch shift
    const semitones = value - 50;
    const sign = semitones > 0 ? '+' : '';
    return `OSC 1 COARSE: ${sign}${semitones} ST`;
}

function getOscFineName(value) {
    // Centered at 50
    const detune = value - 50;
    return `OSC 1 FINE: ${detune}`;
}

function getOscPWName(value) {
    return `OSC 1 PULSE WIDTH: ${value}%`;
}

// ---------------------------------------------------------------------------- //
// --- INITIALIZATION ---
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
}

function onMIDIFailure() {
    console.log("Could not access MIDI devices.");
}

function onMIDISuccess(midiAccess) {
    const statusElement = document.getElementById('midi-output-select');
    populateOutputDevices(midiAccess);
    midiAccess.addEventListener('statechange', () => populateOutputDevices(midiAccess));

    const attachSlider = (ccNumber, elementId, helperFn = null) => {
        const slider = document.getElementById(elementId);
        if (!slider || !statusElement) return;

        slider.addEventListener('mousedown', () => {
            originalMidiStatusText = statusElement.options[statusElement.selectedIndex].textContent;
            statusElement.options[statusElement.selectedIndex].textContent = '';
        });

        slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            sendMidiCC(ccNumber, val);
            statusElement.options[statusElement.selectedIndex].textContent = 
                helperFn ? helperFn(val) : `${elementId.toUpperCase().replace('-', ' ')}: ${val}`;
        });

        slider.addEventListener('mouseup', () => {
            statusElement.options[statusElement.selectedIndex].textContent = originalMidiStatusText;
        });
    };

    const attachCheck = (ccNumber, elementId) => {
        const check = document.getElementById(elementId);
        if (check) {
            check.addEventListener('change', (e) => sendMidiCC(ccNumber, e.target.checked ? 127 : 0));
        }
    };

    // Arpeggiator
    // Arpeggiator On/Off feedback
    const arpEnable = document.getElementById('arp-enable');
    if (arpEnable && statusElement) {
        arpEnable.addEventListener('change', (e) => {
            const val = e.target.checked ? 127 : 0;
            sendMidiCC(CC_ARP_ENABLE, val);
            // Show the status on the "screen"
            statusElement.options[statusElement.selectedIndex].textContent = getArpEnableName(val);
        });
    }

    // Arpeggiator Hold feedback
    const arpHold = document.getElementById('arp-hold');
    if (arpHold && statusElement) {
        arpHold.addEventListener('change', (e) => {
            const val = e.target.checked ? 127 : 0;
            sendMidiCC(CC_ARP_HOLD, val);
            // Show the status on the "screen"
            statusElement.options[statusElement.selectedIndex].textContent = getArpHoldName(val);
        });
    }
    attachSlider(CC_ARP_SCALE, 'arp-scale', getArpScaleName);
    attachSlider(CC_ARP_TYPE, 'arp-type', getArpTypeName);
    attachSlider(CC_ARP_CLOCK, 'arp-clock-source', getArpClockName);
    attachSlider(CC_ARP_BPM, 'arp-bpm');
    attachSlider(CC_ARP_GATE, 'arp-gate');
    attachSlider(CC_ARP_SWING, 'arp-swing');

    // Osc Common Checkboxes
    const duoCheck = document.getElementById('osc-duo');
    if (duoCheck) {
        duoCheck.addEventListener('change', (e) => {
            const val = e.target.checked ? 127 : 0;
            sendMidiCC(CC_DUO_MODE, val);
            statusElement.options[statusElement.selectedIndex].textContent = getDuoModeName(val);
            // Reset status text after a moment if you prefer, or leave it
        });
    }

    const syncCheck = document.getElementById('osc-sync');
    if (syncCheck) {
        syncCheck.addEventListener('change', (e) => {
            const val = e.target.checked ? 127 : 0;
            sendMidiCC(CC_DCO_SYNC, val);
            statusElement.options[statusElement.selectedIndex].textContent = getDCOSyncName(val);
        });
    }

    // Osc Common Sliders
    attachSlider(CC_OCTAVE, 'osc-octave', getOctaveName);
    attachSlider(CC_AUX_TYPE, 'osc-aux-type', getAuxTypeName);

    // Levels (Standard numeric feedback)
    attachSlider(CC_AUX_LEVEL, 'osc-aux-level');
    attachSlider(CC_NOISE_LEVEL, 'osc-noise');

    // ['osc1', 'osc2'].forEach(prefix => {
    //     attachSlider(eval(`CC_${prefix.toUpperCase()}_WAVE`), `${prefix}-wave`);
    //     attachSlider(eval(`CC_${prefix.toUpperCase()}_FINE`), `${prefix}-fine`);
    //     attachSlider(eval(`CC_${prefix.toUpperCase()}_COARSE`), `${prefix}-coarse`);
    //     attachSlider(eval(`CC_${prefix.toUpperCase()}_PW`), `${prefix}-pw`);
    // });

    // --- OSC 1 LISTENERS ---
    // Waveform
    attachSlider(CC_OSC1_WAVE, 'osc1-wave', getOscWaveName);

    // Pitch Tuning
    attachSlider(CC_OSC1_COARSE, 'osc1-coarse', getOscCoarseName);
    attachSlider(CC_OSC1_FINE, 'osc1-fine', getOscFineName);

    // Pulse Width
    attachSlider(CC_OSC1_PW, 'osc1-pw', getOscPWName);

    // LFOs, Filter, VCA, EGs
    attachSlider(CC_LFO1_WAVE, 'lfo1-wave'); attachSlider(CC_LFO1_AMT, 'lfo1-amt'); attachSlider(CC_LFO1_RATE, 'lfo1-rate');
    attachSlider(CC_LFO2_WAVE, 'lfo2-wave'); attachSlider(CC_LFO2_AMT, 'lfo2-amt'); attachSlider(CC_LFO2_RATE, 'lfo2-rate');
    attachSlider(CC_VCF_CUTOFF, 'vcf-cutoff'); attachSlider(CC_VCF_RES, 'vcf-res');
    attachSlider(CC_VCF_ENV_AMT, 'vcf-env-amt'); attachSlider(CC_VCF_OSC2_AMT, 'vcf-osc2-amt');
    attachSlider(CC_VCA_LEVEL, 'vca-level'); attachSlider(CC_VCA_MIXER, 'vca-mixer');
    ['vca', 'vcf'].forEach(env => {
        ['a', 'd', 's', 'r'].forEach(stage => attachSlider(eval(`CC_${env.toUpperCase()}_${stage.toUpperCase()}`), `${env}-${stage}`));
    });

    document.getElementById('init-patch-button')?.addEventListener('click', initPatch);
    document.getElementById('random-patch-button')?.addEventListener('click', randomPatch);
}

// --- MIDI UTILITIES ---
function populateOutputDevices(midiAccess) {
    const select = document.getElementById('midi-output-select');
    const currentId = select.value;
    select.innerHTML = '';
    if (midiAccess.outputs.size === 0) {
        select.innerHTML = '<option value="">-- No Devices --</option>';
        return;
    }
    midiAccess.outputs.forEach(output => {
        const opt = new Option(output.name, output.id);
        if (output.id === currentId || output.name.includes("UB-1")) opt.selected = true;
        select.add(opt);
    });
    connectToSelectedOutput(select.value, midiAccess);
}

function connectToSelectedOutput(portId, midiAccess) {
    midiOutput = portId ? midiAccess.outputs.get(portId) : null;
}

function sendMidiCC(cc, val) {
    if (midiOutput) midiOutput.send([0xB0, cc, val]);
}

function initPatch() {
    ALL_PATCH_CONTROLS.forEach(p => {
        const el = document.getElementById(p.id);
        if (!el) return;
        if (p.isCheckbox) el.checked = (p.value === 127); else el.value = p.value;
        sendMidiCC(p.cc, p.value);
    });
}

function randomPatch() {
    ALL_PATCH_CONTROLS.forEach(p => {
        const el = document.getElementById(p.id);
        if (!el) return;
        const val = p.isCheckbox ? (Math.random() > 0.7 ? 127 : 0) : Math.floor(Math.random() * 128);
        if (p.isCheckbox) el.checked = (val === 127); else el.value = val;
        sendMidiCC(p.cc, val);
    });
}