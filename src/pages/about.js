import React from 'react';
import { Grid, Row, Col, Glyphicon, Carousel, Image } from 'react-bootstrap';
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
              <p>
                Using this site, game masters can quickly save, connect, and
                find their creations. Do you have a word document already set up
                for that killer megadungeon? Upload it, and fill in details
                later when you find the time! Maybe you have an idea for a quest
                that you want your eccentric shopkeeper to send your players on.
                Attach the quest and objectives to the shopkeeper, and never
                lose track of it again!
              </p>
              <p>
                This tool has been a passion project of mine for the better part
                of a year. Thank you for taking the time to check it out. If you
                like it, and want to see more updates in the future, support the
                Chronicler on Patreon!
              </p>
            </Row>
            <Row>
              <Col xs={12}>
                <Carousel>
                  <Carousel.Item key={1}>
                    <Image
                      src={require('../assets/showcase/1.png')}
                      responsive
                    />
                  </Carousel.Item>
                  <Carousel.Item key={0}>
                    <Image
                      src={require('../assets/showcase/7.png')}
                      responsive
                    />
                  </Carousel.Item>
                  <Carousel.Item key={2}>
                    <Image
                      src={require('../assets/showcase/2.png')}
                      responsive
                    />
                  </Carousel.Item>
                  <Carousel.Item key={3}>
                    <Image
                      src={require('../assets/showcase/3.png')}
                      responsive
                    />
                  </Carousel.Item>
                  <Carousel.Item key={4}>
                    <Image
                      src={require('../assets/showcase/4.png')}
                      responsive
                    />
                  </Carousel.Item>
                  <Carousel.Item key={5}>
                    <Image
                      src={require('../assets/showcase/5.png')}
                      responsive
                    />
                  </Carousel.Item>
                  <Carousel.Item key={6}>
                    <Image
                      src={require('../assets/showcase/6.png')}
                      responsive
                    />
                  </Carousel.Item>
                </Carousel>
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default About;
