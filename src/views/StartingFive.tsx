import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import useAxios from '../hooks/useAxios';

import PlayersCardGrid from '../components/PlayersCardGrid';
import AllPlayersTable from '../components/AllPlayersTable';

import { Player } from '../types/Player';

import ExampleStartingFive from '../partials/StartingFive.json';

export default function StartingFive() {
    const [ currentFive, setCurrentFive ] = useState(ExampleStartingFive.startingFive as Player[]);
    const [ originalPlayers, setOriginalPlayers ] = useState<Player[]>([]);
    const [ filteredPlayers, setFilteredPlayers ] = useState<Player[]>([]);
   
    const { response, loading, error } = useAxios({
        method: 'get',
        url: '/players',
        baseURL: 'http://127.0.0.1:3001'
    });
    
    useEffect(() => {
        if (response !== null) {
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
                { error && <p>{error}</p> }
                { loading && !error && <p>Loading...</p> }
                { !loading && !error &&
                    <AllPlayersTable currentFive={currentFive as Player[]} setCurrentFive={setCurrentFive} players={filteredPlayers} />
                }
            </Box>
        </Container>
    )
}