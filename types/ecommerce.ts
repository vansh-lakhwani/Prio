export interface Cliente {
  idcliente: number;
  fnome: string;
  minit: string | null;
  lnome: string | null;
  cpf: string;
  endereco: string | null;
  datanascimento: string | null;
}

export interface Produto {
  idproduto: number;
  pnome: string;
  classificacaokids: boolean;
  categoria: string;
  avaliacao: number;
  dimensoes: string | null;
}

export interface Pagamento {
  idpagamento: number;
  idcliente: number;
  idtipo: number;
  statuspagamento: string | null;
}

export interface Pedido {
  idpedido: number;
  idcliente: number;
  statuspedido: string;
  descricao: string | null;
  frete: number;
  pagamentoboleto: boolean;
}

export interface Estoque {
  idestoque: number;
  local: string;
  quantidade: number;
}

export interface Fornecedor {
  idfornecedor: number;
  razaosocial: string;
  cnpj: string;
  contato: string;
}

export interface Vendedor {
  idvendedor: number;
  razaosocial: string;
  nomefantasia: string | null;
  cnpj: string | null;
  cpf: string | null;
  local: string | null;
  contato: string;
}

export interface DisponibilizaProduto {
  idfornecedor: number;
  idproduto: number;
}

export interface EstoqueLocal {
  idestoque: number;
  idproduto: number;
  quantidade: number;
}

export interface PedidoProduto {
  idpedido: number;
  idproduto: number;
  quantidade: number;
}

export interface TipoPagamento {
  idtipo: number;
  tipo: string;
}

export interface StatusPedido {
  idstatus: number;
  status: string;
}

export interface Entrega {
  identrega: number;
  idpedido: number;
  codigorastreio: string | null;
  statusentrega: string | null;
}
