const maxApi = require('max-api');
// const { Scale, Chord, Note } = require('tonal');

// const generateScale = (scale) => Scale.notes(scale);
// const generateChord = (chordName) => Chord.notes(chordName);
// const addOctaves = (chord, octave) => chord.map(item => item + octave);
// const chordToMidi = (chord) => chord.map((item) => Note.midi(item));

// let chordName;
// let chordType;
let pattern;
// let chordProgression;
// let measures;

let key = {
  root: null,
  scale: null
}

// const chordMap = {
//   maj: {
//     label: 'maj',
//     suffix: ''
//   },
//   min: {
//     label: 'min',
//     suffix: 'm'
//   }
// };

let chordButtonState = {
  I: {
    on: false,
    active: true,
  },
  II: {
    on: false,
    active: true,
  },
  III: {
    on: false,
    active: true,
  },
  IV: {
    on: false,
    active: true,
  },
  V: {
    on: false,
    active: true,
  },
  VI: {
    on: false,
    active: true,
  },
  VII: {
    on: false,
    active: true,
  },
  VIII: {
    on: false,
    active: true,
  },
  I2: {
    on: false,
    active: true,
  }
}

// CHORD BUTTONS

const getNumberOfChords = (prog) => {
  const progArr = prog.match(/[a-z]/g);
  const uniqueItems = progArr.filter((item, index) => progArr.indexOf(item) === index);
  return uniqueItems.length;
};

const clearChordButtonState = () => {
  Object.keys(chordButtonState).forEach((item) => {
    chordButtonState[item] = { on: false, active: true }
  });
}

const activateUnonButtons = (isActive) => {
  Object.keys(chordButtonState).forEach((item) => {
    if(!chordButtonState[item].on) {
      chordButtonState[item] = { ...chordButtonState[item], active: isActive }
    }
  });
}

const updateChordButtonState = (chord, value) => {
  const booleanValue = value === 0 ? false : true;
  if (chordButtonState[chord].active){
    chordButtonState[chord] = { ...chordButtonState[chord], on: booleanValue }
  }
  const numberOfChords = pattern ? getNumberOfChords(pattern) : 0;
  const onItems = Object.values(chordButtonState).filter((item) => {
    return item.on;
  }).length;
  const freeSpaces = numberOfChords - onItems;
  if (freeSpaces === 0) {
    activateUnonButtons(false);
  } else if (freeSpaces > 0) {
    activateUnonButtons(true);
  }
}

const updateChord = (toggleName, value) => {
  updateChordButtonState(toggleName, value);
  const state = chordButtonState[toggleName];
  maxApi.outlet(chordButtonState);
}

maxApi.addHandler('toggleI', (value) => {
  const toggleName = 'I';
  updateChord(toggleName, value);
});

maxApi.addHandler('toggleII', (value) => {
  const toggleName = 'II';
  updateChord(toggleName, value);
});

maxApi.addHandler('toggleIII', (value) => {
  const toggleName = 'III';
  updateChord(toggleName, value);
});

maxApi.addHandler('toggleIV', (value) => {
  const toggleName = 'IV';
  updateChord(toggleName, value);
});

maxApi.addHandler('toggleV', (value) => {
  const toggleName = 'V';
  updateChord(toggleName, value);
});

maxApi.addHandler('toggleVI', (value) => {
  const toggleName = 'VI';
  updateChord(toggleName, value);
});

maxApi.addHandler('toggleVII', (value) => {
  const toggleName = 'VII';
  updateChord(toggleName, value);
});

maxApi.addHandler('toggleI2', (value) => {
  const toggleName = 'I2';
  updateChord(toggleName, value);
});

// PATTERN

maxApi.addHandler('updatePattern', (updatedPatt) => {
  pattern = updatedPatt;
  clearChordButtonState();
});

// MEASURES

// // maxApi.addHandler('updateMeasures', (measures) => {
// // });

// KEY

maxApi.addHandler('updateKey', (root, scale) => {
  key.root = root;
  key.scale = scale;
});

// CHORD OUTPUT

// const generateChord = (root, scale) => {
//   const chordSuffix = chordMap[scale].suffix;
//   const formattedChordName = `${root}${chordSuffix}`
//   const chordNotes = generateChord(formattedChordName);
//   const chordNotesWithOctave = addOctaves(chordNotes, 3);
//   const midiChord = chordToMidi(chordNotesWithOctave);
//   return midiChord;
// }

// maxApi.addHandler('generateChords', () => {
//   // const chordsToWrite = [];
//   // chordProgression.forEach((item) => {
//   //   chordsToWrite.push(...generateChord(item));
//   // });
//   // maxApi.post(chordsToWrite[0], 'chordz');
//   // // maxApi.outlet(chordsToWrite);
//   maxApi.outlet([50, 54, 57]);
// });

// ?

// maxApi.addHandler('updateProgression', (button, value) => {
//   // chordProgression = [a, b, c, d];
//   maxApi.post(button, value, 'TEST');
// });
