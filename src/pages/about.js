import React from 'react';
import { Grid, Row, Col, Glyphicon } from 'react-bootstrap';
import CircleDiv from '../reusable-components/circle-div';

class About extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12} className="margin-bottom-1">
            <h3>The Tabletop Chronicler</h3>
          </Col>
          <Col xs={12}>
            <Row>
              <p>
                The Tabletop Chronicler was created to bridge the gap between
                the game master's brain and the legendary notepad that
                traditionally holds their thoughts. GMs work so hard to create
                engaging worlds, memorable monsters and characters, and unique
                places. They have so much to remember on any given day that
                often, those creations get lost in the gigantic mess of an
                organization method.
              </p>
            </Row>
            <Row className="margin-vertical-1 text-center">
              <Col xs={4}>
                <h4>Save</h4>
                <CircleDiv bgColor="lightblue">
                  <Glyphicon bsSize="large" glyph="cloud-download" />
                </CircleDiv>
              </Col>
              <Col xs={4}>
                <h4>Connect</h4>
                <CircleDiv bgColor="blue">
                  <Glyphicon bsSize="large" glyph="globe" />
                </CircleDiv>
              </Col>
              <Col xs={4}>
                <h4>Find</h4>
                <CircleDiv bgColor="darkblue">
                  <Glyphicon bsSize="large" glyph="eye-open" />
                </CircleDiv>
              </Col>
            </Row>
            <Row>
              <p>
                Using this site, game masters can quickly save, connect, and
                find their creations. Do you have a word document already set up
                for that killer megadungeon? Upload it, and fill in details
                later when you find the time! Maybe you have an idea for a quest
                that you want your eccentric shopkeeper to send your players on.
                Attach the quest and objectives to the shopkeeper, and never
                lose track of it again!
              </p>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default About;
