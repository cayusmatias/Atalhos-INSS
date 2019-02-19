/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

(function($){
  $(function(){

    $('.sidenav').sidenav();

  }); // end of document ready
})(jQuery); // end of jQuery name space

//função que chama a calculadora
function mostraCalculadora(){
  $('.sidenav').sidenav('close');
  $('.appbody').hide();
  $('#divCalculadora').show();
  limparData();
}

//função que chama a calculadora
function mostraAtalhos(){
  $('.sidenav').sidenav('close');
  $('.appbody').hide();
  $('#atalhos').show();
  limparData();
}

//função que chama a busca servidor
function buscaServidor(){
  $('.sidenav').sidenav('close');
  $('.appbody').hide();
  $('#busca_servidor').show();
  limparData();
}

// função ajax para buscar servidor e apresentar na div busca_servidor
function ajaxServidor() {
  var data = "[]";
  var nome = '';
  var lotacao = '';
  var nome_cpf = $('#nome_cpf').val();
  if ($.isNumeric(nome_cpf)){
    var tipo_busca = 'cpf';
  }else{
    var tipo_busca = 'nome';
  }
  $.ajax({
    url: 'http://www.transparencia.gov.br/api-de-dados/servidores?' + tipo_busca + '=' + nome_cpf + '&orgaoServidorLotacao=57202&pagina=1',
    type: 'GET',
    dataType: 'json',
    timeout: 300000, //30 second timeout
    beforeSend: function () {
      $('.appbody').hide();
      $('#carregando').show();
    },
    success: function(data, textStatus, xhr) {
      $('#carregando').hide();
      $('#busca_servidor').show();
        if (!! data[0]){
          var resultado = data.length;
          for (i = 0; i < resultado; i++) {
            nome += "<div class='col s12 m6'><div class='card-panel'>" + data[i].fichasCargoEfetivo[0]['nome'] + " <br> " + data[i].fichasCargoEfetivo[0]['uorgExercicio'] + "</div></div>";
            $( '#servidor_encontrado' ).html( nome );
          }
        }else{
          var html_sucesso = "<p style:'text-align: justify;'><i class='fas fa-exclamation-triangle'> Servidor(a) não localizado.</p>";
           M.toast({html: html_sucesso, classes: 'amber darken-3', displayLength:'10000'}); // toast do materialize
        }
      },
    error: function(xhr, textStatus, errorThrown) {
        var html_erro = "<p style:'text-align: justify;'><i class='fas fa-exclamation-triangle'></i> \
                        O servidor de dados não respondeu a requisição, \
                        verifique os dados inseridos e tente novamente.</p>";
        M.toast({html: html_erro, classes: 'red darken-3', displayLength:'10000'});
        $('#carregando').hide();
        $('#busca_servidor').show();
      }
    });
  };

//chama datapicker da calculadora de tempo
$(document).ready(function(){
    $('.datepicker').datepicker({
    i18n: {
      today: 'Hoje',
      cancel: 'Limpar',
      done: 'Ok',
      nextMonth: 'Próximo mês',
      previousMonth: 'Mês anterior',
      weekdaysAbbrev: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      weekdays: ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'],
      monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    },
    format: 'dd/mm/yyyy',
    yearRange: 60
  });
});

function calcularIntervaloData(){
  var data1 = $('#first_date').val();
  var data1 = data1.split('/');
  var data2 = $('#second_date').val();
  var data2 = data2.split('/');
  var dt1 = moment(data1[2]+'-'+data1[1]+'-'+data1[0]);
  var dt2 = moment(data2[2]+'-'+data2[1]+'-'+data2[0]).add(1, 'd');
  var diferenca = moment.preciseDiff(dt2, dt1, true);
  if (diferenca.years > 1) {
    var ano = diferenca.years + ' anos';
  }else if (diferenca.years == 1) {
    var ano = diferenca.years + ' ano';
  }else {
    var ano = ''
  }
  if (diferenca.months > 1) {
    var mes = ' ' + diferenca.months + ' meses';
  }else if (diferenca.months == 1) {
    var mes = ' ' + diferenca.months + ' mês';
  }else {
    var mes = ''
  }
  if (diferenca.days > 1) {
    var dia = ' ' + diferenca.days + ' dias';
  }else if (diferenca.days == 1) {
    var dia = ' ' + diferenca.days + ' dia';
  }else {
    var dia = ''
  }
  $( '#resultadoCalculo' ).text( ano + mes + dia );
}

function limparData(){
  $('#form_data').trigger("reset");
  $('#resultadoCalculo').text('');
}
