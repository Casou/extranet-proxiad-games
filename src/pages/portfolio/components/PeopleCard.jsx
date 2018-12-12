import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from "@material-ui/core/CardActionArea/CardActionArea";
import '../style/PeopleCard.css';

const PeopleCard = ({ people, onClick }) => {
    return (
        <article onClick={ () => onClick(people) }>
            <Card classes={{root : "card"}}
                  component={"div"}
                  raised={true}
            >
                <CardActionArea>
                    <CardMedia
                        classes={{root : "card_media"}}
                        image={ people.photo }
                        title={ people.name }
                    />
                    <CardContent>
                        <h1>
                            { people.name } { people.surname }
                        </h1>
                        <ul>
                            <li><label>Arrivée : </label><span>{ people.birthday.dmy }</span></li>
                            <li><label>Age : </label><span>{ people.age } ans</span></li>
                            <li><label>Email : </label><span>{ people.email }</span></li>
                            <li><label>Téléphone : </label><span>{ people.phone }</span></li>
                            <li><label>CB : </label><span>{ people.credit_card.number }</span></li>
                        </ul>
                    </CardContent>
                </CardActionArea>
            </Card>
        </article>);
};

PeopleCard.propTypes = {
    people : PropTypes.any.isRequired,
    onClick : PropTypes.func.isRequired
};

export default PeopleCard;