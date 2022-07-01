import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useState } from 'react';

import PlayersCardGrid from '../components/PlayersCardGrid';

export default function Home() {
    const [ currentFive, setCurrentFive ] = useState([{ firstName: 'nick', lastName: 'robbins', age: 25, team: 'PHO', position: 'G' }]);

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
                <PlayersCardGrid startingFive={currentFive}/>
            </Box>
        </Container>
    )
}