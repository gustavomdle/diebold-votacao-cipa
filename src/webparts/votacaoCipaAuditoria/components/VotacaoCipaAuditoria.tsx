import * as React from 'react';
import styles from './VotacaoCipaAuditoria.module.scss';
import { IVotacaoCipaAuditoriaProps } from './IVotacaoCipaAuditoriaProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jQuery from "jquery";
import "bootstrap";

var _anoVotacao;
var _anoVotacaoBusca;
var _url;
var _filial;
var _nomeFuncionario;
var _eleitor;
var _cargo;
var _setor;


require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");

export default class VotacaoCipaAuditoria extends React.Component<IVotacaoCipaAuditoriaProps, {}> {


  public async componentDidMount() {


    document
      .getElementById("dllAno")
      .addEventListener("change", (e: Event) => this.montaResultado());


    _url = this.props.siteurl;

    jQuery.ajax({
      url: `${_url}/_api/web/lists/getbytitle('ConfiguracaoGeral')/items?$select=ID,Title,Valor&$filter=Title eq 'AnoVotacao'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            _anoVotacao = resultData.d.results[i].Valor;
            console.log("_anoVotacao", _anoVotacao);

          }

        } else {
          alert("Ano de votação não configurado. Contate o adminstrador!");
          return false;
        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });

    jQuery.ajax({
      url: `${_url}/_api/web/lists/getbytitle('ConfiguracaoGeral')/items?$select=ID,Title,Valor&$filter=Title eq 'Filial'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            _filial = resultData.d.results[i].Valor;
            console.log("_filial", _filial);

          }

        } else {
          alert("Ano de votação não configurado. Contate o adminstrador!");
          return false;
        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });



    jQuery.ajax({
      url: `${_url}/_api/web/lists/getbytitle('Funcionarios')/items?$select=ID,Title,DescricaoCargo,Setor&$filter=Ano eq '${_anoVotacao}'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            _nomeFuncionario = resultData.d.results[i].Title;
            _cargo = resultData.d.results[i].DescricaoCargo;
            _setor = resultData.d.results[i].Setor;

            jQuery.ajax({
              url: `${_url}/_api/web/lists/getbytitle('Votos')/items?$select=ID,Title,V_x00e1_lido,Created&$filter=Eleitor eq '${_nomeFuncionario}' and V_x00e1_lido eq 1 and Ano eq '${_anoVotacao}'`,
              type: "GET",
              async: false,
              headers: { 'Accept': 'application/json; odata=verbose;' },
              success: function (resultData) {

                var votou = "Não";
                var criado = "-";

                var total = resultData.d.results.length;
                if (total > 0) votou = "Sim";

                for (var i = 0; i < resultData.d.results.length; i++) {

                  votou = "Sim";
                  var strCriado = (resultData.d.results[i].Created).toLocaleString("pt");
                  var dia = strCriado.substring(8, 10);
                  var mes = strCriado.substring(5, 7);
                  var ano = strCriado.substring(0, 4);
                  criado = dia + "/" + mes + "/" + ano;

                }

                var montaTabelaMeio = '<tr>' +
                  '<td>' + _nomeFuncionario + '</td>' +
                  '<td>' + _cargo + '</td>' +
                  '<td>' + _setor + '</td>' +
                  '<td>' + votou + '</td>' +
                  '<td>' + criado + '</td>' +
                  '</tr>';

                jQuery("#divResultados").append(montaTabelaMeio);

                jQuery("#divCarregando").css("display", "none");
                jQuery("#divConteudo").css("display", "block");

              },
              error: function (jqXHR, textStatus, errorThrown) {
              }
            });

          }

        } else {
          alert("Nenhum funcionário encontrado!");
          return false;
        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Votos')/items?$select=ID,Title,Ano&$orderby = Title`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        var arrValores = [];

        var montaCombo = "";

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            if (arrValores.indexOf(resultData.d.results[i].Ano) === -1) {
              arrValores.push(resultData.d.results[i].Ano);
              montaCombo += `<option class="optAno" value="${resultData.d.results[i].Ano}">${resultData.d.results[i].Ano}</option>`;
            }
            //arrValores.push(resultData.d.results[i].Ano);


          }

          console.log("arrValores", arrValores);

          //montaCombo += `<option value="volvo">${resultData.d.results[i].Ano}</option>`;

          jQuery("#dllAno").html(montaCombo);
          jQuery("#dllAno").val(_anoVotacao).change();

        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });

    jQuery("#txtAno").html(_anoVotacao);
    jQuery("#txtFilial").html(_filial);


  }


  public render(): React.ReactElement<IVotacaoCipaAuditoriaProps> {
    return (

      <><div id="divCarregando" >

        <p>Carregando! Aguarde.....</p>

      </div>

        <div id="divConteudo" style={{ "display": "none" }}>

          <label htmlFor="dllAno">Ano de eleição:</label>
          <select className="form-control" id="dllAno" style={{ "width": "150px" }}>
          </select>

          <br /><br />

          <div id='divConteudo' className="container-fluid border" style={{ "width": "800px" }}>

            <br /><h3><b>Eleição <span id='txtAno'></span> - Filial <span id='txtFilial'></span></b></h3><br />

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Funcionário</th>
                  <th scope="col">Cargo</th>
                  <th scope="col">Setor</th>
                  <th scope="col">Votou?</th>
                  <th scope="col">Data do voto</th>
                </tr>
              </thead>
              <tbody id="divResultados">
              </tbody>
            </table>

          </div>

        </div></>

    );
  }


  private montaResultado() {


    $("#divCarregando").css("display", "block");
    $("#divConteudo").css("display", "none");


    jQuery("#divResultados").empty();

    _anoVotacaoBusca = $("#dllAno option:checked").val();

    jQuery("#txtAno").html(_anoVotacaoBusca);
    jQuery("#txtFilial").html(_filial);

    jQuery.ajax({
      url: `${_url}/_api/web/lists/getbytitle('Funcionarios')/items?$select=ID,Title,DescricaoCargo,Setor&$filter=Ano eq '${_anoVotacaoBusca}'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            _nomeFuncionario = resultData.d.results[i].Title;
            _cargo = resultData.d.results[i].DescricaoCargo;
            _setor = resultData.d.results[i].Setor;

            jQuery.ajax({
              url: `${_url}/_api/web/lists/getbytitle('Votos')/items?$select=ID,Title,V_x00e1_lido,Created&$filter=Eleitor eq '${_nomeFuncionario}' and V_x00e1_lido eq 1 and Ano eq '${_anoVotacaoBusca}'`,
              type: "GET",
              async: false,
              headers: { 'Accept': 'application/json; odata=verbose;' },
              success: function (resultData) {

                var votou = "Não";
                var criado = "-";

                var total = resultData.d.results.length;
                if (total > 0) votou = "Sim";

                for (var i = 0; i < resultData.d.results.length; i++) {

                  votou = "Sim";
                  var strCriado = (resultData.d.results[i].Created).toLocaleString("pt");
                  var dia = strCriado.substring(8, 10);
                  var mes = strCriado.substring(5, 7);
                  var ano = strCriado.substring(0, 4);
                  criado = dia + "/" + mes + "/" + ano;

                }

                var montaTabelaMeio = '<tr>' +
                  '<td>' + _nomeFuncionario + '</td>' +
                  '<td>' + _cargo + '</td>' +
                  '<td>' + _setor + '</td>' +
                  '<td>' + votou + '</td>' +
                  '<td>' + criado + '</td>' +
                  '</tr>';

                jQuery("#divResultados").append(montaTabelaMeio);

                jQuery("#divCarregando").css("display", "none");
                jQuery("#divConteudo").css("display", "block");


              },
              error: function (jqXHR, textStatus, errorThrown) {
              }
            });

          }

        } else {
          alert("Nenhum funcionário encontrado!");
          return false;
        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });


  }
}
