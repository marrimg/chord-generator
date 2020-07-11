const maxApi = require('max-api');
const { Scale, Chord, Note } = require('tonal');
const Key = require('tonal-key');

// const generateScale = (scale) => Scale.notes(scale);
const generateChord = (chordName) => Chord.notes(chordName);
const addOctaves = (chord, octave) => chord.map(item => item + octave);
const chordToMidi = (chord) => chord.map((item) => Note.midi(item));

// let chordName;
// let chordType;
// let chordProgression;
// let measures;

const lettersToNumberMap = {
  a: 1,
  b: 2,
  c: 3,
  d: 4
};

// const activebgoncolorMap = {
//   1: [0.992, 0.188, 0.188, 1.000],
//   2: [0.992, 0.506, 0.188, 1.000],
//   3: [1.000, 0.710, 0.196, 1.000],
//   4: [0.996, 0.894, 0.000, 1.000]
// }

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
  measures: null,
  chords: {
    1: 'I',
    2: 'I',
    3: 'I',
    4: 'I'
  },
  midiOutput: null,
}

// CHORD BUTTONS

// const getNumberOfChords = (prog) => {
//   const progArr = prog.match(/[a-z]/g);
//   const uniqueItems = progArr.filter((item, index) => progArr.indexOf(item) === index);
//   return uniqueItems.length;
// };

const getSelectedChords = () => {
  const chords = {};
  Object.keys(appState.chords).forEach(item => {
    if(appState.chords[item]) {
      chords[item] = appState.chords[item]
      };
    });
  return chords;
}

// const clearChordState = () => {
//   Object.keys(appState.chords).forEach((item) => {
//     appState.chords[item] = null;
//   });
// }

// const activateUnonButtons = (isActive) => {
//   Object.keys(appState.chordButtons).forEach((item) => {
//     if(!appState.chordButtons[item].on) {
//       appState.chordButtons[item] = { ...appState.chordButtons[item], active: isActive }
//     }
//   });
// }

// const updatePositionInPattern = (chord, isOn) => {
//   if (isOn) {
//       const existingPositions = Object.values(appState.chordButtons).map(item => item.positionInPatt);
//       const patternInNumbers = convertPatternToNumbers(appState.pattern);
//       const highestExistingVal = Math.max(...existingPositions);
//       const highestValInPatt = Math.max(...patternInNumbers);
//       if (highestExistingVal <= highestValInPatt) {
//         const fillGaps = [...Array(highestExistingVal).keys()].map(item => item + 1);
//         const gapToFill = fillGaps.find(item => !existingPositions.includes(item));
//         if(gapToFill) {
//           appState.chordButtons[chord].positionInPatt = gapToFill;
//           appState.chordButtons[chord].activebgoncolor = activebgoncolorMap[gapToFill];
//         } else if (!gapToFill && highestExistingVal < highestValInPatt) {
//             appState.chordButtons[chord].positionInPatt = highestExistingVal + 1;
//             appState.chordButtons[chord].activebgoncolor = activebgoncolorMap[highestExistingVal + 1];
//         }
//       }
//   } else {
//     appState.chordButtons[chord].positionInPatt = 0;
//     appState.chordButtons[chord].activebgoncolor = null;
//   }
// }

// const updateActiveChords = () => {
//   const numberOfChords = appState.pattern ? getNumberOfChords(appState.pattern) : 0;
//   const onItems = Object.values(appState.chordButtons).filter((item) => {
//     return item.on;
//   }).length;
//   const freeSpaces = numberOfChords - onItems;
//   if (freeSpaces === 0) {
//     activateUnonButtons(false);
//   } else if (freeSpaces > 0) {
//     activateUnonButtons(true);
//   }
// }

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

// const convertPatternToNumbers = (pattern) => {
//   return pattern.match(/[a-z]/g).map(item => lettersToNumberMap[item]);
// }

maxApi.addHandler('updatePattern', (updatedPatt) => {
  appState.pattern = updatedPatt;
  // clearChordState();
});

// MEASURES

maxApi.addHandler('updateMeasures', (measures) => {
  appState.measures = measures;
});

// KEY

maxApi.addHandler('updateKey', (root, scale) => {
  appState.key.root = root;
  appState.key.scale = scale;
});

// CHORD OUTPUT

// const placeChordsInPattern = (chords) => {
//   const letters = appState.pattern.match(/[a-z]/g);
//   letters.map((item) => {

//   });
// }

const generateChordsForKey = (root, scale) => { 
  const chord = `${root} ${chordMap[scale].suffix}`
  const selChord = getSelectedChords();
  const chordPatt = Object.values(selChord);
  // maxApi.post(chordPatt, 'SELCHORD');
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
  // selectedChords.forEach((item) => {
  //   chordsToWrite.push(generateMidiChord(item));
  // });
  appState.midiOutput = chordsToWrite;
  // maxApi.post(appState.midiOutput, 'SLE');
  maxApi.setDict('midiOutputVals', appState.midiOutput);
  // maxApi.outlet(appState.midiOutput);
});

// ?

// maxApi.addHandler('updateProgression', (button, value) => {
//   // chordProgression = [a, b, c, d];
//   maxApi.post(button, value, 'TEST');
// });
