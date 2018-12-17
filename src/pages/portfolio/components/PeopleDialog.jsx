import React from 'react';
import PropTypes from 'prop-types';
import '../style/PeopleDialog.css';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";

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
                        <img src={ people.photo } alt={ people.photo } />
                        <h1>{people.name} {people.surname}</h1>
                    </div>

                    <aside>
                        <h1>Profil :</h1>
                        <ul>
                            <li><label>Date de naissance : </label><span>{ people.birthday } / { people.age } ans</span></li>
                            <li><label>Date d'arrivée : </label><span>{ people.birthday }</span></li>
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
                                <li>
                                    <div className={"people_dialog__languages_icon"}>
                                        <i className={"flagIcon france"} />
                                    </div>
                                    <label>Français</label>
                                </li>
                                <li>
                                    <div className={"people_dialog__languages_icon"}>
                                        <i className={"flagIcon angleterre"} />
                                    </div>
                                    <label>Anglais</label>
                                </li>
                                <li>
                                    <div className={"people_dialog__languages_icon"}>
                                        <i className={"flagIcon klingon"} />
                                    </div>
                                    <label>Klingon</label>
                                </li>
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