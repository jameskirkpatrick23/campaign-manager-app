import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ListGroup,
  ListGroupItem,
  Button,
  Modal,
  Row,
  Col,
  Glyphicon
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NoteForm from '../forms/note-form';
import * as NoteActions from '../redux/actions/notes';

class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNoteForm: false,
      showDeleteNoteForm: false,
      showNote: false,
      note: {},
      formAction: null
    };
    this.showCreateNoteForm = this.showCreateNoteForm.bind(this);
    this.showUpdateNoteForm = this.showUpdateNoteForm.bind(this);
    this.hideNoteForm = this.hideNoteForm.bind(this);
    this.showNote = this.showNote.bind(this);
    this.hideNote = this.hideNote.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.renderNoteForm = this.renderNoteForm.bind(this);
    this.renderDeleteNoteForm = this.renderDeleteNoteForm.bind(this);
    this.hideDeleteNoteForm = this.hideDeleteNoteForm.bind(this);
    this.renderNoteModal = this.renderNoteModal.bind(this);
  }

  showCreateNoteForm = () => {
    this.setState({ showNoteForm: true, note: {}, formAction: 'create' });
  };

  showUpdateNoteForm = note => {
    this.setState({
      showNote: false,
      showNoteForm: true,
      note,
      formAction: 'update'
    });
  };

  hideNoteForm = () => {
    this.setState({
      showNoteForm: false,
      formAction: 'create',
      note: {}
    });
  };

  showDeleteNoteForm = note => {
    this.setState({
      showDeleteNoteForm: true,
      showNote: false,
      showNoteForm: false,
      note
    });
  };

  hideDeleteNoteForm = () => {
    this.setState({
      showDeleteNoteForm: false,
      note: {}
    });
  };

  confirmDelete = note => {
    const { deleteNote } = this.props;
    deleteNote(note);
    this.hideDeleteNoteForm();
  };

  renderDeleteNoteForm = () => {
    const { showDeleteNoteForm, note } = this.state;
    return (
      <Modal show={showDeleteNoteForm} onHide={this.hideDeleteNoteForm}>
        <Modal.Header closeButton>
          <Modal.Title id="delete-note-form-lg">Delete Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={12}>
              <p>Are you sure you wish to delete this note?</p>
              <p>Doing so will remove it from all searches.</p>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Button bsStyle="danger" onClick={() => this.confirmDelete(note)}>
                Delete
              </Button>
            </Col>
            <Col xs={6}>
              <Button onClick={this.hideDeleteNoteForm}>Cancel</Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  };

  renderNoteForm = () => {
    const { type, typeId } = this.props;
    const { showNoteForm, note, formAction } = this.state;
    return (
      <Modal show={showNoteForm} onHide={this.hideNoteForm}>
        <Modal.Header closeButton>
          <Modal.Title id="note-form-lg">
            {formAction === 'update' ? 'Update' : 'Create'} Note
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NoteForm
            typeId={typeId}
            type={type}
            onClose={this.hideNoteForm}
            note={note}
            formAction={formAction}
          />
        </Modal.Body>
      </Modal>
    );
  };

  showNote = note => {
    this.setState({ showNote: true, note });
  };

  hideNote = () => {
    this.setState({ showNote: false, note: {} });
  };

  renderNoteModal = () => {
    const { showNote, note } = this.state;
    return (
      <Modal show={showNote} onHide={this.hideNote}>
        <Modal.Header closeButton>
          <Modal.Title id="note-title-lg">
            <span>{note.title}</span>
            <Button
              className="margin-left-1 vert-text-top"
              bsSize="small"
              bsStyle="warning"
            >
              <Glyphicon
                glyph="pencil"
                onClick={() => this.showUpdateNoteForm(note)}
              />
            </Button>
            <Button
              className="margin-left-1 vert-text-top"
              bsSize="small"
              bsStyle="danger"
            >
              <Glyphicon
                glyph="trash"
                onClick={() => this.showDeleteNoteForm(note)}
              />
            </Button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{note.description}</p>
        </Modal.Body>
      </Modal>
    );
  };

  render = () => {
    const { noteIds, notes } = this.props;
    return (
      <div>
        <Button onClick={this.showCreateNoteForm}>Create Note</Button>
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
        {this.renderDeleteNoteForm()}
        {this.renderNoteForm()}
      </div>
    );
  };
}

Notes.defaultProps = {
  noteIds: []
};

Notes.propTypes = {
  noteIds: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.oneOf(['place', 'npc', 'quest']).isRequired,
  typeId: PropTypes.string.isRequired
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deleteNote: NoteActions.deleteNote
    },
    dispatch
  );

const mapStateToProps = state => ({
  notes: state.notes.all
});

const NotesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes);

export default NotesContainer;
