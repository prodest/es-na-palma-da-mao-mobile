export interface Prevision {
    acessibilidade: boolean;
    horarioDaTransmissao: number;
    horarioDePartida: number;
    horarioNaOrigem: number;
    horarioNoDestino?: number;
    itinerarioId: number;
    veiculo: string;
    bandeira: string;
    complemento: string;
    descricaoLinha: string;
    identificadorLinha: string;
    linhaId: number;
    previsaoEmMinutos: number;
    previsao: string;
    confiabilidade: string;
    pontoDeOrigemId: number;
    pontoDeDestinoId: number;
}
