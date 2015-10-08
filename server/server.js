Meteor.publish('allNotes', function() {
  return Notes.find({})
})

Meteor.publish('singleNote', function(id) {
  return Notes.find({_id: id});
})

Meteor.methods({
  createBlankNote: function() {
    var noteId = Notes.insert({title: "Untitled", content: "", createdAt: new Date()})
    return noteId
  },
  deleteNote: function(noteId) {
    Notes.remove({_id: noteId})
    return true
  }
})

var resetAll = () => {
  Notes.remove({})
  Meteor.call('createBlankNote');
  Meteor.setTimeout(function() {
    resetAll();
  }, 15 * 60 * 1000)
}
resetAll()

Meteor.startup(() => {
  // code to run on server at startup
})