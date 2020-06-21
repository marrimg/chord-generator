const maxApi = require('max-api');
const { Scale, Chord, Note } = require('tonal');

const generateScale = (scale) => Scale.notes(scale);
const generateChord = (chordName) => Chord.notes(chordName);
const addOctaves = (chord, octave) => chord.map(item => item + octave);
const chordToMidi = (chord) => chord.map((item) => Note.midi(item));

const chordMap = {
  maj: {
    label: 'maj',
    suffix: ''
  },
  min: {
    label: 'min',
    suffix: 'm'
  }
};

let chordName;
let chordType;

maxApi.addHandler('updateChord', (chord, type) => {
  chordName = chord;
  chordType = type;
});

maxApi.addHandler('generateChord', () => {
  const chordSuffix = chordMap[chordType].suffix;
  const formattedChordName = `${chordName}${chordSuffix}`
  const chordNotes = generateChord(formattedChordName);
  const chordNotesWithOctave = addOctaves(chordNotes, 3);
  const midiChord = chordToMidi(chordNotesWithOctave);
  maxApi.post(chordNotesWithOctave);
  maxApi.outlet(midiChord);
});