import React, { Component } from 'react';
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as NoteActions from '../redux/actions/notes';
import PropTypes from 'prop-types';

class NoteForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: ''
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
  }

  componentWillMount() {
    const { note } = this.props;
    this.setState({
      title: note.title || '',
      description: note.description || ''
    });
  }

  onSubmit = e => {
    e.preventDefault();
    const {
      formAction,
      type,
      typeId,
      onClose,
      note,
      createNote,
      updateNote
    } = this.props;
    if (formAction === 'create') {
      createNote({
        ...this.state,
        type: type,
        typeId: typeId
      })
        .then(() => {
          onClose();
        })
        .catch(err => {
          alert(err);
        });
    } else {
      updateNote({
        ...this.state,
        id: note.id,
        type: type,
        typeId: typeId
      })
        .then(() => {
          onClose();
        })
        .catch(err => {
          alert(err);
        });
    }
  };

  getValidationState = formKey => {
    const length = this.state[formKey].length;
    if (length > 0) return 'success';
    return null;
  };

  render() {
    return (
      <div>
        <form action="submit" onSubmit={e => this.onSubmit(e)}>
          <Row>
            <Col xs={12}>
              <FormGroup validationState={this.getValidationState('title')}>
                <ControlLabel htmlFor="#note-title">Title</ControlLabel>
                <FormControl
                  id="note-title"
                  type="text"
                  value={this.state.title}
                  required
                  placeholder="Give this note a title"
                  onChange={e => this.setState({ title: e.target.value })}
                />
                <FormControl.Feedback />
              </FormGroup>
            </Col>
            <Col xs={12}>
              <FormGroup
                validationState={this.getValidationState('description')}
              >
                <ControlLabel htmlFor="#note-description">
                  Description
                </ControlLabel>
                <FormControl
                  id="note-description"
                  componentClass="textarea"
                  required
                  value={this.state.description}
                  placeholder="What information is relevant to this note"
                  onChange={e => this.setState({ description: e.target.value })}
                />
                <FormControl.Feedback />
              </FormGroup>
            </Col>
          </Row>
          <Row className="padding-bottom-1">
            <Col xsOffset={6} xs={6}>
              <Row>
                <Col xs={6}>
                  <button type="submit" className="button expanded">
                    Submit
                  </button>
                </Col>
                <Col xs={6}>
                  <button
                    className="button alert expanded"
                    onClick={this.props.onClose}
                  >
                    Cancel
                  </button>
                </Col>
              </Row>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

NoteForm.defaultProps = {};

NoteForm.propTypes = {
  note: PropTypes.shape({}),
  type: PropTypes.string,
  typeId: PropTypes.string,
  formAction: PropTypes.string.isRequired
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createNote: NoteActions.createNote,
      updateNote: NoteActions.updateNote
    },
    dispatch
  );

const NoteFormContainer = connect(
  null,
  mapDispatchToProps
)(NoteForm);

export default NoteFormContainer;
