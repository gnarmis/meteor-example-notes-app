Template.notes.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('allNotes');
  });
})

Template.notes.helpers({
  notes() {
    return Notes.find({})
  }
})
Template.notes.events({
  'click .new-note': (event, template) => {
    Meteor.call('createBlankNote', function (err, res) {
      if (err) {
        console.log(err)
      } else {
        FlowRouter.go('/notes/' + res)
      }
    });

  },
  'click .delete-note': (event, template) => {
    event.preventDefault()
    BootstrapModalPrompt.prompt({
      title: "Delete Note?",
      content: "Do you really want to delete this note forever?"
    }, function(result) {
      if (result) {
        // User confirmed it, so go do something.
        var noteId = event.target.getAttribute('href')
        Meteor.call('deleteNote', noteId)
      } else {
        // User did not confirm, do nothing.
      }
    });

  }
})

Template.note.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var noteId = FlowRouter.getParam('noteId');
    self.subscribe('singleNote', noteId);
  });
})

Template.note.helpers({
  note: () => {
    let noteId = FlowRouter.getParam('noteId')
    let note = Notes.findOne({_id: noteId}) || {}
    return note
  }
})