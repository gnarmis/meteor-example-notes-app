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
  Template.notes.helpers({
    notes() {
      return Notes.find({})
    }
  })
  Template.notes.events({
    'click .new-note': (event, template) => {
      let noteId = Notes.insert({title: "Untitled", content: "", createdAt: new Date()})
      FlowRouter.go('/notes/' + noteId)
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
          Notes.remove({_id: noteId})
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
