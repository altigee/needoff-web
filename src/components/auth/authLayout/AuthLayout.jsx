import React, { Component } from 'react';
import { node, string } from 'prop-types';
import classNames from 'classnames';

import './styles.scss';

export default class AuthLayout extends Component {
  static propTypes = {
    children: node.isRequired,
    className: string
  };

  static defaultProps = {
    className: ''
  };

  render() {
    const classes = classNames('outer-wrap-page', this.props.className);

    return (
      <div className={classes}>
        <div className="outer-children-page">{this.props.children}</div>
      </div>
    );
  }
}
