import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import NoteForm from '../forms/note-form';

class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNoteForm: false,
      showNote: false,
      note: {}
    };
    this.showNoteForm = this.showNoteForm.bind(this);
    this.hideNoteForm = this.hideNoteForm.bind(this);
    this.showNote = this.showNote.bind(this);
    this.hideNote = this.hideNote.bind(this);
    this.renderNoteForm = this.renderNoteForm.bind(this);
    this.renderNoteModal = this.renderNoteModal.bind(this);
  }

  showNoteForm() {
    this.setState({ showNoteForm: true });
  }

  hideNoteForm() {
    this.setState({ showNoteForm: false });
  }

  showNote(note) {
    this.setState({ showNote: true, note });
  }

  hideNote() {
    this.setState({ showNote: false, note: {} });
  }

  renderNoteForm() {
    const { type, typeId } = this.props;
    const { showNoteForm } = this.state;
    return (
      <Modal show={showNoteForm} onHide={this.hideNoteForm}>
        <Modal.Header closeButton>
          <Modal.Title id="note-form-lg">Create Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NoteForm typeId={typeId} type={type} onClose={this.hideNoteForm} />
        </Modal.Body>
      </Modal>
    );
  }

  renderNoteModal() {
    const { showNote, note } = this.state;
    return (
      <Modal show={showNote} onHide={this.hideNote}>
        <Modal.Header closeButton>
          <Modal.Title id="note-title-lg">{note.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{note.description}</p>
        </Modal.Body>
      </Modal>
    );
  }

  render() {
    const { noteIds, notes } = this.props;
    return (
      <div>
        <Button onClick={this.showNoteForm}>Create Note</Button>
        {!noteIds.length && <p>You don't have any notes, please create one</p>}
        {!!noteIds.length && (
          <ListGroup>
            {noteIds.map(noteKey => {
              const foundNote = notes[noteKey];
              return (
                <ListGroupItem
                  header={foundNote.title}
                  key={`place-note-${noteKey}`}
                  onClick={() => this.showNote(foundNote)}
                >
                  <span className="truncate">{foundNote.description}</span>
                  <span>
                    Created: {new Date(foundNote.createdAt).toLocaleString()}
                  </span>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        )}
        {this.renderNoteModal()}
        {this.renderNoteForm()}
      </div>
    );
  }
}

Notes.defaultProps = {
  noteIds: []
};

Notes.propTypes = {
  noteIds: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.oneOf(['place', 'npc', 'quest']).isRequired,
  typeId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  notes: state.notes.all
});

const NotesContainer = connect(
  mapStateToProps,
  null
)(Notes);

export default NotesContainer;
