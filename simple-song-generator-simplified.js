const maxApi = require('max-api');
const { Chord, Note } = require('tonal');
const Key = require('tonal-key');

const generateChord = (chordName) => Chord.notes(chordName);
const addOctaves = (chord, octave) => chord.map(item => item + octave);
const chordToMidi = (chord) => chord.map((item) => Note.midi(item));

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

const updateChordState = (chord, value) => {
  appState.chords[chord] = value;
}

maxApi.addHandler('set1', (value) => {
  const chord = 1;
  updateChordState(chord, value);
});

maxApi.addHandler('set2', (value) => {
  const chord = 2;
  updateChordState(chord, value);
});

maxApi.addHandler('set3', (value) => {
  const chord = 3;
  updateChordState(chord, value);
});

maxApi.addHandler('set4', (value) => {
  const chord = 4;
  updateChordState(chord, value);
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
  maxApi.post(chord, 'CHORD');
  const selChord = getSelectedChords();
  const chordPatt = Object.values(selChord);
  maxApi.post(Key.triads(chord, chordPatt));
  return Key.triads(chord, chordPatt);
};

const generateMidiChord = (chordName) => {
  const chordNotes = generateChord(chordName);
  const chordWithOctaves = addOctaves(chordNotes, 3);
  return chordToMidi(chordWithOctaves);
}

maxApi.addHandler('generateChords', () => {
  const root = appState.key.root;
  const scale = appState.key.scale;
  const selectedChords = generateChordsForKey(root, scale);
  const chordsToWrite = selectedChords.reduce((acc, item, index) => {
    acc[index] = generateMidiChord(item);
    return acc;
  }, {});
  appState.midiOutput = chordsToWrite;
  maxApi.setDict('midiOutputVals', appState.midiOutput);
  maxApi.outletBang();
});

