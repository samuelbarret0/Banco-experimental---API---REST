const { json, query } = require("express");
const dados = require("../bancodedados");
function gerarIdAleatoria() {
  const numeroAleatorio = Math.floor(Math.random() * 1000);
  return numeroAleatorio;
}
const listar = (requisisao, resposta) => {
  const { senha } = requisisao.query;

  if (senha !== dados.banco.senha) {
    return resposta.status(400).json({
      mensagem: "senha incorreta",
    });
  }
  return resposta.status(201).json(dados.contas);
};

const criaConta = (requisisao, resposta) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } =
    requisisao.body;

  const verificarCpf = dados.contas.find((elemento) => {
    return elemento.usuario.cpf === cpf;
  });

  if (verificarCpf) {
    return resposta.status(400).json({
      mensagem: " cpf já existe",
    });
  }
  const verificarEmail = dados.contas.find((elemento) => {
    return elemento.usuario.email === email;
  });
  if (verificarEmail) {
    return resposta.status(400).json({
      mensagem: "email já existente",
    });
  }

  const conta = {
    numero: gerarIdAleatoria(),
    saldo: 0,
    usuario: {
      nome: nome,
      cpf: cpf,
      data_nascimento: data_nascimento,
      telefone: telefone,
      email: email,
      senha: senha,
    },
  };
  dados.contas.push(conta);
  resposta.status(204).send();
};

const atualizarConta = (requisicao, resposta) => {
  const { numeroConta } = requisicao.params;
  const { nome,cpf, data_nascimento, telefone, email, senha } = requisicao.body;

  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return resposta.status(400).json("coloque todos os requisitos pedidos");
  }
  
  const conta = dados.contas.find((conta) => conta.numero == numeroConta);
 
  if (!conta) {
    return resposta.status(400).json("é necessário colocar todos os campos");
  }

  const contaCpf = dados.contas.find(
    (elemento) => elemento.usuario.cpf === cpf
  );

  if (contaCpf) {
    return resposta.status(400).json({
      mensagem: "Esse CPF já existe",
    });
  }

  const contaEmail = dados.contas.find((elemento) => {
    return elemento.usuario.email === email;
  });

  if (contaEmail) {
    return resposta.status(400).json({
      mensagem: "Esse email já existe",
    });
  }

  conta.usuario.nome = nome;
  conta.usuario.cpf = cpf;
  conta.usuario.data_nascimento = data_nascimento;
  conta.usuario.telefone = telefone;
  conta.usuario.email = email;
  conta.usuario.senha = senha;

  return resposta.status(204).send();
};



const deletarContaBancaria = (requisicao, resposta) => {
  const { numeroConta } = requisicao.params;

  const contaEncontrada = dados.contas.find((elemento) => {
    return elemento.numero === numeroConta;
  });
  console.log(contaEncontrada)

  if (!contaEncontrada) {
    return resposta.status(404).json({
      mensagem: "conta não encontrada",
    });
  }

  dados.contas = dados.contas.filter((conta) => {
    return conta.numero !== numeroConta;
  });

  resposta.status(200).json({
    mensagem:"conta deletada."
  })
};

const fazerDeposito = (requisicao, resposta) => {
    const { numero_conta, valor } = requisicao.body

    if (!numero_conta || !valor){
        return resposta.status(400).json({
            mensagem: "O número da conta e o valor são obrigatórios!"
        })
    }

    const conta = dados.contas.find((elemento) => {
        return elemento.numero == numero_conta
    })

    if(!conta) {
        return resposta.status(400).json({
            mensagem:" conta informada não encontrada"
        })
    }

    if(valor <= 0 ){
        return resposta.status(400).json({
            mensagem:" não se pode depositar valores menores ou igual a zero"
        })
    }

    dados.depositos.push({
      data: new Date(),
      "numero_conta": numero_conta,
      "valor": valor,})
    

    conta.saldo += valor

    resposta.status(200).send()
}

    const fazerSaque = (requisicao,resposta) => {
        const { numero_conta, valor, senha} = requisicao.body;

        if (!numero_conta || !valor || !senha) {
            return resposta.status(400).json({
                mensagem: "é necessário colocar todos os itens: numero da conta, valor para saque e senha."
            })
        }
        const conta = dados.contas.find((elemento) => {
            return elemento.numero == numero_conta
        })
        if(!conta){
            return resposta.status(400).json({
                mensagem: "conta não encontrada."
            })
        }
        if(senha !== conta.usuario.senha){
            return resposta.status(400).json({
                mensagem: "digita a senha correta por favor"
            })
        }

        if(valor<0){
            return resposta.status(400).json({
                mensagem: "para sacar é necessário que você digite um valor maior que 0"
            })
        }

        if(conta.saldo < valor){
            return resposta.status(400).json({
                mensagem: " o valor solicitado é maior do que o saldo da conta "
            })
        }
        conta.saldo -= valor

        dados.saques.push({
          data: new Date(),
          "numero_conta": numero_conta,
          "valor": valor,
        });

    return resposta.status(200).send()
    }

    const fazerTransferencia = (requicisao, resposta) => {
      const { numero_conta_origem, numero_conta_destino, valor, senha } = requicisao.body;

      const contaOrigem = dados.contas.find((elemento) =>{
        return elemento.numero == numero_conta_origem
      })

      const contaDestino = dados.contas.find((elemento) =>{
        return elemento.numero == numero_conta_destino
      })

      if(!contaOrigem) {
        return resposta.status(400).json({
          mensagem: " conta de origem não existe "
        })
      }

      if(!contaDestino){
        return mensagem.status(400).json({
          mensagem : "conta de Destino não existe"
        })
      }



      if( senha !== contaOrigem.usuario.senha) {
        return resposta.status(400).json({
          mensagem: "senha invalida"
        })
      }

      if( valor <= 0){
        return resposta.status(400).json({
          mensagem: " o valor solicidado precisa ser maior que zero"
        })
      }

        if(valor > contaOrigem.saldo) {
          return resposta.status(400).json({
            mensagem: "erro, o valor solicitado é menor do que o valor contido na conta de origem."
          })
        }

        contaOrigem.saldo -= valor;
        contaDestino.saldo += valor;

        dados.transferencias.push({
          data: new Date(),
          "numero_conta": numero_conta,
          "valor": valor,
        });

        return resposta.status(200).send()

    }

    const retornoSaldo = (requicisao,resposta) => {
        const { numero_conta,senha} = requicisao.query

        const conta = dados.contas.find((elemento) => {
          return elemento.numero == numero_conta
      })

      if(!numero_conta && !senha ){
        return resposta.status(400).json({
          mensagem: "coloque todos os requisitos pedidos"
        })
      }


      if(!conta){
        return resposta.status(400).json({
          mensagem: "conta não encontrada."
        })
      }

      if(senha !== conta.usuario.senha){
        return resposta.status(400).json({
          mensagem: "senha inválida"
        })
      }
      
      return resposta.status(200).json({saldo: `${conta.saldo}`} )
      
    }

    const retornarExtrato = (requisicao, resposta) => {
      const { numero_conta, senha} = requisicao.query
      if(!numero_conta && !senha ){
        return resposta.status(400).json({
          mensagem: "coloque todos os requisitos pedidos"
        })
      }

      const conta = dados.contas.find((elemento) => {
        return elemento.numero == numero_conta
    })

    if(!conta){
      return resposta.status(400).json({
        mensagem: "conta não encontrada."
      })
    }

    if(senha !== conta.usuario.senha){
      return resposta.status(400).json({
        mensagem: "senha inválida"
      })
    } 
    
    const saque = dados.saques.filter((elemento) => {
      return elemento.numero_conta == numero_conta;
    });
    const deposito = dados.depositos.filter((elemento) => {
      return elemento.numero_conta == numero_conta;
    })  ;  
    const transferencias = dados.transferencias.filter((elemento) => {
      return elemento.numero_conta == numero_conta;
    });

    return resposta.status(200).json({
      saque, deposito, transferencias
    })
  }
module.exports = { listar, criaConta, atualizarConta, deletarContaBancaria, fazerDeposito, fazerSaque, fazerTransferencia, retornoSaldo, retornarExtrato};
