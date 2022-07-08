import { useState, useEffect, Fragment } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import useAxios from '../hooks/useAxios';

import { Player } from '../types/Player';
import { AllPlayersTableProps } from '../types/AllPlayersTable';

const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First name', width: 200 },
    { field: 'lastName', headerName: 'Last name', width: 200 },
    { field: 'team', headerName: 'Team', width: 130 },
    { field: 'position', headerName: 'Position', width: 130 },
    { field: 'age', headerName: 'Age', type: 'number', width: 130 },
    { field: 'value', headerName: 'Point Value', type: 'number', width: 130 },
    { field: 'heightInches', headerName: 'Height (inches)', type: 'number', width: 130 },
    { field: 'ppg', headerName: 'Points', type: 'number', width: 130 },
    { field: 'fgPercent', headerName: 'FG Percent', type: 'number', width: 130 },
    { field: 'ftPercent', headerName: 'FT Percent', type: 'number', width: 130 },
    { field: 'rebounds', headerName: 'Rebounds', type: 'number', width: 130 },
    { field: 'assists', headerName: 'Assists', type: 'number', width: 130 },
    { field: 'steals', headerName: 'Steals', type: 'number', width: 130 },
    { field: 'blocks', headerName: 'Blocks', type: 'number', width: 130 },
];

export default function AllPlayersTable(props: AllPlayersTableProps) {
    const [ originalPlayers, setOriginalPlayers ] = useState<Player[]>([]);
    const [ filteredPlayers, setFilteredPlayers ] = useState<Player[]>([]);
    const [ selectedPlayers, setSelectedPlayers ] = useState<Player[]>([]);
    const [ selectedPlayersIds, setSelectedPlayersIds ] = useState<string[]>([]);
    const [ alert, setAlert ] = useState<null | { type: string, message: string }>(null);

    const { response, status, loading, error } = useAxios({
        method: 'get',
        url: '/players',
        baseURL: 'http://127.0.0.1:3001'
    });
    
    // Fetching players from nba-api
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

    // Removing players in current starting five from available players to select
    useEffect(() => {
        if (filteredPlayers.length) {
            const filteredPlayers: Player[] = [];

            for (const player of originalPlayers) {
                let found = false;
                if (found) continue;
                for (const current of props.currentFive) {
                    if (player.id === current.id) {
                        found = true;
                        break;
                    }
                }

                if (!found) filteredPlayers.push(player);
            }

            setFilteredPlayers(filteredPlayers);
        }
    }, [props.currentFive]);

    // When the selected players changes, check whether the selections are valid
    useEffect(() => {
        validSelection();
    }, [selectedPlayers]);

    const validSelection = () => {
        if (validNumberOfPlayers() && validPointTotal()) {
            return true;
        } else {
            return false;
        }
    }

    // Check to see if the total number of selected players is above the max allowed
    const validNumberOfPlayers = () => {
        if (props.maxPlayers - props.currentFive.length >= selectedPlayers.length) {
            setAlert(null);
            return true;
        } else {
            setAlert({ type: 'warning', message: 'You have too many players selected. Please unselect players, or adjust your current starting five.' })
            return false;
        }
    };

    // Check to see if the total value of all selected players is above the max allowed
    const validPointTotal = () => {
        if (!selectedPlayers.length) return false;

        let tempTotal = 0;

        selectedPlayers.forEach((player) => {
            tempTotal += player.value;
        });

        if (tempTotal + props.totalValue <= props.maxValue) {
            return true;
        } else {
            setAlert({ type: 'warning', message: `You point total is above the max of ${props.maxValue}. Please unselect players, or adjust your current starting five.` });
            return false;
        }
    }

    // When a player is checked, add them to the selected players
    // If a player is unchecked, remove them from the selected players
    const handleSelectionModelChange = (eventIds: any) => {
        if (!eventIds.length) {
            setSelectedPlayersIds([]);
            setSelectedPlayers([]);
        } else {
            // Compare the ids of the event to the current ids selected
            // The difference between the two are the players that are deleted
            let deletedPlayers = selectedPlayersIds.filter(id => !eventIds.includes(id));

            if (deletedPlayers.length) {
                 // If we have deleted players, remove them from the current selection of players
                const removeDeleted = selectedPlayers.filter((player) => !deletedPlayers.includes(player.id));
                setSelectedPlayers(removeDeleted);
            } else {
                // Find the player's data from the players prop
                const player = filteredPlayers.find((player) => player.id === eventIds[eventIds.length - 1]);

                 // Add the player data to the current selection of players 
                if (player) setSelectedPlayers([ ...selectedPlayers, player ]);
            }

            // Reset the current selection of player ids to the event ids passed in
            setSelectedPlayersIds(eventIds);
        }  
    };

    // If our current player selections are valid, add them to the starting five
    const handleOnClick = () => {
        if (selectedPlayers.length && validSelection()) {
            props.setCurrentFive([ ...props.currentFive, ...selectedPlayers ]);
            setSelectedPlayers([]);
        }
    };

    const isButtonDisabled = () => {
        if (!selectedPlayers.length || alert) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <Box sx={{ height: 400, width: '100%', marginBottom: '80px' }}>
            <Fragment>
                { alert && 
                    <Alert severity={alert.type as any} style={{ 'marginBottom': '20px' }}>
                        {alert.message}
                    </Alert>
                }
                <Stack direction='row' justifyContent='space-between' alignItems='center' style={{ 'paddingBottom': '20px' }}>
                    <h2>All Players</h2>
                    <Button variant='outlined' onClick={handleOnClick} disabled={isButtonDisabled()}>Add Selected Players</Button>
                </Stack>
                { error && <p>{error}</p> }
                { loading && !error && <p>Loading...</p> }
                { !loading && !error &&
                    <DataGrid
                        rows={filteredPlayers}
                        columns={columns}
                        pageSize={50}
                        rowsPerPageOptions={[50]}
                        disableColumnMenu={true}
                        onSelectionModelChange={(e) => handleSelectionModelChange(e)}
                        checkboxSelection
                        disableSelectionOnClick
                    />
                }
            </Fragment>
        </Box>
    )
}