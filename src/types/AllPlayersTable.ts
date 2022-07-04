import { Player } from './Player';

interface AllPlayersTableProps {
    currentFive: Player[];
    setCurrentFive: any;
    players: Player[];
    totalValue: number;
    maxPlayers: number;
    maxValue: number;
}

export type { AllPlayersTableProps };