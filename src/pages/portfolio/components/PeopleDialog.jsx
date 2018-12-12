import React from 'react';
import PropTypes from 'prop-types';
import '../style/PeopleDialog.css';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import FontAwesome from "react-fontawesome";

const PeopleDialog = ({ open, handleClose, people }) => {
    if (!people) {
        return "";
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={'paper'}
            aria-labelledby="scroll-dialog-title"
            classes={{root : "people_dialog"}}
            fullWidth={true}
            maxWidth={'md'}
        >
            <DialogContent classes={{root : "people_dialog__content"}}>
                <div id="people_dialog__background"><div id="people_dialog__background_overlay"></div></div>
                <div id={"people_dialog__head"}>
                    <div id={"people_dialog__head_img"}>
                        <img src={ people.photo } alt={"[PHOTO]"} />
                        <h1>{people.name} {people.surname}</h1>
                    </div>

                    <aside>
                        <h1>Profil :</h1>
                        <ul>
                            <li><label>Date de naissance : </label><span>{ people.birthday.dmy } / { people.age } ans</span></li>
                            <li><label>Date d'arrivée : </label><span>{ people.birthday.dmy }</span></li>
                            <li><label>Email : </label><span>{ people.email }</span></li>
                            <li><label>Téléphone : </label><span>{ people.phone }</span></li>
                            <li><label>Lieu de travail</label><span>{ people.workPlace }</span></li>
                        </ul>
                    </aside>
                </div>

                <main>
                    <h1><FontAwesome name={"diamond"}/>Compétences</h1>

                    <h1>Missions précédentes</h1>

                    <h1>Intérêts</h1>

                    <h1>Langues</h1>

                    <h1>Éducation</h1>

                </main>
            </DialogContent>
        </Dialog>
    );
};

PeopleDialog.propTypes = {
    open : PropTypes.bool.isRequired,
    handleClose : PropTypes.func.isRequired,
    people : PropTypes.any
};

export default PeopleDialog;