const maxApi = require('max-api');
const { Scale, Chord, Note } = require('tonal');
const Key = require('tonal-key');

const generateScale = (scale) => Scale.notes(scale);
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

const activebgoncolorMap = {
  1: [0.992, 0.188, 0.188, 1.000],
  2: [0.992, 0.506, 0.188, 1.000],
  3: [1.000, 0.710, 0.196, 1.000],
  4: [0.996, 0.894, 0.000, 1.000]
}

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
  chordButtons: {
    I: {
      on: false,
      active: true,
      positionInPatt: 0,
      activebgoncolor: null
    },
    II: {
      on: false,
      active: true,
      positionInPatt: 0,
      activebgoncolor: null
    },
    III: {
      on: false,
      active: true,
      positionInPatt: 0,
      activebgoncolor: null
    },
    IV: {
      on: false,
      active: true,
      positionInPatt: 0,
      activebgoncolor: null
    },
    V: {
      on: false,
      active: true,
      positionInPatt: 0,
      activebgoncolor: null
    },
    VI: {
      on: false,
      active: true,
      positionInPatt: 0,
      activebgoncolor: null
    },
    VII: {
      on: false,
      active: true,
      positionInPatt: 0,
      activebgoncolor: null
    },
    VIII: {
      on: false,
      active: true,
      positionInPatt: 0,
      activebgoncolor: null
    },
    I2: {
      on: false,
      active: true,
      positionInPatt: 0,
      activebgoncolor: null
    }
  },
  key: {
    root: null,
    scale: null
  },
  pattern: null,
  measures: null,
  midiOutput: null,
}

// CHORD BUTTONS

const getNumberOfChords = (prog) => {
  const progArr = prog.match(/[a-z]/g);
  const uniqueItems = progArr.filter((item, index) => progArr.indexOf(item) === index);
  return uniqueItems.length;
};

const getSelectedChords = () => {
  const chords = {};
  Object.keys(appState.chordButtons).forEach(item => {
    if(appState.chordButtons[item].on) {
      chords[item] = appState.chordButtons[item]
      };
    });
  return chords;
}

const clearChordButtonState = () => {
  Object.keys(appState.chordButtons).forEach((item) => {
    appState.chordButtons[item] = { on: false, active: true, positionInPatt: 0, activebgoncolor: null }
  });
}

const activateUnonButtons = (isActive) => {
  Object.keys(appState.chordButtons).forEach((item) => {
    if(!appState.chordButtons[item].on) {
      appState.chordButtons[item] = { ...appState.chordButtons[item], active: isActive }
    }
  });
}

const updatePositionInPattern = (chord, isOn) => {
  if (isOn) {
      const existingPositions = Object.values(appState.chordButtons).map(item => item.positionInPatt);
      const patternInNumbers = convertPatternToNumbers(appState.pattern);
      const highestExistingVal = Math.max(...existingPositions);
      const highestValInPatt = Math.max(...patternInNumbers);
      if (highestExistingVal <= highestValInPatt) {
        const fillGaps = [...Array(highestExistingVal).keys()].map(item => item + 1);
        const gapToFill = fillGaps.find(item => !existingPositions.includes(item));
        if(gapToFill) {
          appState.chordButtons[chord].positionInPatt = gapToFill;
          appState.chordButtons[chord].activebgoncolor = activebgoncolorMap[gapToFill];
        } else if (!gapToFill && highestExistingVal < highestValInPatt) {
            appState.chordButtons[chord].positionInPatt = highestExistingVal + 1;
            appState.chordButtons[chord].activebgoncolor = activebgoncolorMap[highestExistingVal + 1];
        }
      }
  } else {
    appState.chordButtons[chord].positionInPatt = 0;
    appState.chordButtons[chord].activebgoncolor = null;
  }
}

const updateActiveChords = () => {
  const numberOfChords = appState.pattern ? getNumberOfChords(appState.pattern) : 0;
  const onItems = Object.values(appState.chordButtons).filter((item) => {
    return item.on;
  }).length;
  const freeSpaces = numberOfChords - onItems;
  if (freeSpaces === 0) {
    activateUnonButtons(false);
  } else if (freeSpaces > 0) {
    activateUnonButtons(true);
  }
}

const updateChordButtonState = (chord, value) => {
  const booleanValue = value === 0 ? false : true;
  if (appState.chordButtons[chord].active){
    appState.chordButtons[chord] = { ...appState.chordButtons[chord], on: booleanValue }
    updatePositionInPattern(chord, booleanValue);
  }
  updateActiveChords();
}

const updateChord = (toggleName, value) => {
  updateChordButtonState(toggleName, value);
  const state = appState.chordButtons[toggleName];
  maxApi.outlet(appState);
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

const convertPatternToNumbers = (pattern) => {
  return pattern.match(/[a-z]/g).map(item => lettersToNumberMap[item]);
}

maxApi.addHandler('updatePattern', (updatedPatt) => {
  appState.pattern = updatedPatt;
  clearChordButtonState();
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
  const buildChordPatt = convertPatternToNumbers(appState.pattern).map(item => {
    return Object.keys(selChord).filter((chord, index) => {
      return Object.values(selChord)[index].positionInPatt === item;
    })[0];
  });
  return Key.triads(chord, buildChordPatt);
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
  // maxApi.post(appState, 'SLE');
  maxApi.outlet(appState);
});

// ?

// maxApi.addHandler('updateProgression', (button, value) => {
//   // chordProgression = [a, b, c, d];
//   maxApi.post(button, value, 'TEST');
// });
