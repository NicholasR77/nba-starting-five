import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import ExampleStartingFive from '../partials/StartingFive.json';

const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First name', width: 200 },
    { field: 'lastName', headerName: 'Last name', width: 200 },
    { field: 'team', headerName: 'Team', width: 130 },
    { field: 'position', headerName: 'Position', width: 130 },
    { field: 'age', headerName: 'Age', type: 'number', width: 130 },
];

const rows = ExampleStartingFive.startingFive;

export default function AllPlayersTable() {
    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
            />
      </Box>
    )
}