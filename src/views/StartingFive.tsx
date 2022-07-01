import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useState } from 'react';

import PlayersCardGrid from '../components/PlayersCardGrid';
import AllPlayersTable from '../components/AllPlayersTable';

import ExampleStartingFive from '../partials/StartingFive.json';

export default function StartingFive() {
    const [ currentFive, setCurrentFive ] = useState(ExampleStartingFive.startingFive);

    return (
        <Container>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <h2>Your Starting Five</h2>
                <PlayersCardGrid startingFive={currentFive}/>
            </Box>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}
            >
                <h2>All Players</h2>
                <AllPlayersTable />
            </Box>
        </Container>
    )
}