import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class LoginComment extends Component {
	componentDidMount() {
		let el = ReactDOM.findDOMNode(this);
		ReactDOM.unmountComponentAtNode(el);
		el.outerHTML = this.createComment();
	}

	createComment() {
		return `<div class="comment">&lt;-- ${ this.props.fakeText } --&gt; <!-- ${this.props.text} --></div>`;
	}

	render() {
		return <div />;
	}
}

LoginComment.propTypes = {
	text: PropTypes.string.isRequired,
	fakeText: PropTypes.string.isRequired
};


export default LoginComment;