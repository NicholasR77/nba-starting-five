import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import useAxios from '../hooks/useAxios';
import useCompositionSerializer from '../hooks/useCompositionSerializer';

import PlayersCardGrid from '../components/PlayersCardGrid';
import AllPlayersTable from '../components/AllPlayersTable';

import { Player } from '../types/Player';

export default function StartingFive() {
    const maxPlayers = 5;
    const maxValue = 15;
    const [ currentFive, setCurrentFive ] = useState<Player[]>([]);
    const [ totalValue, setTotalValue ] = useState(0);
    const [ submitted, setSubmitted ] = useState(false);
    const [ requestSettings, setRequestSettings ] = useState({});

    const { response, loading, error } = useAxios(requestSettings);
    const { playerIds } = useCompositionSerializer(currentFive);

    useEffect(() => {
        setRequestSettings({
            method: 'post',
            url: '/compositions',
            baseURL: 'http://127.0.0.1:3001',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ composition: { player_ids: playerIds } }),
        })
    }, [submitted])

    // Adjusting the total point value for starting five changes
    useEffect(() => {
        
        if (currentFive.length) {
            let tempTotal: number = 0;

            currentFive.forEach((player) => {
                tempTotal += player.value;
            });

            setTotalValue(tempTotal);
        } else {
            setTotalValue(0);
        }
    }, [currentFive]);

    useEffect(() => {
        console.log(response);
    }, [response])
    
    const handleOnClick = () => {
        setSubmitted(!submitted)
        // setSubmitted(false)
    };

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
                <Stack direction='row' justifyContent='space-between' alignItems='center' style={{ 'width': '100%', 'paddingBottom': '20px' }}>
                    <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        <h2>Your Starting Five</h2>
                        <Tooltip title={`Pick 5 NBA players whole total point value is less than or equal to ${maxValue}.`} style={{ paddingLeft: '5px' }}>
                            <HelpIcon />
                        </Tooltip>
                    </Stack>
                    <Button onClick={handleOnClick} variant='outlined'>Submit Selected Players</Button>
                </Stack>
                
                
                { !currentFive.length && <p>No players selected...</p> }
                { currentFive.length > 0 && <PlayersCardGrid currentFive={currentFive as Player[]} setCurrentFive={setCurrentFive}/> }
            </Box>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <h3>Available Points: {maxValue - totalValue}</h3>
            </Box>
            <Box sx={{ marginTop: 8 }}>
                <Divider />
            </Box>
            <Box
                sx={{
                    marginTop: 8,
                    marginBottom: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}
            >
                <AllPlayersTable 
                    currentFive={currentFive as Player[]}
                    setCurrentFive={setCurrentFive}
                    totalValue={totalValue}
                    maxPlayers={maxPlayers}
                    maxValue={maxValue}
                />
            </Box>
        </Container>
    )
}