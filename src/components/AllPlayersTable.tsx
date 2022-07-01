import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import useAxios from '../hooks/useAxios';

import { PlayersResponseData } from '../types/PlayersResponse';
import { Player } from '../types/Player';

const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First name', width: 200 },
    { field: 'lastName', headerName: 'Last name', width: 200 },
    { field: 'team', headerName: 'Team', width: 130 },
    { field: 'position', headerName: 'Position', width: 130 },
    { field: 'age', headerName: 'Age', type: 'number', width: 130 },
];

export default function AllPlayersTable() {
    const [ responseData, setResponseData ] = useState<PlayersResponseData[]>([]);

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

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            { error && <p>{error}</p> }
            { loading && !error && <p>Loading...</p> }
            { !loading && !error &&
                <DataGrid
                    rows={players}
                    columns={columns}
                    pageSize={25}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                />
            }
        </Box>
    )
}