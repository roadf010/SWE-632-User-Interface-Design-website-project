const eqCardTemplate = document.querySelector("[data-EQ-template]")
const eqCardData = document.querySelector("[data-EQ-cards]")
const searchInput = document.querySelector("[data-search]")

let equations = []
let calculations = []
function calc_phys_val(type, equation){
    if (equation == null){
        return 0
    }
    if ("addition".includes(type.toLowerCase())){
        eqparts = equation.split("+")
         sum = 0
        eqparts.forEach(number =>{
            if (number!= NaN){
                sum = sum+parseFloat(number)
            }
        })
        return sum
    }
    else if ("multiplication".includes(type.toLowerCase()) || "multiply".includes(type.toLowerCase())){
        eqparts = equation.split("*")
        sum = 1
        eqparts.forEach(number =>{
            if (number!= NaN){
                sum = sum*parseFloat(number)   
            }
        })
        return sum
    }
    else if ("subtraction".includes(type.toLowerCase())){
        eqparts = equation.split("-")
        sum = eqparts[0]
        for (let i = 1; i < eqparts.length; i++){
            sum = sum-eqparts[i]
        }
        return sum
    } 
    else if ("division".includes(type) || "divide".includes(type)){
        eqparts = equation.split("/")
        if (parseFloat(eqparts[1]) == 0 || parseFloat(eqparts[1]) == NaN){
            return 0
        }
        return (parseFloat(eqparts[0])/parseFloat(eqparts[1]))
    }
    else if ("mass-energy".includes(type.toLowerCase()) || "joules".includes(type.toLowerCase())){
        return (parseFloat(equation)*(299793458)**2)
    }
    else if ("equation of motion".includes(type.toLowerCase()) ||"force".includes(type.toLowerCase())){
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
    else if ("frequency".includes(type) || "Hertz".includes(type)){
        if (parseFloat(equation) == 0 || parseFloat(equation) == NaN){
            return 0
        }
        return (1/parseFloat(equation))
    }
    else{
        return 0
    }

}

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase()
    var isVisible = true
    var splitval = value.split(" ")
    if("calculate".includes(splitval[0])){
        calculations.forEach(calc =>{
            calc.element.classList.toggle("hide", false)
        })
    }
    if (splitval.length == 3 && "calculate".includes(splitval[0])){
        var result = calc_phys_val(splitval[1], splitval[2])
        if (result == NaN){
            result = 0
        }
        document.getElementById("math-out").innerHTML = result
        console.log(result)
    }
    else{
        equations.forEach(EQ =>{
            if (splitval.length == 1){
                isVisible = EQ.name.toLowerCase().includes(value) || EQ.units.toLowerCase().includes(value) || EQ.type.toLowerCase().includes(value) || EQ.field.toLowerCase().includes(value) || EQ.results.toLowerCase().includes(value)
            }
            else{
                isVisible = EQ.name.toLowerCase().includes(value)
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
                document.getElementById("math-out").innerHTML = 0
        })
        calculations.forEach(calc =>{
            calc.element.classList.toggle("hide", true)
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
})
fetch("./calculation_content.json").then((res) => res.json()).then(data =>{
    calculations = data.map(element => {
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
})
calculations.forEach(calc =>{
    calc.element.classList.toggle("hide", true)
})