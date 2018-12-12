import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import { VILLES } from "../../common/common.js";
import PeopleCard from "./PeopleCard";

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    tabsRoot: {
        borderBottom: '1px solid #e8e8e8',
    },
    tabsIndicator: {
        backgroundColor: '#ffbf7f',
    },
    tabDisabled : {
        color: '#f1f1f1',
        fontWeight: 'bold',
        opacity: "1 !important"
    },
    tabRoot: {
        textTransform: 'initial',
        minWidth: 75,
        opacity: 1,
        fontSize : 13,
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: theme.spacing.unit * 4,
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            color: '#ffbf7f',
        },
        '&$tabSelected': {
            color: '#ffbf7f',
            fontWeight: "bold",
        }
    },
    tabSelected: {
        fontWeight: 'bold',
    }
});

class Portfolio extends React.Component {
    state = {
        value: "Lille",
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { jsonData, classes } = this.props;
        const { value } = this.state;

        const people = jsonData.filter(data => data.region === value);
        return (
            <div id="portfolio_list">
                <AppBar position="static" classes={ { root : "appbar-root" }}>
                    <Tabs value={value}
                          onChange={this.handleChange}
                          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator, disabled : classes.tabDisabled }}
                          scrollable
                          scrollButtons="auto"
                    >
                        <Tab label="Agence" disabled classes={{ root: classes.tabDisabled, selected: classes.tabSelected }} />
                        { VILLES.map(nom => <Tab key={ nom } label={ nom } value={ nom } classes={{ root: classes.tabRoot, selected: classes.tabSelected }} />) }
                    </Tabs>
                </AppBar>
                <main>
                    { people.map(p => <PeopleCard people={p} />) }
                </main>
            </div>
        );
    }
}

Portfolio.propTypes = {
    jsonData : PropTypes.array.isRequired
};

export default withStyles(styles)(Portfolio);