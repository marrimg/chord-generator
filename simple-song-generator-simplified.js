const maxApi = require('max-api');
const { Chord, Note } = require('tonal');
const Key = require('tonal-key');

// I'm not sure why, but the chords are being written one octave lower in Live
const OCTAVE_COMPENSATION = 1;
const DEFAULT_OCTAVE = 3;

const generateChord = (chordName) => Chord.notes(chordName);
const addOctaves = (chord, octave) => chord.map(item => item + octave);
const chordToMidi = (chord) => chord.map((item) => Note.midi(item));
const increaseOctave = (val) => val + OCTAVE_COMPENSATION;

const chordMap = {
  maj: {
    label: 'maj',
    suffix: 'major'
  },
  min: {
    label: 'min',
    suffix: 'minor'
  }
};

let appState = {
  key: {
    root: 'C',
    scale: 'maj'
  },
  pattern: null,
  measures: 1,
  chords: {
    1: 'I',
    2: 'I',
    3: 'I',
    4: 'I'
  },
  octaves: {
    1: increaseOctave(DEFAULT_OCTAVE),
    2: increaseOctave(DEFAULT_OCTAVE),
    3: increaseOctave(DEFAULT_OCTAVE),
    4: increaseOctave(DEFAULT_OCTAVE)
  },
  midiOutput: null,
}

// CHORD DROPDOWNS

const getSelectedChords = () => {
  const chords = {};
  Object.keys(appState.chords).forEach(item => {
    if(appState.chords[item]) {
      chords[item] = appState.chords[item]
      };
    });
  return chords;
}

maxApi.addHandler('set1', (value) => {
  const chord = 1;
  appState.chords[chord] = value;
});

maxApi.addHandler('set2', (value) => {
  const chord = 2;
  appState.chords[chord] = value;
});

maxApi.addHandler('set3', (value) => {
  const chord = 3;
  appState.chords[chord] = value;
});

maxApi.addHandler('set4', (value) => {
  const chord = 4;
  appState.chords[chord] = value;
});

// OCTAVES

maxApi.addHandler('oct1', (value) => {
  const octave = 1;
  appState.octaves[octave] = increaseOctave(value);
  maxApi.post(appState.octaves[octave], 'VALOCT');
});

maxApi.addHandler('oct2', (value) => {
  const octave = 2;
  appState.octaves[octave] = increaseOctave(value);
});

maxApi.addHandler('oct3', (value) => {
  const octave = 3;
  appState.octaves[octave] = increaseOctave(value);
});

maxApi.addHandler('oct4', (value) => {
  const octave = 4;
  appState.octaves[octave] = increaseOctave(value);
});

// PATTERN

maxApi.addHandler('updatePattern', (updatedPatt) => {
  appState.pattern = updatedPatt;
});

// MEASURES

maxApi.addHandler('updateLength', (measures) => {
  appState.measures = measures;
  maxApi.setDict('lengthVal', { length: appState.measures });
});

// KEY

maxApi.addHandler('updateScale', (scale) => {
  appState.key.scale = scale;
});

maxApi.addHandler('updateRoot', (root) => {
  appState.key.root = root;
});

// CHORD OUTPUT

const generateChordsForKey = (root, scale) => { 
  const chord = `${root} ${chordMap[scale].suffix}`
  const selChord = getSelectedChords();
  const chordPatt = Object.values(selChord);
  maxApi.post(Key.triads(chord, chordPatt));
  return Key.triads(chord, chordPatt);
};

const generateMidiChord = (chordName, oct) => {
  const chordNotes = generateChord(chordName);
  const chordWithOctaves = addOctaves(chordNotes, oct);
  maxApi.post(chordWithOctaves, 'CHORDWIT');
  return chordToMidi(chordWithOctaves);
}

maxApi.addHandler('generateChords', () => {
  const root = appState.key.root;
  const scale = appState.key.scale;
  const selectedChords = generateChordsForKey(root, scale);
  const chordsToWrite = selectedChords.reduce((acc, item, index) => {
    const oct = appState.octaves[index + 1]
    acc[index] = generateMidiChord(item, oct);
    return acc;
  }, {});
  appState.midiOutput = chordsToWrite;
  maxApi.setDict('midiOutputVals', appState.midiOutput);
  maxApi.outletBang();
});

