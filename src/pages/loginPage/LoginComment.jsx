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
		return `<!-- 


		**************************************************************************
		**************************************************************************
		${this.props.text} 
		**************************************************************************
		**************************************************************************
		
		
-->`;
	}

	render() {
		return <div />;
	}
}

LoginComment.propTypes = {
	text: PropTypes.string.isRequired
};


export default LoginComment;