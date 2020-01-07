// import React, { Component } from 'react'

// export default function Homepage() {
//     return (
//         <div>
//             <h1>Welcome to LIBRA: YOUR Genetic Filtering and Diagnosis Matching System!</h1>
//             <p>The aim of LIBRA is to provide a user-friendly genetic filtering and annotation
//                  system equipped with a genetic profile matching platform, that can be quickly
//                   integrated and easily used by medical institutions in order to explore
//                    genetic variation, detect and diagnose rare diseases,
//                     as well as safely collect and store their data.</p>
//         </div>
//     );
// }

import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import logo from './images/libra_logo.jpg'

const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex',
        height: 300,
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 900,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));

export default function HomePage() {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <Card className={classes.card}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        Welcome to LIBRA: YOUR Genetic Filtering and Diagnosis Matching System!
          </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        The aim of LIBRA is to provide a user-friendly genetic filtering and annotation
                               system equipped with a genetic profile matching platform, that can be quickly
                                integrated and easily used by medical institutions in order to explore
                                 genetic variation, detect and diagnose rare diseases,
                                  as well as safely collect and store their data.
          </Typography>
                </CardContent>
            </div>
            <CardMedia
                className={classes.cover}
                image={logo}
                title="LIBRA's logo"
            />
        </Card>
    );
}
