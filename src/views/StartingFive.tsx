import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useState } from 'react';

import PlayersCardGrid from '../components/PlayersCardGrid';
import AllPlayersTable from '../components/AllPlayersTable';
import { Player } from '../types/Player';
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
                <PlayersCardGrid currentFive={currentFive as Player[]} setCurrentFive={setCurrentFive}/>
            </Box>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}
            >
                <AllPlayersTable currentFive={currentFive as Player[]} setCurrentFive={setCurrentFive} />
            </Box>
        </Container>
    )
}