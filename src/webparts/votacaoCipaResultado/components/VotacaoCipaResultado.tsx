import * as React from 'react';
import styles from './VotacaoCipaResultado.module.scss';
import { IVotacaoCipaResultadoProps } from './IVotacaoCipaResultadoProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jQuery from "jquery";
import "bootstrap";

var _anoVotacao;
var _anoVotacaoBusca;
var _url;
var _filial;

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");

export default class VotacaoCipaResultado extends React.Component<IVotacaoCipaResultadoProps, {}> {

  public async componentDidMount() {


    document
      .getElementById("dllAno")
      .addEventListener("change", (e: Event) => this.montaResultado());

    document
      .getElementById("btnImprimir")
      .addEventListener("click", (e: Event) => this.print());




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
      url: `${_url}/_api/web/lists/getbytitle('Candidatos')/items?$select=ID,Title&$filter=Ano eq '${_anoVotacao}'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var candidato = resultData.d.results[i].Title;
            console.log("candidato: ", candidato);

            console.log();

            jQuery.ajax({
              url: `${_url}/_api/web/lists/getbytitle('Votos')/items?$select=ID,Title&$filter=Title eq '${candidato}' and V_x00e1_lido eq 1 and Ano eq '${_anoVotacao}'`,
              type: "GET",
              async: false,
              headers: { 'Accept': 'application/json; odata=verbose;' },
              success: function (resultData) {

                var total = resultData.d.results.length;
                var montaResult = candidato + ": <b>" + total + "</b><br><br>";
                jQuery("#divResultados").append(montaResult);

              },
              error: function (jqXHR, textStatus, errorThrown) {
                console.log("Erro em get Candidatos: " + textStatus)
              }
            });

          }

        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });


    jQuery.ajax({
      url: `${_url}/_api/web/lists/getbytitle('Votos')/items?$select=ID,Title&$filter=Title eq 'Voto em branco' and V_x00e1_lido eq 1 and Ano eq '${_anoVotacao}'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        var total = resultData.d.results.length;
        var montaResult = "Voto em branco:<b> " + total + "</b><br><br>";
        jQuery("#divResultados").append(montaResult);

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Erro em get Candidatos: " + textStatus)
      }
    });


    jQuery.ajax({
      url: `${_url}/_api/web/lists/getbytitle('Votos')/items?$select=ID,Title&$filter=Title eq 'Voto nulo' and V_x00e1_lido eq 1 and Ano eq '${_anoVotacao}'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        var total = resultData.d.results.length;
        var montaResult = "Voto nulo:<b> " + total + "</b><br><br>";
        jQuery("#divResultados").append(montaResult);

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Erro em get Candidatos: " + textStatus)
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


  public render(): React.ReactElement<IVotacaoCipaResultadoProps> {
    return (

      <>

        <label htmlFor="dllAno">Ano de eleição:</label>
        <select className="form-control" id="dllAno" style={{ "width": "150px" }}>
        </select>

        <br /><br />

        <div id='divConteudo' className="container-fluid border" style={{ "width": "600px" }}>

        <br /><h3><b>Eleição <span id='txtAno'></span> - Filial <span id='txtFilial'></span></b></h3><br />

          <div>
            <div id="divResultados">
              <br />
            </div>
          </div>

        </div>

        <br /><br />

        <button type="button" id="btnImprimir" className="btn btn-success">Imprimir</button>


      </>
    );
  }



  private montaResultado() {

    jQuery("#divResultados").empty();

    _anoVotacaoBusca = $("#dllAno option:checked").val();

    jQuery("#txtAno").html(_anoVotacaoBusca);
    jQuery("#txtFilial").html(_filial);

    jQuery.ajax({
      url: `${_url}/_api/web/lists/getbytitle('Candidatos')/items?$select=ID,Title&$filter=Ano eq '${_anoVotacaoBusca}'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var candidato = resultData.d.results[i].Title;
            console.log("candidato: ", candidato);

            console.log();

            jQuery.ajax({
              url: `${_url}/_api/web/lists/getbytitle('Votos')/items?$select=ID,Title&$filter=Title eq '${candidato}' and V_x00e1_lido eq 1 and Ano eq '${_anoVotacaoBusca}'`,
              type: "GET",
              async: false,
              headers: { 'Accept': 'application/json; odata=verbose;' },
              success: function (resultData) {

                var total = resultData.d.results.length;
                var montaResult = candidato + ": <b>" + total + "</b><br><br>";
                jQuery("#divResultados").append(montaResult);

              },
              error: function (jqXHR, textStatus, errorThrown) {
                console.log("Erro em get Candidatos: " + textStatus)
              }
            });

          }

        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });


    jQuery.ajax({
      url: `${_url}/_api/web/lists/getbytitle('Votos')/items?$select=ID,Title&$filter=Title eq 'Voto em branco' and V_x00e1_lido eq 1 and Ano eq '${_anoVotacaoBusca}'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        var total = resultData.d.results.length;
        var montaResult = "Voto em branco:<b> " + total + "</b><br><br>";
        jQuery("#divResultados").append(montaResult);

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Erro em get Candidatos: " + textStatus)
      }
    });


    jQuery.ajax({
      url: `${_url}/_api/web/lists/getbytitle('Votos')/items?$select=ID,Title&$filter=Title eq 'Voto nulo' and V_x00e1_lido eq 1 and Ano eq '${_anoVotacaoBusca}'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        var total = resultData.d.results.length;
        var montaResult = "Voto nulo:<b> " + total + "</b><br><br>";
        jQuery("#divResultados").append(montaResult);

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Erro em get Candidatos: " + textStatus)
      }
    });




  }


  private print() {

    var divToPrint = document.getElementById("divConteudo");
    var newWin = window.open("");
    newWin.document.write(divToPrint.outerHTML);



  }
}
