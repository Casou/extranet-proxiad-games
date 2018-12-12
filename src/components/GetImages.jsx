import React from 'react';
import PropTypes from 'prop-types';

const GetImages = ({jsonData}) => {

    const sortedDatas = jsonData.reduce((acc, curr) => {
        const entry = acc[curr.region] || { name : curr.region, number : 0 };
        entry.number++;
        acc[curr.region] = entry;
        return acc;
    }, []
    );
    return (<ul>
        { Object.entries(sortedDatas).map(entry => entry[1]).map(entry => <li>{ entry.name } : { entry.number }</li>) }
    </ul>);
};

GetImages.propTypes = {};

export default GetImages;