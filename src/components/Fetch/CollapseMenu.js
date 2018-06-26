import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
import ToggleButton from 'react-toggle-button';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Collapse from 'react-bootstrap/lib/Collapse';
import { Filters } from './Filters';
import { Highlights } from './Highlights';

export class CollapseMenu extends React.Component {
  static propTypes = {
    detailsOpen: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    wrap: PropTypes.bool.isRequired,
    toggleWrap: PropTypes.func.isRequired,
    caseSensitive: PropTypes.bool.isRequired,
    toggleCaseSensitive: PropTypes.func.isRequired,
    filterIntersection: PropTypes.bool.isRequired,
    toggleFilterIntersection: PropTypes.func.isRequired,
    filterList: PropTypes.object.isRequired,
    removeFilter: PropTypes.func.isRequired,
    toggleFilter: PropTypes.func.isRequired,
    toggleFilterInverse: PropTypes.func.isRequired,
    server: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    build: PropTypes.string.isRequired,
    setURLRef: PropTypes.func.isRequired,
    valueJIRA: PropTypes.string.isRequired,
    highlightList: PropTypes.object.isRequired,
    removeHighlight: PropTypes.func.isRequired,
    toggleHighlight: PropTypes.func.isRequired,
    toggleHighlightLine: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps, _nextState) {
    if (nextProps.detailsOpen !== this.props.detailsOpen) {
      return true;
    }
    if (nextProps.wrap !== this.props.wrap) {
      return true;
    }
    if (nextProps.caseSensitive !== this.props.caseSensitive) {
      return true;
    }
    if (nextProps.filterList !== this.props.filterList) {
      return true;
    }
    return false;
  }

  showLogBox() {
    if (this.props.server) {
      return (
        <FormGroup controlId="urlInput">
          <Col componentClass={ControlLabel} lg={1}>Log</Col>
          <Col lg={6}>
            <FormControl
              type="text"
              defaultValue={this.props.url}
              placeholder="optional. custom file location iff used with local server"
              inputRef={this.props.setURLRef}
            />
          </Col>
          <Col lg={1}> <Button type="submit"> Apply </Button> </Col>
        </FormGroup>
      );
    }
  }

  showJobLogs() {
    if (!this.props.server) {
      return (<Col lg={1}><Button href={'/build/' + this.props.build}>Job Logs</Button></Col>);
    }
  }

  showRaw() {
    if (!this.props.server) {
      return (<Col lg={1}><Button href={'/build/' + this.props.build + '/all?raw=1'}>Raw</Button></Col>);
    }
  }

  showHTML() {
    if (!this.props.server) {
      return (<Col lg={1}><Button href={'/build/' + this.props.build + '/all?html=1'}>HTML</Button></Col>);
    }
  }

  render() {
    return (
      <Collapse className="collapse-menu" in={this.props.detailsOpen}>
        <div>
          <Form horizontal onSubmit={this.props.handleSubmit}>
            {this.showLogBox()}
            <FormGroup controlId="wrap">
              <Col componentClass={ControlLabel} lg={1}>Wrap</Col>
              <Col lg={1}><ToggleButton value={this.props.wrap || false} onToggle={this.props.toggleWrap} /></Col>
              <Col componentClass={ControlLabel} lg={1}>Case Sensitive</Col>
              <Col lg={1}><ToggleButton value={this.props.caseSensitive || false} onToggle={this.props.toggleCaseSensitive} /></Col>
              <Col componentClass={ControlLabel} lg={1}>Filter Logic</Col>
              <Col lg={1}><ToggleButton inactiveLabel={'OR'} activeLabel={'AND'} value={this.props.filterIntersection || false} onToggle={this.props.toggleFilterIntersection} /></Col>
              <Col componentClass={ControlLabel} lg={1}>JIRA</Col>
              <Col lg={1}><textarea readOnly className="unmoving" value={this.props.valueJIRA}></textarea></Col>
              {this.showJobLogs()}
              {this.showRaw()}
              {this.showHTML()}
            </FormGroup>
          </Form>
          <Filters
            filters={this.props.filterList}
            removeFilter={this.props.removeFilter}
            toggleFilter={this.props.toggleFilter}
            toggleFilterInverse={this.props.toggleFilterInverse}
          />
          <Highlights
            highlights={this.props.highlightList}
            removeHighlight={this.props.removeHighlight}
            toggleHighlight={this.props.toggleHighlight}
            toggleHighlightLine={this.props.toggleHighlightLine}
          />
        </div>
      </Collapse>
    );
  }
}