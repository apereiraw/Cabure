/* =====================================
   GMD CABURÉ
   storage.js
===================================== */

const STORAGE_KEY = "gmdCabure";

function criarBanco() {

    const banco = {

        lotes: [],

        configuracoes: {

            empresa: "Caburé",

            versao: "0.1"

        }

    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(banco));

    return banco;

}

function carregarBanco() {

    const dados = localStorage.getItem(STORAGE_KEY);

    if (!dados) {

        return criarBanco();

    }

    return JSON.parse(dados);

}

function salvarBanco(banco) {

    localStorage.setItem(STORAGE_KEY, JSON.stringify(banco));

}

function adicionarLote(lote) {

    const banco = carregarBanco();

    banco.lotes.push(lote);

    salvarBanco(banco);

}

function listarLotes() {

    return carregarBanco().lotes;

}

function excluirLote(id) {

    const banco = carregarBanco();

    banco.lotes = banco.lotes.filter(l => l.id !== id);

    salvarBanco(banco);

}