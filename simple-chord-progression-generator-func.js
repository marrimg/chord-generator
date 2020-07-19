function Note(pitch, start, duration) {
  this.pitch = pitch;
  this.start = start;
  this.duration = duration;
  this.velocity = 100;
  this.muted = 0;
}

function addChord(notes) {
  var path = "live_set tracks 0 clip_slots 0 clip";
  var obj = new LiveAPI(path);
  obj.call("select_all_notes");
  obj.call("replace_selected_notes");
  obj.call("notes", notes.length);
  notes.forEach(function(note) {
    obj.call(
      "note",
      note.pitch,
      note.start.toFixed(4),
      note.duration.toFixed(4),
      note.velocity,
      note.muted
    );
  });
  obj.call("done");
}

function setNotes() {
  var d1 = new Dict("midiOutputVals");
  var d2 = new Dict("lengthVal");
  var length = d2.get("length");
  var keys = d1.getkeys();
  var notes = [];
  if (keys) {
    keys.forEach(function(key, index) {
      const notesFromKey = d1.get(key);
      notesFromKey &&
        notesFromKey.forEach(function(note) {
          var start = index * length;
          var duration = length;
          notes.push(new Note(note, start, duration));
        });
    });
    addChord(notes);
  }
}
