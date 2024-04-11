const eqCardTemplate = document.querySelector("[data-EQ-template]")
const eqCardData = document.querySelector("[data-EQ-cards]")
const searchInput = document.querySelector("[data-search]")

let equations = []
let calculations = []
let valid = true
function calc_phys_val(type, equation){
    if (equation == null){
        valid = false
        return null
    }
    if ("addition".includes(type.toLowerCase())){
        eqparts = equation.split("+")
        if (eqparts.includes(NaN) || eqparts.includes(null) || eqparts.includes("")){
            valid = false
            return null
        }
        sum = 0
        eqparts.forEach(number =>{
            if (parseFloat(number)!= NaN){
                sum = sum+parseFloat(number)
            }
            else{
                valid = false
                return null
            }
        })
        return sum
    }
    else if ("multiplication".includes(type.toLowerCase()) || "multiply".includes(type.toLowerCase())){
        eqparts = equation.split("*")
        if (eqparts.includes(NaN) || eqparts.includes(null) || eqparts.includes("")){
            valid = false
            return null
        }
        sum = 1
        eqparts.forEach(number =>{
            if (parseFloat(number) != NaN){
                sum = sum*parseFloat(number)   
            }
            else{
                valid = false
                return null
            }
        })
        return sum
    }
    else if ("subtraction".includes(type.toLowerCase())){
        eqparts = equation.split("-")
        if (eqparts.includes(NaN) || eqparts.includes(null) || eqparts.includes("")){
            valid = false
            return null
        }
        sum = eqparts[0]
        var isfirst = true
        eqparts.forEach(number =>{
            if (parseFloat(number)!= NaN){
                if (isfirst){
                    isfirst = false
                }
                else{
                    sum = sum-parseFloat(number)
                }
            }
            else{
                valid = false
                return null
            }
        })
        return sum
    } 
    else if ("division".includes(type) || "divide".includes(type)){
        eqparts = equation.split("/")
        if (parseFloat(eqparts[1]) == 0 || parseFloat(eqparts[1]) == NaN ||  parseFloat(eqparts[0]) == NaN ){
            valid = false
            return null
        }
        return (parseFloat(eqparts[0])/parseFloat(eqparts[1]))
    }
    else if ("mass-energy".includes(type.toLowerCase()) || "joules".includes(type.toLowerCase())){
        if(parseFloat(equation) == NaN){
            valid = false
            return null
        }
        return (parseFloat(equation)*(299793458)**2)
    }
    else if ("equation of motion".includes(type.toLowerCase()) ||"force".includes(type.toLowerCase())){
        eqparts = equation.split("*")
        if (eqparts.includes(NaN) || eqparts.includes(null) || eqparts.includes("")){
            valid = false
            return null
        }
        return(parseFloat(eqparts[0])*parseFloat(eqparts[1]))
    }
    else if ("mass-density".includes(type)){
        eqparts = equation.split("/")
        if (parseFloat(eqparts[1]) == 0 || parseFloat(eqparts[1]) == NaN){
            valid = false
            return null
        }
        return (parseFloat(eqparts[0])/parseFloat(eqparts[1]))
    }
    else if ("frequency".includes(type) || "Hertz".includes(type)){
        if (parseFloat(equation) == 0 || equation == NaN){
            valid = false
            return null
        }
        return (1/parseFloat(equation))
    }
    else{
        valid = false
        return null
    }

}

function check_visible(input, card){
    if (input.toLowerCase().includes("type")){
        return (input.toLowerCase().includes(card.type.toLowerCase()) || card.type.toLowerCase().includes(input.toLowerCase()))
    }
    else if (input.toLowerCase().includes("field")){
        return (input.toLowerCase().includes(card.field.toLowerCase()) || card.field.toLowerCase().includes(input.toLowerCase()))
    }
    else if (input.toLowerCase().includes("units")){
        return (input.toLowerCase().includes(card.units.toLowerCase()) || card.units.toLowerCase().includes(input.toLowerCase()))
    }
    else{
        return (input.toLowerCase().includes(card.units.toLowerCase()) || card.units.toLowerCase().includes(input.toLowerCase())) || (input.toLowerCase().includes(card.field.toLowerCase()) || card.field.toLowerCase().includes(input.toLowerCase())) || (input.toLowerCase().includes(card.type.toLowerCase()) || card.type.toLowerCase().includes(input.toLowerCase()))
    }
}

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase()
    var isVisible = true
    var splitval = value.split(" ")
    if("calculate".includes(value) || "calculate".includes(splitval)){
        calculations.forEach(calc =>{
            calc.element.classList.toggle("hide", false)
        })
    }
    if (splitval.length == 3 && "calculate".includes(splitval[0])){
        var result;
        valid = true;
        result = calc_phys_val(splitval[1], splitval[2])
        if (!valid){
            result = "error"
            document.getElementById("math-out").style.color = "red"
            document.getElementById("math-out").innerHTML = result
        }
        else{
            document.getElementById("math-out").style.color = "green"
            document.getElementById("math-out").innerHTML = result
        }
        console.log(result)
    }
    else{
        equations.forEach(EQ =>{
            isVisible = check_visible(value, EQ)
            EQ.element.classList.toggle("hide", !isVisible)
            document.getElementById("math-out").innerHTML = 0
            document.getElementById("math-out").style.color = "black"
        })
        if (value == "" || value == null){
            calculations.forEach(calc =>{
                calc.element.classList.toggle("hide", true)
            })
        }
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
    calculations.forEach(calc =>{
        calc.element.classList.toggle("hide", true)
    })
});