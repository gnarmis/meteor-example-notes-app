Notes = new Meteor.Collection('notes')

FlowRouter.route('/', {
  action() {
    BlazeLayout.render('layout1', { main: 'notes' })
  }
})

FlowRouter.route('/notes', {
  action() {
    BlazeLayout.render('layout1', { main: 'notes' })
  }
})

FlowRouter.route('/notes/:noteId', {
  action() {
    BlazeLayout.render('layout1', { main: 'note' })
  }
})


if (Meteor.isClient) {
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
}

if (Meteor.isServer) {
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

  var destroy = function() {
    Notes.remove({});
    Meteor.setTimeout(function() {
      destroy();
    }, 15 * 60 * 1000);
  }

  Meteor.startup(() => {
    // code to run on server at startup
  })
}
