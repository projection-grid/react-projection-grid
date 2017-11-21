import React, { Component } from 'react';
import pgrid from 'projection-grid';
import PropTypes from 'prop-types';
import _ from 'underscore';

import BackboneViewWrapper from './components/backbone-view-wrapper';
import hocPlugin from './components/plugin-wrapper';

class ReactProjectionGrid extends Component {
  constructor(props) {
    super(props);

    this.gridView = pgrid.factory({ vnext: true })
      .create({
        tableClasses: props.config.tableClasses,
        dataSource: props.config.dataSource,
      }).gridView.render();

    this.plugins = {
      grid: this.gridView,
    };
  }

  componentDidMount() {
    // this.setPlugins();
  }

  componentDidUpdate() {
    // this.setPlugins();
  }

  componentWillUnmount() {
    this.gridView.remove();
  }

  setPlugins() {
    _.each(_.flatten([this.props.children]), (plugin) => {
      plugin.type(this.plugin.bind(this), plugin.props);
    });
  }

  plugin(name, deps, callback) {
    _.each(deps, (dep) => {
      if (!_.has(this.plugins, dep)) {
        throw new Error(`unresolved plugin dependency ${name} -> ${dep}`);
      }
    });

    this.plugins[name] = callback.apply(this /* allow plugin acces to the context */,
      (_.map(deps, dep => this.plugins[dep])));
  }

  render() {
    const children = React.Children.map(_.flatten([this.props.children]), child =>
      hocPlugin(child, this.gridView));
    return (
      <div>
        <BackboneViewWrapper view={this.gridView} />
        {children}
      </div>
    );
  }
}

ReactProjectionGrid.propTypes = {
  config: PropTypes.shape({
    tableClasses: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    dataSource: PropTypes.object,
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.object,
  ]),
};

ReactProjectionGrid.defaultProps = {
  children: [],
};

export default ReactProjectionGrid;

export * from './plugins/column-chooser';
