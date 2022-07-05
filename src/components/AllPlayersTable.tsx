import { useState, useEffect, Fragment } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
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
    const [ alert, setAlert ] = useState<null | string>(null);

    const { response, loading, error } = useAxios({
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

    const validNumberOfPlayers = () => {
        if (props.maxPlayers - props.currentFive.length >= selectedPlayers.length) {
            setAlert(null);
            return true;
        } else {
            setAlert('You have too many players selected. Please unselect players, or adjust your current starting five.')
            return false;
        }
    };

    const validPointTotal = () => {
        if (!selectedPlayers.length) return false;

        let tempTotal = 0;

        selectedPlayers.forEach((player) => {
            tempTotal += player.value;
        });

        if (tempTotal + props.totalValue <= props.maxValue) {
            return true;
        } else {
            setAlert(`You point total is above the max of ${props.maxValue}. Please unselect players, or adjust your current starting five.`)
            return false;
        }
    }

    const handleSelectionModelChange = (selectedIds: any) => {
        if (!selectedIds.length) {
            setSelectedPlayersIds([]);
            setSelectedPlayers([]);
        } else {
            let deletedPlayers = selectedPlayersIds.filter(x => !selectedIds.includes(x));

            if (deletedPlayers.length) {
                const removed = selectedPlayers.filter((player) => !deletedPlayers.includes(player.id));
                setSelectedPlayers(removed);
            } else {
                const player = filteredPlayers.find((player) => player.id === selectedIds[selectedIds.length - 1]);

                if (player) {
                    setSelectedPlayers([ ...selectedPlayers, player ]);
                }
            }

            setSelectedPlayersIds(selectedIds);
        }  
    };

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
        <Box sx={{ height: 400, width: '100%' }}>
            <Fragment>
                { alert && 
                    <Alert severity='warning' style={{ 'marginBottom': '20px' }}>
                        <AlertTitle>Warning</AlertTitle>
                        {alert}
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
                        pageSize={25}
                        rowsPerPageOptions={[25]}
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