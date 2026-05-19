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
    // OSC 1
    { id: 'osc1-wave', cc: CC_OSC1_WAVE, value: 32 },
    { id: 'osc1-fine', cc: CC_OSC1_FINE, value: 50 },
    { id: 'osc1-coarse', cc: CC_OSC1_COARSE, value: 50 },
    { id: 'osc1-pw', cc: CC_OSC1_PW, value: 0 },
    // OSC 2
    { id: 'osc2-wave', cc: CC_OSC2_WAVE, value: 32 },
    { id: 'osc2-fine', cc: CC_OSC2_FINE, value: 50 },
    { id: 'osc2-coarse', cc: CC_OSC2_COARSE, value: 50 },
    { id: 'osc2-pw', cc: CC_OSC2_PW, value: 0 },

    // Filter
    { id: 'vcf-cutoff', cc: CC_VCF_CUTOFF, value: 127 },
    { id: 'vcf-res', cc: CC_VCF_RES, value: 0 },
    { id: 'vcf-env-amt', cc: CC_VCF_ENV_AMT, value: 50 },
    { id: 'vcf-osc2-amt', cc: CC_VCF_OSC2_AMT, value: 0 },

    // VCA
    { id: 'vca-level', cc: CC_VCA_LEVEL, value: 127 },
    { id: 'vca-mixer', cc: CC_VCA_MIXER, value: 50 },

    // EG VCA
    { id: 'vca-a', cc: CC_VCA_A, value: 0 }, 
    { id: 'vca-d', cc: CC_VCA_D, value: 0 },
    { id: 'vca-s', cc: CC_VCA_S, value: 127 }, 
    { id: 'vca-r', cc: CC_VCA_R, value: 0 },
    // EG VCF
    { id: 'vcf-a', cc: CC_VCF_A, value: 0 }, 
    { id: 'vcf-d', cc: CC_VCF_D, value: 0 },
    { id: 'vcf-s', cc: CC_VCF_S, value: 127 }, 
    { id: 'vcf-r', cc: CC_VCF_R, value: 0 },

    // LFO 1
    { id: 'lfo1-wave', cc: CC_LFO1_WAVE, value: 0 },
    { id: 'lfo1-amt', cc: CC_LFO1_AMT, value: 0 },
    { id: 'lfo1-rate', cc: CC_LFO1_RATE, value: 64 },

    // LFO 2
    { id: 'lfo2-wave', cc: CC_LFO2_WAVE, value: 0 },
    { id: 'lfo2-amt', cc: CC_LFO2_AMT, value: 0 },
    { id: 'lfo2-rate', cc: CC_LFO2_RATE, value: 64 }
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

// --- OSC 2 FEEDBACK HELPERS ---

function getOsc2WaveName(value) {
    if (value <= 31) return 'OSC 2: OFF';
    if (value <= 63) return 'OSC 2: SAWTOOTH';
    if (value <= 95) return 'OSC 2: TRIANGLE';
    return 'OSC 2: SQUARE';
}

function getOsc2CoarseName(value) {
    // Range 0-99, center 50
    const semitones = value - 50;
    const sign = semitones > 0 ? '+' : '';
    return `OSC 2 COARSE: ${sign}${semitones} ST`;
}

function getOsc2FineName(value) {
    const detune = value - 50;
    return `OSC 2 FINE: ${detune}`;
}

function getOsc2PWName(value) {
    return `OSC 2 PULSE WIDTH: ${value}%`;
}

// --- LFO 1 FEEDBACK HELPERS ---
function getLfo1WaveName(value) {
    if (value <= 42) return 'LFO 1 WAVE: SAWTOOTH';
    if (value <= 85) return 'LFO 1 WAVE: TRIANGLE';
    return 'LFO 1 WAVE: SQUARE';
}

function getLfo1AmtName(value) {
    return `LFO 1 AMOUNT: ${value}`;
}

function getLfo1RateName(value) {
    return `LFO 1 RATE: ${value}`;
}

// --- LFO 2 FEEDBACK HELPERS ---
function getLfo2WaveName(value) {
    if (value <= 42) return 'LFO 2 WAVE: SAWTOOTH';
    if (value <= 85) return 'LFO 2 WAVE: TRIANGLE';
    return 'LFO 2 WAVE: SQUARE';
}

function getLfo2AmtName(value) {
    return `LFO 2 AMOUNT: ${value}`;
}

function getLfo2RateName(value) {
    return `LFO 2 RATE: ${value}`;
}

// --- OSC 1 WAVEFORM HIGHLIGHT IMAGE UPDATE ---
function updateOsc1Highlight(value) {
    const marker = document.getElementById('osc1-marker');
    if (!marker) return;

    // 3 wave sections
    const sectionWidth = 33.33;

    if (value <= 31) {
        // OSC OFF
        marker.style.display = "none";
    } else {
        marker.style.display = "block";
        marker.style.width = sectionWidth + "%";

        // Map CC value → wave index
        // 32–63  = Saw (0)
        // 64–95  = Tri (1)
        // 96–127 = Square (2)
        let waveIndex = 0;
        if (value > 63 && value <= 95) waveIndex = 1;
        else if (value > 95) waveIndex = 2;

        marker.style.left = (waveIndex * sectionWidth) + "%";
    }
}

// --- OSC 2 WAVEFORM HIGHLIGHT IMAGE UPDATE ---
function updateOsc2Highlight(value) {
    const marker = document.getElementById('osc2-marker');
    if (!marker) return;

    const sectionWidth = 33.33;

    if (value <= 31) {
        marker.style.display = "none";
    } else {
        marker.style.display = "block";
        marker.style.width = sectionWidth + "%";

        let waveIndex = 0;
        if (value > 63 && value <= 95) waveIndex = 1;
        else if (value > 95) waveIndex = 2;

        marker.style.left = (waveIndex * sectionWidth) + "%";
    }
}

// --- LFO 1 WAVEFORM HIGHLIGHT IMAGE UPDATE ---
function updateLfo1Highlight(value) {
    const marker = document.getElementById('lfo1-marker');
    if (!marker) return;

    // 3 wave sections
    const sectionWidth = 33.33;

    // Marker is ALWAYS visible for LFO
    marker.style.display = "block";
    marker.style.width = sectionWidth + "%";

    // Map CC value → wave index
    // 0–42   = Saw (0)
    // 43–85  = Tri (1)
    // 86–127 = Square (2)
    let waveIndex = 0;
    if (value > 42 && value <= 85) waveIndex = 1;
    else if (value > 85) waveIndex = 2;

    marker.style.left = (waveIndex * sectionWidth) + "%";
}

// --- LFO 2 WAVEFORM HIGHLIGHT IMAGE UPDATE ---
function updateLfo2Highlight(value) {
    const marker = document.getElementById('lfo2-marker');
    if (!marker) return;

    const sectionWidth = 33.33;

    // Marker is always visible
    marker.style.display = "block";
    marker.style.width = sectionWidth + "%";

    // 0–42   = Saw
    // 43–85  = Triangle
    // 86–127 = Square
    let waveIndex = 0;
    if (value > 42 && value <= 85) waveIndex = 1;
    else if (value > 85) waveIndex = 2;

    marker.style.left = (waveIndex * sectionWidth) + "%";
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
        const btn = document.getElementById(elementId);
        if (btn) {
            btn.addEventListener('click', () => {
                const isActive = btn.classList.toggle('is-active');
                btn.setAttribute('aria-pressed', isActive);
                sendMidiCC(ccNumber, isActive ? 127 : 0);
            });
        }
    };

    // Arpeggiator
    // Arpeggiator On/Off feedback
    const arpEnable = document.getElementById('arp-enable');
    if (arpEnable && statusElement) {
        arpEnable.addEventListener('click', () => {
            const isActive = arpEnable.classList.toggle('is-active');
            arpEnable.setAttribute('aria-pressed', isActive);
            const val = isActive ? 127 : 0;
            sendMidiCC(CC_ARP_ENABLE, val);
            statusElement.options[statusElement.selectedIndex].textContent = getArpEnableName(val);
        });
    }

    // Arpeggiator Hold feedback
    const arpHold = document.getElementById('arp-hold');
    if (arpHold && statusElement) {
        arpHold.addEventListener('click', () => {
            const isActive = arpHold.classList.toggle('is-active');
            arpHold.setAttribute('aria-pressed', isActive);
            const val = isActive ? 127 : 0;
            sendMidiCC(CC_ARP_HOLD, val);
            statusElement.options[statusElement.selectedIndex].textContent = getArpHoldName(val);
        });
    }
    attachSlider(CC_ARP_SCALE, 'arp-scale', getArpScaleName);
    attachSlider(CC_ARP_TYPE, 'arp-type', getArpTypeName);
    attachSlider(CC_ARP_CLOCK, 'arp-clock-source', getArpClockName);
    attachSlider(CC_ARP_BPM, 'arp-bpm');
    attachSlider(CC_ARP_GATE, 'arp-gate');
    attachSlider(CC_ARP_SWING, 'arp-swing');

    // ---------------------------------------------------------------------------- //  
    // Osc Common Checkboxes
    const duoCheck = document.getElementById('osc-duo');
    if (duoCheck) {
        duoCheck.addEventListener('click', () => {
            const isActive = duoCheck.classList.toggle('is-active');
            duoCheck.setAttribute('aria-pressed', isActive);
            const val = isActive ? 127 : 0;
            sendMidiCC(CC_DUO_MODE, val);
            statusElement.options[statusElement.selectedIndex].textContent = getDuoModeName(val);
        });
    }

    const syncCheck = document.getElementById('osc-sync');
    if (syncCheck) {
        syncCheck.addEventListener('click', () => {
            const isActive = syncCheck.classList.toggle('is-active');
            syncCheck.setAttribute('aria-pressed', isActive);
            const val = isActive ? 127 : 0;
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
    // ---------------------------------------------------------------------------- //

    // --- OSC 1 LISTENERS ---
    // Waveform + Highlight Update
    attachSlider(CC_OSC1_WAVE, 'osc1-wave', (val) => {
        updateOsc1Highlight(val);
        return getOscWaveName(val);
    });

    // Pitch Tuning
    attachSlider(CC_OSC1_COARSE, 'osc1-coarse', getOscCoarseName);
    attachSlider(CC_OSC1_FINE, 'osc1-fine', getOscFineName);

    // Pulse Width
    attachSlider(CC_OSC1_PW, 'osc1-pw', getOscPWName);
    // ---------------------------------------------------------------------------- //

    // --- OSC 2 LISTENERS ---
    // Waveform selection ^ Highlight Update
    attachSlider(CC_OSC2_WAVE, 'osc2-wave', (val) => {
        updateOsc2Highlight(val);
        return getOsc2WaveName(val);
    });

    // Pitch Tuning (Coarse & Fine)
    attachSlider(CC_OSC2_COARSE, 'osc2-coarse', getOsc2CoarseName);
    attachSlider(CC_OSC2_FINE, 'osc2-fine', getOsc2FineName);

    // Pulse Width / PWM
    attachSlider(CC_OSC2_PW, 'osc2-pw', getOsc2PWName);
    // ---------------------------------------------------------------------------- //

    // --- LFO 1 LISTENERS ---
    // Waveform + Highlight Update
    attachSlider(CC_LFO1_WAVE, 'lfo1-wave', (val) => {
        updateLfo1Highlight(val);
        return getLfo1WaveName(val);
    });
    // Initialize LFO 1 wave marker on page load
    const lfo1WaveSlider = document.getElementById('lfo1-wave');
    if (lfo1WaveSlider) {
        updateLfo1Highlight(parseInt(lfo1WaveSlider.value));
    }

    // Amount (Intensity)
    attachSlider(CC_LFO1_AMT, 'lfo1-amt', getLfo1AmtName);

    // Rate (Speed)
    attachSlider(CC_LFO1_RATE, 'lfo1-rate', getLfo1RateName);
    // ---------------------------------------------------------------------------- //

    // --- LFO 2 LISTENERS ---
    // Waveform
    attachSlider(CC_LFO2_WAVE, 'lfo2-wave', (val) => {
        updateLfo2Highlight(val);
        return getLfo2WaveName(val);
    });

    // Initialize LFO 2 wave marker on page load
    const lfo2WaveSlider = document.getElementById('lfo2-wave');
    if (lfo2WaveSlider) {
        updateLfo2Highlight(parseInt(lfo2WaveSlider.value));
    }

    // Amount (Intensity)
    attachSlider(CC_LFO2_AMT, 'lfo2-amt', getLfo2AmtName);

    // Rate (Speed)
    attachSlider(CC_LFO2_RATE, 'lfo2-rate', getLfo2RateName);
    // ---------------------------------------------------------------------------- //

    // Filter, VCA, EGs   
    
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
    // console.log(`Sending MIDI CC: ${cc}, Value: ${val}`); // For debugging
    if (midiOutput) midiOutput.send([0xB0, cc, val]);
}

function initPatch() {
    ALL_PATCH_CONTROLS.forEach(p => {
        const el = document.getElementById(p.id);
        if (!el) return;
        if (p.isCheckbox) {
            el.classList.toggle('is-active', p.value === 127);
            el.setAttribute('aria-pressed', p.value === 127);
        } else {
            el.value = p.value;
        }
        sendMidiCC(p.cc, p.value);
        // UPDATE OSC 1 MARKER:
        if (p.id === 'osc1-wave') {
            updateOsc1Highlight(p.value);
        }
        // UPDATE OSC 2 MARKER:
        if (p.id === 'osc2-wave') {
            updateOsc2Highlight(p.value);
        }
        // UPDATE LFO 1 MARKER:
        if (p.id === 'lfo1-wave') {
            updateLfo1Highlight(p.value);
        }
        // UPDATE LFO 2 MARKER:
        if (p.id === 'lfo2-wave') {
            updateLfo2Highlight(p.value);
        }
    });
}

function randomPatch() {
    ALL_PATCH_CONTROLS.forEach(p => {
        const el = document.getElementById(p.id);
        if (!el) return;
        const val = p.isCheckbox ? (Math.random() > 0.7 ? 127 : 0) : Math.floor(Math.random() * 128);
        if (p.isCheckbox) {
            el.classList.toggle('is-active', val === 127);
            el.setAttribute('aria-pressed', val === 127);
        } else {
            el.value = val;
        }
        sendMidiCC(p.cc, val);
        // UPDATE OSC 1 MARKER:       
        if (p.id === 'osc1-wave') {
            updateOsc1Highlight(val);
        }
        // UPDATE OSC 2 MARKER:
        if (p.id === 'osc2-wave') {
            updateOsc2Highlight(val);
        }
        // UPDATE LFO 1 MARKER:
        if (p.id === 'lfo1-wave') {
            updateLfo1Highlight(val);
        }
        // UPDATE LFO 2 MARKER:
        if (p.id === 'lfo2-wave') {
            updateLfo2Highlight(val);
        }
    });
}

// --- HAMBURGER MENU LOGIC ---
const hamburger = document.getElementById('hamburger-menu');
const sideNav = document.getElementById('side-nav');
const closeBtn = document.getElementById('close-btn');
const aboutBtn = document.getElementById('about-btn');
const versionNumber = document.getElementById('version-number');
const aboutModal = document.getElementById('about-modal');
const aboutModalClose = document.getElementById('about-modal-close');
const footerDisclaimer = document.getElementById('footer-disclaimer');
const footerDisclaimerClose = document.getElementById('footer-disclaimer-close');

// Open Menu
hamburger.addEventListener('click', () => {
    sideNav.style.width = "280px";
});

// Close Menu
closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sideNav.style.width = "0";
});

function openAboutModal(e) {
    if (e) e.preventDefault();
    if (!aboutModal) return;
    aboutModal.classList.remove('modal-hidden');
    aboutModal.setAttribute('aria-hidden', 'false');
}

function closeAboutModal(e) {
    if (e) e.preventDefault();
    if (!aboutModal) return;
    aboutModal.classList.add('modal-hidden');
    aboutModal.setAttribute('aria-hidden', 'true');
}

if (aboutBtn) {
    aboutBtn.addEventListener('click', openAboutModal);
}

if (versionNumber) {
    versionNumber.addEventListener('click', openAboutModal);
}

if (aboutModalClose) {
    aboutModalClose.addEventListener('click', closeAboutModal);
}

// Close menu if clicking anywhere outside the side-nav
window.addEventListener('click', (e) => {
    // Check if the click was NOT the hamburger AND NOT inside the sideNav
    if (e.target !== hamburger && !hamburger.contains(e.target) && e.target !== sideNav && !sideNav.contains(e.target)) {
        sideNav.style.width = "0";
    }

    if (aboutModal && e.target === aboutModal) {
        closeAboutModal();
    }
});

if (footerDisclaimer && footerDisclaimerClose) {
    footerDisclaimerClose.addEventListener('click', () => {
        footerDisclaimer.classList.add('is-hidden');
    });
}
// --- END OF HAMBURGER MENU LOGIC ---


// --- START OF ACCORDION LOGIC ---
const acc = document.getElementsByClassName("accordion-header");

for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        const panel = this.nextElementSibling;
        const isActive = this.classList.contains("active");

        // 1. Close ALL accordion sections first
        for (let j = 0; j < acc.length; j++) {
            acc[j].classList.remove("active");
            acc[j].nextElementSibling.style.maxHeight = null;
        }

        // 2. If the one we clicked wasn't already open, open it now
        if (!isActive) {
            this.classList.add("active");
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}
// --- END OF ACCORDION LOGIC ---

// --- NAV SYNTH SPIN ---
function setupNavSynth() {
    const navWrap = document.querySelector('.nav-synth-wrap');
    if (!navWrap) return;

    const imgs = Array.from(navWrap.querySelectorAll('.nav-synth-img'));
    // Angular offset per ghost layer for depth illusion
    const OFFSETS = [0, 1.5, 3];
    const SPEED = 30;       // degrees per second
    const RETURN_DUR = 0.8; // seconds to ease back to 0°

    let angle = 0;
    let spinning = false;
    let rafId = null;
    let lastTime = null;

    function applyTransforms(a) {
        imgs.forEach((img, i) => {
            const a2 = ((a + OFFSETS[i]) % 360 + 360) % 360;
            img.style.transform = `perspective(300px) rotateY(${a2}deg)`;
        });
    }

    function spinLoop(ts) {
        if (lastTime == null) lastTime = ts;
        const dt = (ts - lastTime) / 1000;
        lastTime = ts;
        angle = (angle + SPEED * dt) % 360;
        applyTransforms(angle);
        if (spinning) rafId = requestAnimationFrame(spinLoop);
    }

    function returnToZero() {
        const remainder = ((angle % 360) + 360) % 360;
        const startAngle = angle;
        // Take the shortest arc back to 0°
        const target = remainder <= 180
            ? startAngle - remainder
            : startAngle + (360 - remainder);
        const startTime = performance.now();

        function returnLoop(ts) {
            if (spinning) return;
            const t = Math.min((ts - startTime) / 1000 / RETURN_DUR, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            angle = startAngle + (target - startAngle) * eased;
            applyTransforms(angle);
            if (t < 1) {
                rafId = requestAnimationFrame(returnLoop);
            } else {
                angle = 0;
                applyTransforms(0);
            }
        }
        rafId = requestAnimationFrame(returnLoop);
    }

    navWrap.addEventListener('mouseenter', () => {
        spinning = true;
        if (rafId) cancelAnimationFrame(rafId);
        lastTime = null;
        rafId = requestAnimationFrame(spinLoop);
    });

    navWrap.addEventListener('mouseleave', () => {
        spinning = false;
        if (rafId) cancelAnimationFrame(rafId);
        returnToZero();
    });
}
setupNavSynth();
// --- END OF NAV SYNTH SPIN ---