fetch("data/municipios.json")
.then(res => res.json())
.then(data => {

    const select = document.getElementById("municipioSelect");

    data.forEach(m => {
        const option = document.createElement("option");
        option.value = m.score;
        option.text = m.municipio;
        select.appendChild(option);
    });

    select.addEventListener("change", () => {
        const score = select.value;

        document.getElementById("scoreValue").innerText = score;

        let nivel = "";

        if(score > 75) nivel = "High Risk";
        else if(score > 50) nivel = "Medium Risk";
        else nivel = "Low Risk";

        document.getElementById("riskLevel").innerText = nivel;
    });

});