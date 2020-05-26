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
//import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import logo from './images/libra_logo.jpg'
import { Card } from 'antd';
import { Provider, Heading, Subhead, Flex, Small, NavLink } from 'rebass'
import {
  Hero, CallToAction, ScrollDownIndicator, Checklist, Section, Feature
} from 'react-landing-page'

const {Meta}= Card;

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
        /*
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
        </Card>*/
        <Provider>
            <Hero
            color="black"
            bg="black"
            bgOpacity={0.6}
            backgroundImage="/dna-3539309_1920.jpg"
            backgroundRepear="y-repeat"
            boxShadow= "10px 10px"
            >
                <Heading color="white" fontSize="70px">LIBRA</Heading>
                <Subhead color="white" fontSize="50px">Your Personal Variant Query System</Subhead>
                <CallToAction href="/signup" mt={3}>Get Started</CallToAction>
                <ScrollDownIndicator/>
                
                
                    
                    <Section backgroundImage="/dna-3539309_1920.jpg">
            <Heading color="white">Why use Libra?</Heading>
                <Checklist color="white" children={[
                    'Automatic annotation of VCF Files',
                    'Organization of your VCF Files via Projects',
                    'HPO and GO based Matchmaking System for Diagnosis'
                ]}/>
            </Section>
            {/*
            <Heading color="white" textAlign="center">What is inside?</Heading>
            <Subhead color="white" >Built in rich text editor for note taking</Subhead>
            
            
            <img src="/texteditor.png"></img>

            
            <Card
                style={{ width: 400 }}
                cover={
                <img
                    alt="example"
                    src="/texteditor.png"
                />
                }
                hovarable={true}
            >
                <Meta
                title="Built in rich text editor"
                description="For taking quick notes."
                />
            </Card>
            
            */
            }
            <Flex color="white" is="footer" alignItems="center" fontSize="20px" p={5}>
                <NavLink children="Github" href="https://github.com/projectlibra/projectlibra" target="_blank"/>
                <NavLink children="Contact" href="mailto:projectlibra.info@gmail.com"/>
                <Small color="grey" ml="auto">Libra, 2020</Small>
            </Flex>
                
            </Hero>
            
            
            

            
        </Provider>
    );
}

