// @flow strict-local

import React from 'react';
import type { Node as ReactNode } from 'react';
import resmokeTestEvents from '../../reducers/logProcessor/resmokeTestEvents';
import { connect } from 'react-redux';
import type { Line, Event } from '../../models';
import vegaEmbed from 'vega-embed'; // vegaEmbed.embed(…)
import { vega as vegaTooltip } from 'vega-tooltip';
import { Button } from 'react-bootstrap';
import '../../../node_modules/vega-tooltip/build/vega-tooltip.min.css';
import type { ContextRouter } from 'react-router-dom';

type Props = {|
  lines: Line[]
|} & ContextRouter

type State = {|
  opts: {[key: string]: {[key: string]: boolean}},
  tooltipsOptions: {},
  spec: {},
  events: Event[],
  loaded: boolean
|}

export class ClusterVisualizer extends React.PureComponent<Props, State> {
  baseDiv: ?HTMLDivElement

  constructor(props: Props) {
    super(props);
    this.state = {
      opts: {
        actions: { source: false, editor: false, export: false, compiled: false }
      },
      tooltipsOptions: {
        showAllFields: true,
        fields: [
          {
            'field': 'start',
            'formatType': 'time',
            'format': '%H:%M:%S.%L'
          },
          {
            'field': 'end',
            'formatType': 'time',
            'format': '%H:%M:%S.%L'
          },
          {
            'field': 'log_start',
            'formatType': 'time',
            'format': '%H:%M:%S.%L'
          },
          {
            'field': 'log_end',
            'formatType': 'time',
            'format': '%H:%M:%S.%L'
          }
        ]
      },
      spec: {},
      events: [],
      loaded: false
    };
  }

  parseEvents() {
    this.setState({ events: resmokeTestEvents(this.props.lines) });
  }

  componentDidUpdate() {
    if (this.props.lines.length !== 0 && this.state.events.length === 0) {
      this.parseEvents();
    } else if (!this.state.loaded && this.state.events.length > 0) {
      this.withSpec('test.json', this.state.events);
    }
  }

  componentDidMount() {
    this.withSpec('test.json', this.state.events);
  }

  refCallback = (div: ?HTMLDivElement) => {
    this.baseDiv = div;
  }

  withSpec = (filename: string, events: Event[]) => {
    const fileRequest = new Request('/' + filename);
    fetch(fileRequest)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('succeeded in downloading file!');
        data.data[0].values = events;
        this.setState({ spec: data });
        this.graph();
      });
  }

  graph = (): ?ReactNode => {
    if (this.baseDiv != null) {
      vegaEmbed('#clusterVis', this.state.spec, this.state.opts).then((result) => {
        console.log('vega embed success!');
        vegaTooltip(result.view, this.state.tooltipsOptions);
      });
    }
    this.setState({ loaded: true });
  }

  handleBack = () => {
    this.props.history.goBack();
  }

  render() {
    return (
      <div ref={this.refCallback}>
        <div id="clusterVis" className="width: 100%"></div>
        <Button onClick={this.handleBack} bsStyle="primary" style={{ marginLeft: '10px' }}>Back</Button>
      </div>);
  }
}

function mapStateToProps(state, ownProps) {
  return { ...state, ...ownProps, lines: state.log.lines };
}

export default connect(mapStateToProps, undefined)(ClusterVisualizer);
