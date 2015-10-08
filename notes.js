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
  Meteor.startup(() => {
    // code to run on server at startup
  })
}
