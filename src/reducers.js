import {combineReducers} from 'redux';
import {authorization} from "./pages/loginPage/reducers/AuthorizationReducer";
import {riddleStatus} from "./pages/portfolio/reducers/RiddleStatusReducer";

export default combineReducers({
    authorization, riddleStatus
});