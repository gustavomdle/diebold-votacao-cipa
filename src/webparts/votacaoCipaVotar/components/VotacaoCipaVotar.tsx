import * as React from 'react';
import styles from './VotacaoCipaVotar.module.scss';
import { IVotacaoCipaVotarProps } from './IVotacaoCipaVotarProps';
import * as jQuery from "jquery";
import "bootstrap";
import { escape } from '@microsoft/sp-lodash-subset';

import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { allowOverscrollOnElement } from 'office-ui-fabric-react';

import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';

import { ListItemPicker } from '@pnp/spfx-controls-react/lib/listItemPicker';
import { Web } from "sp-pnp-js";

export interface IControlsState {
  selectedValues: any[];
}


require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../../../css/votar.css");

var _web;
var _hrDataInicio;
var _hrDataFim;
var _url;
var _today = new Date();
var _nomeEleitor;
var _anoVotacao;
var _dataApuracao;
var _emailContato;
var _telContato;

export default class VotacaoCipaVotar extends React.Component<IVotacaoCipaVotarProps, IControlsState> {

  constructor(props: IVotacaoCipaVotarProps, state: IControlsState) {
    super(props);
    this.state = { selectedValues: [] };
  }

  public async componentDidMount() {

    document
      .getElementById("btnVotar")
      .addEventListener("click", (e: Event) => this.preencheInformacoesConfirmacao("Votar"));

    document
      .getElementById("btnVotarBranco")
      .addEventListener("click", (e: Event) => this.preencheInformacoesConfirmacao("Branco"));

    document
      .getElementById("btnVotarNulo")
      .addEventListener("click", (e: Event) => this.preencheInformacoesConfirmacao("Nulo"));

    document
      .getElementById("ckConfirmar")
      .addEventListener("change", (e: Event) => this.ckConfirmar());

    document
      .getElementById("btnOkMsgVotoSucesso")
      .addEventListener("click", (e: Event) => this.redirecionar());

    document
      .getElementById("btnValidaSeVotou")
      .addEventListener("click", (e: Event) => this.redirecionar());

    document
      .getElementById("btnConfirmarVoto")
      .addEventListener("click", (e: Event) => this.registrarVoto('Votar'));

    document
      .getElementById("btnConfirmarVotoEmBranco")
      .addEventListener("click", (e: Event) => this.registrarVoto('Branco'));

    document
      .getElementById("btnConfirmarVotarNulo")
      .addEventListener("click", (e: Event) => this.registrarVoto('Nulo'));


    jQuery('#btnVotar').prop("disabled", true);
    jQuery('#btnVotarBranco').prop("disabled", true);
    jQuery('#btnVotarNulo').prop("disabled", true);

    jQuery("#conteudoVotacao").hide();
    jQuery("#divForaHorario").hide();

    _web = new Web(this.props.context.pageContext.web.absoluteUrl);
    var _url = this.props.siteurl;

    console.log("_url", _url);

    jQuery.ajax({
      url: `${_url}/_api/web/lists/getbytitle('ConfiguracaoAcesso')/items?$select=ID,Title,Data&$filter= Title eq 'Inicio'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },

      success: function (resultData) {

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var dataInicio = resultData.d.results[i].Data;

          }

          if (dataInicio != "") {

            _hrDataInicio = new Date(dataInicio);
            console.log("_hrDataInicio1", _hrDataInicio);

            jQuery.ajax({
              url: `${_url}/_api/web/lists/getbytitle('ConfiguracaoAcesso')/items?$select=ID,Title,Data&$filter= Title eq 'Fim'`,
              type: "GET",
              async: false,
              headers: { 'Accept': 'application/json; odata=verbose;' },
              success: function (resultData) {

                if (resultData.d.results.length > 0) {

                  for (var i = 0; i < resultData.d.results.length; i++) {

                    var dataFim = resultData.d.results[i].Data;

                  }

                  if (dataFim != "") {

                    _hrDataFim = new Date(dataFim);


                  } else {
                    alert("Data final não configurada. Contate o adminstrador!");
                    return false;
                  }


                }

              },
              error: function (jqXHR, textStatus, errorThrown) {
              }
            });


          } else {
            alert("Data de início não configurada. Contate o adminstrador!");
            return false;
          }

        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });

    this.verificaHorario();
    this.verificaConfiguracoes();

  }



  public render(): React.ReactElement<IVotacaoCipaVotarProps> {
    return (


      <><div id="conteudoVotacao">


        <div className="form-group">

          <label htmlFor="lbtxtEleitor">Meu nome é:</label>

          <ListItemPicker listId={this.props.listId}
            columnInternalName='Title'
            keyColumnInternalName='Id'
            itemLimit={1}
            onSelectedItem={this.onSelectedItem}
            context={this.props.context as any}
          />
          <br></br>

          <label htmlFor="exampleInputEmail1">Meu voto vai para:</label>
        </div>


        <div id="divCandidatos">

        </div>

        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="ckConfirmar" />
          <label className="form-check-label" htmlFor="exampleCheck1">Confirmo que estou votando em meu nome.</label>
        </div>

        <br></br>

        <button type="button" id="btnVotarBranco"
          className="btn btn-warning" data-toggle="button" aria-pressed="false" data-autocomplete="off">
          Votar em Branco
        </button>
        <button type="button" id="btnVotarNulo" className="btn btn-warning"
          data-toggle="button" aria-pressed="false" data-autocomplete="off" >
          Votar Nulo
        </button>
        <button type="button" id="btnVotar" className="btn btn-success">
          Votar
        </button>

      </div><div id="divForaHorario">

          <h1>Votação fora do horário!</h1>

        </div>

        <div className="modal fade" id="modalConfirmacaoVoto" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
              </div>
              <div className="modal-body">
                <br />
                <h2>Obrigado pela sua participação!</h2>
                <br />
                A apuração dos votos ocorrerá em <span id='txtDataApuracao'></span>, o resultado da votação será informado via portal
                de comunicação do RH e/ou informes fixados nos murais da empresa.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" id='btnOkMsgVotoSucesso' data-dismiss="modal">OK</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalVotar" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
              </div>
              <div className="modal-body">
                <br />
                Confirmo que meu nome é <b><span id="lblEleitor1"></span></b>.<br />
                E meu voto vai para <b><span id="lblCandidato"></span></b>.
                <br /><br />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" className="btn btn-primary" id='btnConfirmarVoto' data-dismiss="modal">Votar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalVotarBranco" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
              </div>
              <div className="modal-body">
                <br />
                Confirmo que meu nome é <b><span id="lblEleitor2"></span></b>.<br />
                E meu voto é <b><span>em branco</span></b>.
                <br /><br />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" className="btn btn-primary" id='btnConfirmarVotoEmBranco' data-dismiss="modal" >Votar em branco</button>
              </div>
            </div>
          </div>
        </div>


        <div className="modal fade" id="modalVotarNulo" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
              </div>
              <div className="modal-body">
                <br />
                Confirmo que meu nome é <b><span id="lblEleitor3"></span></b>.<br />
                E meu voto é <b><span>nulo</span></b>.
                <br /><br />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" id='btnConfirmarVotarNulo' className="btn btn-primary" data-dismiss="modal" >Anular voto</button>
              </div>
            </div>
          </div>
        </div>


        <div className="modal fade" id="modalvalidaEleitor" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
              </div>
              <div className="modal-body">
                Nome não encontrado! Preencha corretamente seu nome.
              </div>
              <div className="modal-footer">
                <button type="button" id='btnValidaEleitor' className="btn btn-primary" data-dismiss="modal" >Ok</button>
              </div>
            </div>
          </div>
        </div>


        <div className="modal fade" id="modalvalidaSeJaVotou" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
              </div>
              <div className="modal-body">
                Você já votou! Caso você ache que esteja incorreto, favor entrar em contato com <b><span id='txtEmailContato'></span></b> ou no telefone <b><span id='txtTelContato'></span></b> (WhatsApp)!
              </div>
              <div className="modal-footer">
                <button type="button" id='btnValidaSeVotou' className="btn btn-primary" data-dismiss="modal">Ok</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="modalvalidaCandidado" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirmação</h5>
              </div>
              <div className="modal-body">
                Escolha seu candidato.
              </div>
              <div className="modal-footer">
                <button type="button" id='btnValidaCandidato' className="btn btn-primary" data-dismiss="modal" >Ok</button>
              </div>
            </div>
          </div>
        </div>







      </>



    );
  }

  private verificaConfiguracoes() {

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('ConfiguracaoGeral')/items?$select=ID,Title,Valor&$filter= Title eq 'AnoVotacao'`,
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
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('ConfiguracaoGeral')/items?$select=ID,Title,Valor&$filter= Title eq 'DataApuracao'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var dataApuracao = resultData.d.results[i].Valor;
            jQuery("#txtDataApuracao").html(dataApuracao);
            console.log("dataApuracao",dataApuracao);

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
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('ConfiguracaoGeral')/items?$select=ID,Title,Valor&$filter= Title eq 'EmailContato'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var emailContato = resultData.d.results[i].Valor;
            jQuery("#txtEmailContato").html(emailContato);
            console.log("emailContato", emailContato);

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
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('ConfiguracaoGeral')/items?$select=ID,Title,Valor&$filter= Title eq 'TelContato'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var telContato = resultData.d.results[i].Valor;
            jQuery("#txtTelContato").html(telContato);
            console.log("telContato", telContato);

          }

        } else {
          alert("Ano de votação não configurado. Contate o adminstrador!");
          return false;
        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });


  }

  private verificaHorario() {

    console.log("_hrDataInicio", _hrDataInicio);
    console.log("_hrDataFim", _hrDataFim);

    if (_today >= _hrDataInicio && _today <= _hrDataFim) {
      var foraIntervalo = false;
    } else var foraIntervalo = true;

    if (foraIntervalo) {
      jQuery("#conteudoVotacao").hide();
      jQuery("#divForaHorario").show();
      console.log("Fora do intervalo");
    }
    else {
      jQuery("#conteudoVotacao").show();
      jQuery("#divForaHorario").hide();

      console.log("Dentro do intervalo");
      this.getCandidatos();
      //this.montarVotacao();
    }

  }


  private redirecionarPaginaVoto() {
    window.location.href = 'votar.aspx';
    //window.location.replace("votar.aspx");
  }

  private redirecionar() {
    window.location.href = 'home.aspx';
    //window.location.replace("votar.aspx");
  }

  private getCandidatos() {

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Candidatos')/items?$select=ID,Title,Setor,Foto`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        var montaCombo = "";

        if (resultData.d.results.length > 0) {

          for (var i = 0; i < resultData.d.results.length; i++) {

            var dataFim = resultData.d.results[i].Data;

            montaCombo += "<label style='font-weight:normal' class='checkcontainer'><div style='width:600px;'><img alt='' src='" + resultData.d.results[i].Foto + "' width='100px' /><div style='float:right; width:480px'><br><b>" + resultData.d.results[i].Title +
              "</b><br>" + resultData.d.results[i].Setor + "</div></div>" +
              "<input type='radio' name='candidato' value='" + resultData.d.results[i].Title + "' >" +
              "<span class='checkmark'></span>" +
              "</label ></div>";

          }

          jQuery("#divCandidatos").html(montaCombo);

        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });



  }


  private preencheInformacoesConfirmacao(opcao) {

    var candidato;
    var eleitor = _nomeEleitor;

    console.log("eleitor", eleitor);

    jQuery.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Votos')/items?$select=ID,Title&$filter=Eleitor eq '${eleitor}' and V_x00e1_lido eq 1 and Ano eq '${_anoVotacao}'`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {

        if (resultData.d.results.length > 0) {

          jQuery('#modalvalidaSeJaVotou').modal({ backdrop: 'static', keyboard: false });

        } else {

          if (opcao == "Votar") {

            candidato = jQuery('input[name="candidato"]:checked').val();

            if (candidato == undefined) {
              jQuery('#modalvalidaCandidado').modal({ backdrop: 'static', keyboard: false });
              //alert("Favor escolher seu candidado!");
              return false;
            }

            if (eleitor == "") {
              jQuery('#modalvalidaEleitor').modal({ backdrop: 'static', keyboard: false });
              //alert("Favor informar seu nome!");
              return false;
            }

          }

          else if (opcao == "Branco") candidato = "EM BRANCO";
          else if (opcao == "Nulo") candidato = "NULO";

          jQuery("#lblCandidato").html(`${candidato}`);
          jQuery("#lblEleitor1").html(`${eleitor}`);
          jQuery("#lblEleitor2").html(`${eleitor}`);
          jQuery("#lblEleitor3").html(`${eleitor}`);


          if (opcao == "Votar") jQuery("#modalVotar").modal({ backdrop: 'static', keyboard: false });
          else if (opcao == "Branco") jQuery("#modalVotarBranco").modal({ backdrop: 'static', keyboard: false });
          else if (opcao == "Nulo") jQuery("#modalVotarNulo").modal({ backdrop: 'static', keyboard: false });


        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });




  }

  private registrarVoto(opcao) {

    console.log("opcao", opcao);
    var candidato;
    var eleitor = _nomeEleitor;

    if (opcao == "Votar") {
      candidato = $('input[name="candidato"]:checked').val();
    }
    else if (opcao == "Branco") {
      candidato = "Voto em branco";
    }
    else if (opcao == "Nulo") {
      candidato = "Voto nulo";
    }


    _web.lists
      .getByTitle("Votos")
      .items.add({
        Title: candidato,
        Eleitor: eleitor,
        Ano: _anoVotacao
      })
      .then(response => {
        console.log("Gravou...");
        jQuery('#modalConfirmacaoVoto').modal({ backdrop: 'static', keyboard: false });
      });


  }


  private ckConfirmar() {

    if (jQuery('input[id="ckConfirmar"]:checked').val()) {
      jQuery('#btnVotar').prop("disabled", false);
      jQuery('#btnVotarBranco').prop("disabled", false);
      jQuery('#btnVotarNulo').prop("disabled", false);
    } else {
      jQuery('#btnVotar').prop("disabled", true);
      jQuery('#btnVotarBranco').prop("disabled", true);
      jQuery('#btnVotarNulo').prop("disabled", true);
    }

  }


  private onSelectedItem(data: { key: string; name: string }[]) {
    for (const item of data) {
      console.log(`Item text: ${item.name}`);
      _nomeEleitor = item.name;
      console.log(_nomeEleitor);
    }
  }







}
