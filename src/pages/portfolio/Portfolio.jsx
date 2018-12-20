import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import { VILLES } from "../../common/common.js";
import PeopleCard from "./components/PeopleCard";
import './style/Portfolio.css';
import PeopleDialog from "./components/PeopleDialog";
import SpecialPeopleDialog from "./components/TerminalDialog";
import connect from "react-redux/es/connect/connect";
import {assign} from "lodash";
import {bindActionCreators} from "redux";
import AuthorizationActions from "../loginPage/actions/AuthorizationActions";
import axios from "axios";
import {SERVEUR_URL} from "../../index";

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    tabsRoot: {
        borderBottom: '1px solid #e8e8e8',
    },
    tabsIndicator: {
        backgroundColor: '#43B3FB',
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
            color: '#43B3FB',
        },
        '&$tabSelected': {
            color: '#43B3FB',
            fontWeight: "bold",
        }
    },
    tabSelected: {
        fontWeight: 'bold',
    }
});

class Portfolio extends React.Component {
    state = {
        city: "Lille",
        chosenPeople : null,
        dialogOpen : false,
        peopleList : []
    };

    constructor(props) {
        super(props);

        const url = SERVEUR_URL + "people/all";
        axios.get(url)
            .then(response => {
                if (response.status !== 200) {
                    console.error(response);
                    return Promise.reject("Error while fetching " + url + " : " + response.status + " " + response.statusText);
                } else {
                    return response.data;
                }
            })
            .then(response => {
                this.setState({
                    ...this.state,
                    peopleList : response
                });
            })
            .catch((error) => {
                console.error(error);
                props.authorizationAction.unauthorizedToken();
            });
    }

    changeCity = (event, city) => {
        this.setState({ ...this.state, city });
    };

    choosePeople = (chosenPeople) => {
        const url = SERVEUR_URL + "people/" + chosenPeople.id;
        axios.get(url)
            .then(response => {
                if (response.status === 401) {
                    console.error(response);
                    return Promise.reject("Error while fetching " + url + " : " + response.status + " " + response.statusText);
                } else {
                    return response.data;
                }
            })
            .then(response => {
                this.setState({
                    ...this.state,
                    chosenPeople : response,
                    dialogOpen : true
                });
            })
            .catch((error) => {
                console.error(error);
                this.props.authorizationAction.unauthorizedToken();
            });
    };
    unchoosePeople = () => {
        this.setState({ ...this.state, chosenPeople : null, dialogOpen : false });
    };

    render() {
        const { classes } = this.props;
        const { city, chosenPeople, dialogOpen, peopleList } = this.state;

        const cityPeople = peopleList.filter(data => data.city === city);
        return (
            <div id="portfolio_list">
                <AppBar position="static" classes={ { root : "appbar-root" }}>
                    <Tabs value={city}
                          onChange={this.changeCity}
                          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                          scrollable
                          scrollButtons="auto"
                    >
                        <Tab key={"Agence"} label="Agence" disabled classes={{ root: classes.tabDisabled, selected: classes.tabSelected }} />
                        { VILLES.map(nom => <Tab key={ nom } label={ nom } value={ nom } classes={{ root: classes.tabRoot, selected: classes.tabSelected }} />) }
                    </Tabs>
                </AppBar>
                <main>
                    { cityPeople.map(p => <PeopleCard key={p.surname+p.name} people={p} onClick={ this.choosePeople } />) }
                </main>
                <PeopleDialog open={dialogOpen && chosenPeople && chosenPeople.phone !== "06.25.65.65.65"}
                              people={chosenPeople}
                              handleClose={this.unchoosePeople} />
                <SpecialPeopleDialog open={dialogOpen && chosenPeople && chosenPeople.phone === "06.25.65.65.65"}
                               handleClose={this.unchoosePeople} />
            </div>
        );
    }
}

Portfolio.propTypes = {
};

export default connect(state => assign({}, {
    authorization: state.authorization
}), dispatch => ({
    authorizationAction: bindActionCreators(AuthorizationActions, dispatch)
}))(withStyles(styles)(Portfolio));