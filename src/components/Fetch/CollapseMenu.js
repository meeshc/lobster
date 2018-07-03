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

export class CollapseMenu extends React.PureComponent {
  static propTypes = {
    detailsOpen: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    settings: PropTypes.shape({
      wrap: PropTypes.bool.isRequired,
      caseSensitive: PropTypes.bool.isRequired,
      filterIntersection: PropTypes.bool.isRequired
    }).isRequired,
    toggleSettings: PropTypes.shape({
      toggleWrap: PropTypes.func.isRequired,
      toggleCaseSensitive: PropTypes.func.isRequired,
      toggleFilterIntersection: PropTypes.func.isRequired
    }).isRequired,
    filterList: PropTypes.array.isRequired,
    filterActions: PropTypes.shape({
      removeFilter: PropTypes.func.isRequired,
      toggleFilter: PropTypes.func.isRequired,
      toggleFilterInverse: PropTypes.func.isRequired
    }),
    server: PropTypes.string,
    url: PropTypes.string,
    build: PropTypes.string.isRequired,
    setURLRef: PropTypes.func.isRequired,
    valueJIRA: PropTypes.string.isRequired,
    highlightList: PropTypes.array.isRequired,
    highlightActions: PropTypes.shape({
      removeHighlight: PropTypes.func.isRequired,
      toggleHighlight: PropTypes.func.isRequired,
      toggleHighlightLine: PropTypes.func.isRequired
    }).isRequired
  };

  // XXX: FYI, I've made this component pure since no state
  // shouldComponentUpdate(nextProps, _nextState) {
  //  if (nextProps.detailsOpen !== this.props.detailsOpen) {
  //    return true;
  //  }
  //  if (nextProps.wrap !== this.props.wrap) {
  //    return true;
  //  }
  //  if (nextProps.caseSensitive !== this.props.caseSensitive) {
  //    return true;
  //  }
  //  if (nextProps.filterList !== this.props.filterList) {
  //    return true;
  //  }
  //  return false;
  // }

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
            <FormGroup controlId="collapseButtons">
              <Col componentClass={ControlLabel} lg={1}>Wrap</Col>
              <Col lg={1}><ToggleButton value={this.props.settings.wrap} onToggle={this.props.toggleSettings.toggleWrap} /></Col>
              <Col componentClass={ControlLabel} lg={1}>Case Sensitive</Col>
              <Col lg={1}><ToggleButton value={this.props.settings.caseSensitive} onToggle={this.props.toggleSettings.toggleCaseSensitive} /></Col>
              <Col componentClass={ControlLabel} lg={1}>Filter Logic</Col>
              <Col lg={1}><ToggleButton inactiveLabel={'OR'} activeLabel={'AND'} value={this.props.settings.filterIntersection} onToggle={this.props.toggleSettings.toggleFilterIntersection} /></Col>
              <Col componentClass={ControlLabel} lg={1}>JIRA</Col>
              <Col lg={1}><textarea readOnly className="unmoving" value={this.props.valueJIRA}></textarea></Col>
              {this.showJobLogs()}
              {this.showRaw()}
              {this.showHTML()}
            </FormGroup>
          </Form>
          <Filters
            filters={this.props.filterList}
            removeFilter={this.props.filterActions.removeFilter}
            toggleFilter={this.props.filterActions.toggleFilter}
            toggleFilterInverse={this.props.filterActions.toggleFilterInverse}
          />
          <Highlights
            highlights={this.props.highlightList}
            removeHighlight={this.props.highlightActions.removeHighlight}
            toggleHighlight={this.props.highlightActions.toggleHighlight}
            toggleHighlightLine={this.props.highlightActions.toggleHighlightLine}
          />
        </div>
      </Collapse>
    );
  }
}

export default CollapseMenu;
