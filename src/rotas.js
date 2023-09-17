const express = require('express');
const rota = express();
const controller = require ('./controller/bancodecontrole')

rota.get('/contas', controller.listar) 
rota.post('/contas', controller.criaConta)
rota.put('/contas/:numeroConta/usuario', controller.atualizarConta)
rota.delete('/contas/:numeroConta' , controller.deletarContaBancaria)
rota.post('/transacoes/depositar', controller.fazerDeposito)
rota.post('/transacoes/sacar', controller.fazerSaque)
rota.post('/transacoes/transferir', controller.fazerTransferencia )
rota.get('/contas/saldo', controller.retornoSaldo)
rota.get('/contas/extrato', controller.retornarExtrato) 

module.exports = rota