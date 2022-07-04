import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import useAxios from '../hooks/useAxios';

import PlayersCardGrid from '../components/PlayersCardGrid';
import AllPlayersTable from '../components/AllPlayersTable';

import { Player } from '../types/Player';

export default function StartingFive() {
    const maxPlayers = 5;
    const maxValue = 15;
    const [ currentFive, setCurrentFive ] = useState<Player[]>([]);
    const [ originalPlayers, setOriginalPlayers ] = useState<Player[]>([]);
    const [ filteredPlayers, setFilteredPlayers ] = useState<Player[]>([]);
    const [ totalValue, setTotalValue ] = useState(0);
   
    const { response, loading, error } = useAxios({
        method: 'get',
        url: '/players',
        baseURL: 'http://127.0.0.1:3001'
    });
    
    useEffect(() => {
        if (response) {
            const responseData: any[] = response['data'];

            if (responseData && responseData.length) {
                const currentPlayers: Player[] = [];

                responseData.forEach((data) => {
                    let currentPlayer: any = {};
                    currentPlayer.id = data['id'];
                    currentPlayer = { ...currentPlayer, ...data.attributes };
                    currentPlayers.push(currentPlayer);
                });

                setOriginalPlayers(currentPlayers);
                setFilteredPlayers(currentPlayers);
            }
        }
    }, [response]);

    useEffect(() => {
        if (filteredPlayers.length) {
            const filteredPlayers: Player[] = [];

            for (const player of originalPlayers) {
                let found = false;
                if (found) continue;
                for (const current of currentFive) {
                    if (player.id === current.id) {
                        found = true;
                        break;
                    }
                }

                if (!found) filteredPlayers.push(player);
            }

            setFilteredPlayers(filteredPlayers);
        }
    }, [currentFive]);

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

    const handleClick = () => {
        console.log('Clicked')
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
                    <Button variant='outlined' onClick={handleClick}>Submit Selected Players</Button>
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
                { error && <p>{error}</p> }
                { loading && !error && <p>Loading...</p> }
                { !loading && !error &&
                    <AllPlayersTable 
                        currentFive={currentFive as Player[]}
                        setCurrentFive={setCurrentFive}
                        players={filteredPlayers}
                        totalValue={totalValue}
                        maxPlayers={maxPlayers}
                        maxValue={maxValue}
                    />
                }
            </Box>
        </Container>
    )
}