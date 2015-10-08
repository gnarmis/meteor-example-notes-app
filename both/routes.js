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