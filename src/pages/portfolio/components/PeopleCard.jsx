import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from "@material-ui/core/CardActionArea/CardActionArea";
import '../style/PeopleCard.css';

const PeopleCard = ({ people, onClick }) => {
    return (
        <article className={"card"} onClick={ () => onClick(people) }>
            <Card classes={{root : "card_main"}}
                  component={"div"}
                  raised={true}
            >
                <CardActionArea classes={{root : "card_clickable_area"}}>
                    <CardMedia
                        classes={{root : "card_media"}}
                        image={ `/photos/${ people.sex }/${ people.pictureIndex }.jpg` }
                        title={ people.name }
                    />
                    <CardContent>
                        <h1>
                            { people.name } { people.surname }
                        </h1>
                    </CardContent>
                </CardActionArea>
            </Card>
        </article>
    );
};

PeopleCard.propTypes = {
    people : PropTypes.any.isRequired,
    onClick : PropTypes.func.isRequired
};

export default PeopleCard;