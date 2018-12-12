import React from 'react';
import PropTypes from 'prop-types';

class Port extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <AppBar position="static">
                    <Tabs value={value} onChange={this.handleChange}>
                        <Tab label="Item One" />
                        <Tab label="Item Two" />
                        <Tab label="Item Three" href="#basic-tabs" />
                    </Tabs>
                </AppBar>
                {value === 0 && <TabContainer>Item One</TabContainer>}
                {value === 1 && <TabContainer>Item Two</TabContainer>}
                {value === 2 && <TabContainer>Item Three</TabContainer>}
            </div>
        );
    }
}

Port.propTypes = {};

export default Port;