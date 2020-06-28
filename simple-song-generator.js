const maxApi = require('max-api');
// const { Scale, Chord, Note } = require('tonal');

// const generateScale = (scale) => Scale.notes(scale);
// const generateChord = (chordName) => Chord.notes(chordName);
// const addOctaves = (chord, octave) => chord.map(item => item + octave);
// const chordToMidi = (chord) => chord.map((item) => Note.midi(item));

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
    selected: false,
    disabled: false
  },
  II: {
    selected: false,
    disabled: false
  },
  III: {
    selected: false,
    disabled: false
  },
  IV: {
    selected: false,
    disabled: false
  },
  V: {
    selected: false,
    disabled: false
  },
  VI: {
    selected: false,
    disabled: false
  },
  VII: {
    selected: false,
    disabled: false
  },
  VIII: {
    selected: false,
    disabled: false
  },
  I2: {
    selected: false,
    disabled: false
  }
}

// // let chordName;
// // let chordType;

let pattern = 'a/b/a/b';
// let chordProgression;

// let key = {
//   root,
//   scale
// }
// let measures;

const getNumberOfChords = (prog) => {
  const progArr = prog.match(/[a-z]/g);
  const uniqueItems = progArr.reduce((acc, item, i) => {
      if (!acc.includes(item)) {
        acc[i] = item;
      }
      return acc;
  }, []);
  return uniqueItems.length;
};

// const generateChord = (root, scale) => {
//   const chordSuffix = chordMap[scale].suffix;
//   const formattedChordName = `${root}${chordSuffix}`
//   const chordNotes = generateChord(formattedChordName);
//   const chordNotesWithOctave = addOctaves(chordNotes, 3);
//   const midiChord = chordToMidi(chordNotesWithOctave);
//   return midiChord;
// }

// maxApi.addHandler('updateKey', (root, scale) => {
//   key.root = root;
//   key.scale = type;
// });

// // maxApi.addHandler('updateMeasures', (measures) => {

// // });

// // maxApi.addHandler('updatePattern', (pattern) => {
// //   pattern = pattern;
// //   numberOfChords = getNumberOfChords(pattern);
// // });

// maxApi.addHandler('updateProgression', (button, value) => {
//   // chordProgression = [a, b, c, d];
//   maxApi.post(button, value, 'TEST');
// });

// maxApi.addHandler('generateChords', () => {
//   // const chordsToWrite = [];
//   // chordProgression.forEach((item) => {
//   //   chordsToWrite.push(...generateChord(item));
//   // });
//   // maxApi.post(chordsToWrite[0], 'chordz');
//   // // maxApi.outlet(chordsToWrite);
//   maxApi.outlet([50, 54, 57]);
// });

const clearChordButtonState = () => {
  Object.keys(chordButtonState).forEach((item) => {
    chordButtonState[item] = { selected: false, disabled: false }
  });
}

const disableUnselectedButtons = (isDisabled) => {
  Object.keys(chordButtonState).forEach((item) => {
    if(!chordButtonState[item].selected) {
      chordButtonState[item] = { ...chordButtonState[item], disabled: isDisabled }
    }
  });
}

const updateChordButtonState = (chord, value) => {
  const booleanValue = value === 0 ? false : true;
  if (!chordButtonState[chord].disabled){
    chordButtonState[chord] = { ...chordButtonState[chord], selected: booleanValue }
  }
  const numberOfChords = getNumberOfChords(pattern);
  const selectedItems = Object.values(chordButtonState).filter((item) => {
    return item.selected;
  }).length;
  const freeSpaces = numberOfChords - selectedItems;
  if (freeSpaces === 0) {
    disableUnselectedButtons(true);
  } else if (freeSpaces > 0) {
    disableUnselectedButtons(false);
  }
}

maxApi.addHandler('toggleI', (value) => {
  updateChordButtonState('I', value);
  maxApi.post(chordButtonState);
  // maxApi.outlet(chordButtonState[value]);
});

maxApi.addHandler('toggleII', (value) => {
  updateChordButtonState('II', value);
  maxApi.post(chordButtonState);
});

maxApi.addHandler('toggleIII', (value) => {
  updateChordButtonState('III', value);
  maxApi.post(chordButtonState);
});

maxApi.addHandler('toggleIV', (value) => {
  updateChordButtonState('IV', value);
});

maxApi.addHandler('toggleV', (value) => {
  updateChordButtonState('V', value);
});

maxApi.addHandler('toggleVI', (value) => {
  updateChordButtonState('VI', value);
});

maxApi.addHandler('toggleVII', (value) => {
  updateChordButtonState('VII', value);
});

maxApi.addHandler('toggleI2', (value) => {
  updateChordButtonState('I2', value);
});