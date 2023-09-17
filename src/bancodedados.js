module.exports = {
    banco: {
        nome: 'Cubos Bank',
        numero: '123',
        agencia: '0001',
        senha: 'Cubos123Bank'
    },
    contas: [
        {
          numero: '1',
          saldo: 0,
          usuario: {
            nome: 'samuel do pix',
            cpf: '11111111111',
            data_nascimento: '2021-03-15',
            telefone: '71999998888',
            email: 'samuel@gmail.com.com',
            senha: '1234',
          },
        },
        {
          numero: '2',
          saldo: 1000,
          usuario: {
            nome: 'juca',
            cpf: '22222222',
            data_nascimento: '2021-03-15',
            telefone: '71999998888',
            email: 'juca@email.com',
            senha: '12345',
          },
        },
      ],
    saques: [],
    depositos: [],
    transferencias: []
}