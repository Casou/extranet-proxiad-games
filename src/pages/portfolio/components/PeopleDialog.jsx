import React from 'react';
import PropTypes from 'prop-types';
import '../style/PeopleDialog.css';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import {lpad} from "../../../common/common";

const PeopleDialog = ({ open, handleClose, people }) => {
    if (!people) {
        return "";
    }

    const sex = people.sex === 1 ? "male" : "female";
    const photo = `/photos/${sex}/${people.pictureIndex}.jpg`;

    const birthdate = lpad(people.birthDate[2]) + "/" + lpad(people.birthDate[1]) + "/" + lpad(people.birthDate[0]);
    const arrivalDate = lpad(people.arrivalDate[2]) + "/" + lpad(people.arrivalDate[1]) + "/" + lpad(people.arrivalDate[0]);

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
                        <img src={ photo } alt={ photo } />
                        <h1>{people.name} {people.surname}</h1>
                    </div>

                    <aside>
                        <h1>Profil :</h1>
                        <ul>
                            <li><label>Date de naissance : </label><span>{ birthdate } / { people.age } ans</span></li>
                            <li><label>Date d'arrivée : </label><span>{ arrivalDate }</span></li>
                            <li><label>Email : </label><span>{ people.email }</span></li>
                            <li><label>Téléphone : </label><span>{ people.phone }</span></li>
                            <li><label>Lieu de travail</label><span>{ people.workPlace }</span></li>
                        </ul>
                    </aside>
                </div>

                <main>
                    <div>
                        <h1>
                            <div className={"people_dialog__icon"}>
                                <i className="fa fa-diamond" />
                            </div>
                            Compétences
                        </h1>
                        <div className={"people_dialog__skill_category"}>
                            <h2>Backend Technology</h2>
                            <ul>
                                <li>Spring</li>
                                <li>Spring Boot</li>
                                <li>Java EE</li>
                                <li>Spring MongoDB</li>
                            </ul>
                        </div>
                        <div className={"people_dialog__skill_category"}>
                            <h2>Databases and Servers</h2>
                            <ul>
                                <li>MySQL</li>
                                <li>MongoDB</li>
                            </ul>
                        </div>
                        <div className={"people_dialog__skill_category"}>
                            <h2>Programming Languages</h2>
                            <ul>
                                <li>Java</li>
                                <li>PHP</li>
                                <li>Javascript</li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h1>
                            <div className={"people_dialog__icon"}>
                                <i className="fa fa-comments" />
                            </div>
                            Langues
                        </h1>
                        <div className={"people_dialog__languages"}>
                            <ul>
                                {
                                    people.languages.map(language =>
                                        <li>
                                            <div className={"people_dialog__languages_icon"}>
                                                <i className={"flagIcon " + language.icon} title={language.icon} />
                                            </div>
                                            <label>{ language.label }</label>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h1>
                            <div className={"people_dialog__icon"}>
                                <i className="fa fa-leaf" />
                            </div>
                            Intérêts
                        </h1>
                        <div className={"people_dialog__interets"}>
                            <ul>
                                {
                                    people.interets.map(interet =>
                                        <li>
                                            <i className="fa fa-check" />
                                            { interet }
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h1>
                            <div className={"people_dialog__icon"}>
                                <i className="fa fa fa-graduation-cap" />
                            </div>
                            Éducation
                        </h1>
                    </div>
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