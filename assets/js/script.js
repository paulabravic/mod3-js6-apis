const input = document.querySelector('.input');
const select = document.querySelector('.select');
const button = document.querySelector('.buscar');
const span = document.querySelector('.resultado');
const canvas = document.querySelector('.grafico');

const url = "https://mindicador.cl/api";

const formatDate= (date)=>{
    const year= date.getFullYear();
    const month= date.getMonth();
    const day= date.getDate();
    return `${day}/${month}/${year}`;
}

let myChart = null;

function renderGrafico(data) {
    console.log(data);
    const config = {
        type: "line",
        data: {
        labels: data.map((elem) => 
                formatDate(new Date(elem.fecha))
            ),
        datasets: [{
        label: "Ultimos 10 días",
        backgroundColor: "red",
        data: data.map((elem) => 
            elem.valor),

            }]
        }
    }

canvas.style.backgroundColor= "white";
if (myChart){
    myChart.destroy();
}

myChart= new Chart(canvas, config);

}

const buscarCotizacion = async (moneda) => {
    try {
        console.log(`Tipo Moneda: ${moneda}`)
        const fetching = await fetch(`${url}/${moneda}`);
        const data = await fetching.json();
        return data;

    } catch (error) {
        console.error(error);
        span.innerHTML= "Ocurrió un Error";
    }
}

button.addEventListener('click', async () => {
    span.innerHTML= `Cargando...`;
    const cantidad = input.value;
    const moneda = select.value;

    const result = await buscarCotizacion(moneda);
    const serie = result.serie;
    console.log(result);

    const lastValue = result.serie[0].valor;
    const data = serie.slice(0, 10).reverse();

    let resultado = 0;

    try {
        resultado = (cantidad / lastValue).toFixed(2);
    } catch (error) {
        resultado = 0;
    }

    span.innerHTML = `Resultado: ${moneda==='dolar'?'$':'€'}${resultado}`;

    renderGrafico(data);
});




