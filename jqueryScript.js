$(document).ready(function () {

  let programas = [
    ["Livelo", "Smiles", "TudoAzul"],
    [
      [1200, 3000, 7000, 20000],
      [1000, 2000, 5000, 7000, 10000],
      [1000, 3000, 5000, 10000],
    ],
    [
      [39.9, 99.9, 229.9, 649.9],
      [42, 78, 162, 219, 299],
      [35, 99, 159, 299]
    ]
  ]

  let posicaoPrograma;
  let posicaoPlano;
  let valorBonus;
  let calculaTudo = false;

  $('[data-toggle="popover"]').popover();

  $('.money').mask('000.000.000.000.000,00', {
    reverse: true
  });

  $("#sel1").focus();

  //popula PROGRAMA
  $.each(programas[0], function (i, p) {
    $('#sel1').append($('<option></option>').val(p).html(p));
  });
  //popula PLANO
  $.each(programas[1][0], function (i, p) {
    $('#sel2').append($('<option></option>').val(p).html(p));
  });
  //popula VALORES
  recalculaTudo();

  //quando PROGRAMA é alterado
  $("#sel1").change(function () {
    recalculaTudo();
    $('#sel2').empty();
    $.each(programas[1][posicaoPrograma], function (i, p) {
      $('#sel2').append($('<option></option>').val(p).html(p));
    });
    recalculaTudo();
  });

  //quando PLANO é alterado
  $("#sel2").change(function () {
    recalculaTudo();
  });

  //quando BONUS é checado/deschecado
  $("#bonus1").change(function () {
    if ($("#bonus2").prop("disabled")) {
      $("#bonus2").prop("disabled", false);
      $('#bonus2').empty();
      for (var i = 5; i <= 100; i = i + 5) {
        $("#bonus2").append($('<option></option>').val(i).html(i + " %"));
      }
      $("#bonus2").focus();
    } else {
      $('#bonus2').empty();
      $("#bonus2").prop("disabled", true);
    }
    recalculaTudo();
  });

  //quando BONUS é alterado
  $("#bonus2").change(function () {
    recalculaTudo();
  });

  //quando CALCULAR é clicado
  $("#calcular").click(function () {
    recalculaTudo();
    calculaFinal();
  });

  function recalculaTudo() {
    posicaoPrograma = $("#sel1 option:selected").index();
    posicaoPlano = $("#sel2 option:selected").index();
    valorBonus = $('#bonus2').val();
    if (programas[2][posicaoPrograma][posicaoPlano] == null) {
      posicaoPlano = 3;
    }
    $('#val1').text(numberToReal(programas[2][posicaoPrograma][posicaoPlano]));
    $('#val2').text('(' + numberToReal(programas[2][posicaoPrograma][posicaoPlano] / programas[1][posicaoPrograma][posicaoPlano] * 1000) + ' por 1000 milhas)');
    $('#bonus3').text(numberToReal(programas[2][posicaoPrograma][posicaoPlano] / (programas[1][posicaoPrograma][posicaoPlano] * (1 + (valorBonus / 100))) * 1000) + ' por 1000 milhas');
    if (calculaTudo) {
      calculaFinal();
    }
  }

  function calculaFinal() {
    if ($('#real').val() == "") {
      calculaTudo = false;
      alert('Insira Custo em Dinheiro!');
      $("#real").focus();
    } else if ($('#milha').val() == "") {
      calculaTudo = false;
      alert('Insira Custo em Milhas!');
      $("#milha").focus();
    } else {
      calculaTudo = true;
      var precalc = (programas[2][posicaoPrograma][posicaoPlano] / (programas[1][posicaoPrograma][posicaoPlano] * (1 + (valorBonus / 100))));
      var calculo = precalc * $('#milha').val();
      $("#resultado").val(calculo).text('Valor das milhas convertidas: ' + numberToReal(calculo));
      $("#resultado2").val(calculo).text('Com R$ ' + $('#real').val() + ' daria para comprar ' + (($('#real').cleanVal() / 100) / precalc).toFixed() + ' milhas');
      if ($('#resultado').val() / ($('#real').cleanVal() / 100) > 1) {
        $("#resultado3").text("Vale a pena comprar com DINHEIRO");
      } else {
        $("#resultado3").text("Vale a pena comprar com MILHAS");
      }
      $("#resultado4").text('Relação Milha/Reais: ' + ($('#resultado').val() / ($('#real').cleanVal() / 100)).toFixed(2));
    }
  }

  function numberToReal(numero) {
    var convert = numero.toFixed(2).split('.');
    convert[0] = "R$ " + convert[0].split(/(?=(?:...)*$)/).join('.');
    return convert.join(',');
  }
});