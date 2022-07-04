import { Player } from './Player';

interface AllPlayersTableProps {
    currentFive: Player[];
    setCurrentFive: any;
    totalValue: number;
    maxPlayers: number;
    maxValue: number;
}

export type { AllPlayersTableProps };