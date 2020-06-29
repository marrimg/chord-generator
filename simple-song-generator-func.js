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
  notes.forEach(function (note) {  
    // post(note.pitch);
    obj.call("note", note.pitch, note.start.toFixed(4), note.duration.toFixed(4), note.velocity, note.muted);
  });
  obj.call("done");
}

function setNotes(noteOne, noteTwo, noteThree) {
  var notes = [];
  notes.push(new Note(noteOne, 0, 1));
  notes.push(new Note(noteTwo, 0, 1));
  notes.push(new Note(noteThree, 0, 1));
  // post(notes);
  addChord(notes);
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
//         post('fuck u!');
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