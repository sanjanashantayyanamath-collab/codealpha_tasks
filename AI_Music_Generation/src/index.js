// AI_Music_Generation/src/script.js

let generatedSequence = [];
let synth;
let transportLoop;

const SCALE = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
const DURATIONS = ['8n', '4n', '2n']; // Eighth note, Quarter note, Half note
const SEQUENCE_LENGTH = 32; // Total notes to generate

function initSynth() {
    // Initialize a simple synthesizer
    synth = new Tone.Synth().toDestination();
    Tone.Transport.bpm.value = 120;
}

function generateSequence() {
    generatedSequence = [];
    let time = 0;

    for (let i = 0; i < SEQUENCE_LENGTH; i++) {
        const noteName = SCALE[Math.floor(Math.random() * SCALE.length)];
        const durationName = DURATIONS[Math.floor(Math.random() * DURATIONS.length)];
        
        generatedSequence.push({ 
            time: Tone.Time(time).toBarsBeatsSixteenths(), 
            note: noteName, 
            duration: durationName 
        });

        // Advance time based on the chosen duration
        time += Tone.Time(durationName).toSeconds();
    }
    document.getElementById('outputLog').textContent = JSON.stringify(generatedSequence, null, 2);
    document.getElementById('downloadButton').disabled = false;
    return generatedSequence;
}

function generateMusic() {
    // Start the audio context if it hasn't been started
    if (Tone.context.state !== 'running') {
        Tone.start();
    }

    // Stop and clear previous music
    stopMusic();
    if (!synth) initSynth();

    document.getElementById('status').textContent = "Generating a random melody...";

    const sequence = generateSequence();

    let noteIndex = 0;
    transportLoop = new Tone.Loop(time => {
        if (noteIndex < sequence.length) {
            const item = sequence[noteIndex];
            synth.triggerAttackRelease(item.note, item.duration, time);
            console.log(`Playing: ${item.note} at ${item.time}`);
            noteIndex++;
        } else {
            // Stop loop after sequence finishes
            transportLoop.stop();
            Tone.Transport.stop();
            document.getElementById('status').textContent = "Sequence finished.";
            document.getElementById('stopButton').disabled = true;
        }
    }, '8n').start(0); 
    // The loop interval is set to '8n' to check for the next note

    Tone.Transport.start();
    document.getElementById('status').textContent = "Playing generated music...";
    document.getElementById('stopButton').disabled = false;
}

function stopMusic() {
    if (transportLoop) {
        transportLoop.stop();
        Tone.Transport.stop();
    }
    document.getElementById('status').textContent = "Music stopped.";
    document.getElementById('stopButton').disabled = true;
}

function downloadMusic() {
    if (generatedSequence.length === 0) {
        alert("Generate music first!");
        return;
    }

    const data = JSON.stringify(generatedSequence, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_music_sequence.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("Generated sequence downloaded as JSON.");
}

// Initialize synth when the page loads
initSynth();