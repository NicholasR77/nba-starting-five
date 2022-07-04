import { useState, useEffect, Fragment } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { Player } from '../types/Player';
import { AllPlayersTableProps } from '../types/AllPlayersTable';

const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First name', width: 200 },
    { field: 'lastName', headerName: 'Last name', width: 200 },
    { field: 'team', headerName: 'Team', width: 130 },
    { field: 'position', headerName: 'Position', width: 130 },
    { field: 'age', headerName: 'Age', type: 'number', width: 130 },
    { field: 'value', headerName: 'Value', type: 'number', width: 130 },
];

export default function AllPlayersTable(props: AllPlayersTableProps) {
    const [ selectedPlayers, setSelectedPlayers ] = useState<Player[]>([]);
    const [ alert, setAlert ] = useState<null | string>(null);

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

    const handleSelectionModelChange = (e: any) => {
        if (!e.length) {
            setSelectedPlayers([])
        } else {
            const player = props.players.find((player) => player.id === e[e.length - 1]);

            if (player) {
                setSelectedPlayers([ ...selectedPlayers, player ]);
            }
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
                <Stack direction='row' justifyContent='space-between' style={{ 'paddingBottom': '20px' }}>
                    <h2>All Players</h2>
                    <Button variant='outlined' onClick={handleOnClick} disabled={isButtonDisabled()}>Add Selected Players</Button>
                </Stack>
                <DataGrid
                    rows={props.players}
                    columns={columns}
                    pageSize={25}
                    rowsPerPageOptions={[]}
                    disableColumnMenu={true}
                    onSelectionModelChange={(e) => handleSelectionModelChange(e)}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </Fragment>
        </Box>
    )
}