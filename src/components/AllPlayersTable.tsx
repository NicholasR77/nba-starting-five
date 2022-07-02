import { useState, useEffect, Fragment } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import useAxios from '../hooks/useAxios';

import { PlayersResponseData } from '../types/PlayersResponse';
import { Player } from '../types/Player';

const maxPlayers = 5;

const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First name', width: 200 },
    { field: 'lastName', headerName: 'Last name', width: 200 },
    { field: 'team', headerName: 'Team', width: 130 },
    { field: 'position', headerName: 'Position', width: 130 },
    { field: 'age', headerName: 'Age', type: 'number', width: 130 },
];

export default function AllPlayersTable(props: { currentFive: Player[], setCurrentFive: any }) {
    const [ responseData, setResponseData ] = useState<PlayersResponseData[]>([]);
    const [ selectedPlayers, setSelectedPlayers ] = useState([]);
    const [ alert, setAlert ] = useState<null | string>(null);

    const players: Player[] = [];
    
    if (responseData.length) {
        responseData.forEach((data) => {
            let currentPlayer: any = {};
            currentPlayer.id = data['id'];
            currentPlayer = { ...currentPlayer, ...data.attributes };
            players.push(currentPlayer);
        });
    }
   
    const { response, loading, error } = useAxios({
        method: 'get',
        url: '/players',
        baseURL: 'http://127.0.0.1:3001'
    });

    useEffect(() => {
        if (response !== null && response['data'] !== null) {
            setResponseData(response['data']);
        }
    }, [response]);

    const handleSelectionModelChange = (e: any) => {
        setSelectedPlayers(e);
    };

    const handleOnClick = () => {
        if (selectedPlayers.length && maxPlayers - props.currentFive.length >= selectedPlayers.length) {
            setAlert(null);
        } else {
            setAlert('You have too many players selected. Please unselect players, or adjust your current starting five.')
        }
    };

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            { error && <p>{error}</p> }
            { loading && !error && <p>Loading...</p> }
            { !loading && !error &&
                <Fragment>
                    { alert && 
                        <Alert severity='warning' style={{ 'marginBottom': '20px' }}>
                            <AlertTitle>Warning</AlertTitle>
                            {alert}
                        </Alert>
                    }
                    <Stack direction='row' justifyContent='space-between' style={{ 'paddingBottom': '20px' }}>
                        <h2>All Players</h2>
                        <Button variant='outlined' onClick={handleOnClick} disabled={!selectedPlayers.length}>Add Selected Players</Button>
                    </Stack>
                    <DataGrid
                        rows={players}
                        columns={columns}
                        pageSize={25}
                        rowsPerPageOptions={[]}
                        disableColumnMenu={true}
                        onSelectionModelChange={(e) => handleSelectionModelChange(e)}
                        checkboxSelection
                        disableSelectionOnClick
                    />
                </Fragment>  
            }
        </Box>
    )
}