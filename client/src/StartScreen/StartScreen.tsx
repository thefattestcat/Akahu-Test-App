import React from 'react';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

interface StartScreenProps {
    status: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        imageIcon: {
            height: '50vh'
        },
        iconRoot: {
            textAlign: 'center'
        }
    })
);


const StartScreenComponent: React.FC<StartScreenProps> = props => {
    const classes = useStyles();
    return (
        <div>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
            >
                <Grid item xs={12}>
                    <Icon classes={{ root: classes.iconRoot }}>
                        <img className={classes.imageIcon} src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg" />
                    </Icon>
                </Grid>

                <Grid item xs={12}>
                    {props.status}
                </Grid>

            </Grid>
        </div>)
}
export default StartScreenComponent;
