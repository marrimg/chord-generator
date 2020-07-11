function Note(pitch, start, duration){
  this.pitch = pitch;
  this.start = start;
  this.duration = duration;
  this.velocity = 100;
  this.muted = 0;
}

function addChord(notes) {
  var path = "live_set tracks 0 clip_slots 0 clip";
  var obj = new LiveAPI(path);
  obj.call("set_notes");
  obj.call("notes", notes.length); 
  // notes.forEach(function (note) { 
  //   // post(note.pitch, 'HI FROM JS');
  //   obj.call("note", note.pitch, note.start.toFixed(4), note.duration.toFixed(4), note.velocity, note.muted);
  // });
  for (i = 0; i < notes.length; i++){
    // post(notes[i].pitch, 'HI FROM JS');
    obj.call("note", notes[i].pitch, notes[i].start.toFixed(4), notes[i].duration.toFixed(4), notes[i].velocity, notes[i].muted);
  }
  obj.call("done");
}

function setNotes() {
  var d1 = new Dict("midiOutputVals");
  var keys = d1.getkeys();
  var notes = [];
  post(JSON.stringify(d1.getkeys()), 'D1NEWWW');
  if (keys) {
    // keys.forEach(function (key) {
    //   const notesFromKey = d1.get(key);
    //   notesFromKey && notesFromKey.forEach(function (note, index) {
    //     var position = index + 1;
    //     notes.push(new Note(note, position, 1));
    //   });
    // });
    for (i = 0; i < keys.length; i++){
      const notesFromKey = d1.get(keys[i]);
      for (j = 0; j < notesFromKey.length; j++){
        // const notef = new Note(notesFromKey[j], position, 1);
        // post(JSON.stringify(notesFromKey[j]), "hi");
        notes.push(new Note(notesFromKey[j], i, 1));
      }
      // notesFromKey && notesFromKey.forEach(function (note, index) {
      //   var position = index + 1;
      //   notes.push(new Note(note, position, 1));
      // });
    }
    // post(JSON.stringify(notes));
    addChord(notes);
  }
  // var path = "live_set tracks 0 clip_slots 0 clip";
  // var obj = new LiveAPI(path);
  // // obj.call("create_clip", 0, 1);
  // obj.call("set_notes");
  // obj.call("notes", 1);
  // obj.call("note", 33, "1.0", "1.0", 100, 0);
  // obj.call("done");
}

// var path = "live_set tracks 0 clip_slots 0 clip";
// var obj = new LiveAPI(path);
// obj.call("create_clip", 0, 1);
// // post(note2);
// obj.call("set_notes");
// obj.call("notes", 1);
// obj.call("note", 33, "1.0", "1.0", 100, 0);
// // obj.call("note", note2, "1.0", "1.0", 100, 0);
// // obj.call("note", note3, "1.0", "1.0", 100, 0);
// obj.call("done");

// function addChord(notes) {
//     var path = "live_set tracks 0 clip_slots 0 clip";
//     var obj = new LiveAPI(path);
//     obj.call("set_notes");
//     obj.call("notes", 3);
//     for (i = 0; i < notes.length; i++){
//         obj.call("note", notes[i], "1.0", "1.0", 100, 0);
//     }
//     // obj.call("note", notes, "1.0", "1.0", 100, 0);
//     post(notes);
//     // obj.call("note", "65", "1.0", "1.0", 100, 0);
//     // obj.call("note", "60", "1.0", "1.0", 100, 0);
//     // obj.call("note", "55", "1.0", "1.0", 100, 0);
//     // obj.call("note", "50", "1.0", "1.0", 100, 0);
//     obj.call("done");
// }