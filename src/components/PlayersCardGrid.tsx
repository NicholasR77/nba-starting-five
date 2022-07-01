import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { Player } from '../types/Player';

export default function PlayersCardGrid(props: { startingFive: Player[] }) {
    const startingFiveCards = props.startingFive.map((player) => {
        const { firstName, lastName, age, team, position } = player;

        return (
            <Grid item xs={4} key={firstName}>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <h2>{position} | {firstName} {lastName}</h2>
                        <p>{age} years old</p>
                        <p>Plays for {team}</p>
                    </CardContent>
                </Card>
            </Grid>
        )
    })

    return (
        <Grid container spacing={2} justifyContent='center'>
            {startingFiveCards}
        </Grid>
    )
}