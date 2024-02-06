const eqCardTemplate = document.querySelector("[data-EQ-template]")
const eqCardData = document.querySelector("[data-EQ-cards]")
const searchInput = document.querySelector("[data-search]")

let equations = []

function calc_phys_val(type, equation){
    if (equation == null){
        return 0
    }
    if ("mass-energy".includes(type)){
        return (parseFloat(equation)*(299793458)**2)
    }
    else if ("motion".includes(type)){
        eqparts = equation.split("*")
        return(parseFloat(eqparts[0])*parseFloat(eqparts[1]))
    }
    else if ("mass-density".includes(type)){
        eqparts = equation.split("/")
        if (parseFloat(eqparts[1]) == 0 || parseFloat(eqparts[1]) == NaN){
            return 0
        }
        return (parseFloat(eqparts[0])/parseFloat(eqparts[1]))
    }
    else{
        return 0
    }

}

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase()
    var isVisible = true
    var splitval = value.split(" ")
    if (splitval.length == 3 && "calculate".includes(splitval[0])){
        var result = calc_phys_val(splitval[1], splitval[2])
        document.getElementById("math-data").write = result
    }
    else{
        equations.forEach(EQ =>{
            if (splitval.length == 1){
                isVisible = EQ.name.toLowerCase().includes(value) || EQ.units.toLowerCase().includes(value) || EQ.type.toLowerCase().includes(value) || EQ.field.toLowerCase().includes(value) || EQ.results.toLowerCase().includes(value)
            }
            else{
                isVisible = false
                console.log("entering loops")
                console.log(splitval.length)
                for (let i = 0; i < splitval.length; i++){
                    if (isVisible == true){
                        console.log("breaking first")
                        break
                    }
                    for (let j = i+1; j < splitval.length; j++){
                        console.log("testing")
                        console.log(splitval[0])
                        console.log(splitval[1])
                        isVisible = (EQ.field.toLowerCase().includes(splitval[0]) && EQ.type.toLowerCase().includes(splitval[1])) || (EQ.type.toLowerCase().includes(splitval[0]) && EQ.field.toLowerCase().includes(splitval[1])) || (EQ.units.toLowerCase().includes(splitval[0]) && EQ.type.toLowerCase().includes(splitval[1])) || (EQ.type.toLowerCase().includes(splitval[0]) && EQ.units.toLowerCase().includes(splitval[1])) || (EQ.field.toLowerCase().includes(splitval[0]) && EQ.units.toLowerCase().includes(splitval[1])) || (EQ.units.toLowerCase().includes(splitval[0]) && EQ.field.toLowerCase().includes(splitval[1])) 
                        if (isVisible == true){
                            console.log("breaking second")
                            break
                        } 
                    }
                }
                console.log("exiting loops")
            }
                EQ.element.classList.toggle("hide", !isVisible)
        })
    }
})
fetch("./EqDat.json").then((res) => res.json()).then(data =>{
    equations = data.map(element => {
        const card = eqCardTemplate.content.cloneNode(true).children[0]
        const header = card.querySelector("[data-header]")
        const image = card.querySelector("[data-image]")
        const units = card.querySelector("[data-units]")
        const body = card.querySelector("[data-body]")
        header.textContent = element.name
        image.textContent = element.image
        units.textContent = "Units: "
        units.textContent += element.units
        body.textContent = element.description
        
        eqCardData.append(card)
        return{ name : element.name, units: element.units, field: element.field, results: element.variables.result, type: element.type, element: card}
    });
});
