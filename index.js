const eqCardTemplate = document.querySelector("[data-EQ-template]")
const eqCardData = document.querySelector("[data-EQ-cards]")
const searchInput = document.querySelector("[data-search]")

let equations = []
let calculations = []
let valid = true
function calc_phys_val(input){
    let to_solve = ""
    sum = 1
    if (input == null){
        valid = false
        return null
    }
    input_parts = input.split(" ")
    console.log(input_parts)
    if (input_parts.length == 1){
        to_solve = input
        if (to_solve.includes("+")){
            sum = 0
            to_solve = to_solve.split("+")
            to_solve.foreach(part=>{
                if(parseFloat(part) != NaN){
                    sum = sum + part
                }
            })
            return sum
        }
        else if (to_solve.includes("-")){
            sum = 0
            to_solve = to_solve.split("-")
            to_solve.foreach(part=>{
                if(parseFloat(part) != NaN){
                    sum = sum - part
                }
            })
            return sum
        }
        else if (to_solve.includes("*")){
            to_solve = to_solve.split("*")
            to_solve.foreach(part=>{
                if(parseFloat(part) != NaN){
                    sum = sum * part
                }
            })
            return sum
        }
        else if (to_solve.includes("/")){
            to_solve = to_solve.split("/")
            if (to_solve[1] == 0){
                valid = false
                return null
            }
            return to_solve[0]/to_solve[1]
        }
        else if (to_solve.includes("^")){
            to_solve = to_solve.split("^")
            return to_solve[0]**to_solve[1]
        }
        else if (parseFloat(input_parts) != NaN){
            return input_parts
        }

    }
    else if ("mass-energy".includes(input.toLowerCase()) || "joules".includes(input.toLowerCase()) || input.toLowerCase().includes("mass-energy") || input.toLowerCase().includes("joules")){
        if(parseFloat(input_parts) == NaN){
            valid = false
            return null
        }
        return ((parseFloat(input_parts)*(299793458)**2).toString() + " J")
    }
    else if ("equation of motion".includes(input.toLowerCase()) ||"force".includes(input.toLowerCase()) || input.toLowerCase().includes("equation of motion") ||input.toLowerCase().includes("force")){
        eqparts = input_parts.split("*")
        if (eqparts.includes(NaN) || eqparts.includes(null) || eqparts.includes("")){
            valid = false
            return null
        }
        return((parseFloat(eqparts[0])*parseFloat(eqparts[1])).toString() + " N")
    }
    else if ("mass-density".includes(input) || input.toLowerCase().includes("mass-density")){
        eqparts = input_parts.split("/")
        if (parseFloat(eqparts[1]) == 0 || parseFloat(eqparts[1]) == NaN){
            valid = false
            return null
        }
        return ((parseFloat(eqparts[0])/parseFloat(eqparts[1])).toString() + " KgM^(-3)")
    }
    else if ("frequency".includes(input) || "Hertz".includes(input) || input.toLowerCase().includes("frequency") || input.toLowerCase().includes("Hertz")){
        if (parseFloat(input_parts) == 0 || input_parts == NaN){
            valid = false
            return null
        }
        return ((1/parseFloat(input_parts)).toString() + " Hz")
    }
    else{
        valid = false
        return null
    }

}

function check_visible(input, card){
    console.log("scanning input")
    visible = false
    searched = false
    if (input.toLowerCase().includes("type") || "type". includes(input.toLowerCase())){
        searched = true
        console.log("scanning type")
        console.log(input.toLowerCase().includes(card.type.toLowerCase()))
        console.log(card.type.toLowerCase().includes(input.toLowerCase()))
        visible = (input.toLowerCase().includes(card.type.toLowerCase()) || card.type.toLowerCase().includes(input.toLowerCase()))
    }
    if (input.toLowerCase().includes("field") || "field". includes(input.toLowerCase())){
        searched = true
        console.log("scanning field")
        console.log(input.toLowerCase().includes(card.field.toLowerCase()))
        console.log(card.field.toLowerCase().includes(input.toLowerCase()))
        visible = (input.toLowerCase().includes(card.field.toLowerCase()) || card.field.toLowerCase().includes(input.toLowerCase()))
    }
    if (input.toLowerCase().includes("unit") || "field". includes(input.toLowerCase())){
        searched = true
        console.log("scanning units")
        console.log(input.toLowerCase().includes(card.units.toLowerCase()))
        console.log(card.units.toLowerCase().includes(input.toLowerCase()))
        visible = (input.toLowerCase().includes(card.units.toLowerCase()) || card.units.toLowerCase().includes(input.toLowerCase()))
    }
    if (!searched){
        console.log("scanning all")
        visible = (input.toLowerCase().includes(card.name.toLowerCase()) || card.name.toLowerCase().includes(input.toLowerCase())) || (input.toLowerCase().includes(card.units.toLowerCase()) || card.units.toLowerCase().includes(input.toLowerCase())) || (input.toLowerCase().includes(card.field.toLowerCase()) || card.field.toLowerCase().includes(input.toLowerCase())) || (input.toLowerCase().includes(card.type.toLowerCase()) || card.type.toLowerCase().includes(input.toLowerCase()))
    }
    return visible
}

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase()
    var isVisible = true
    var splitval = value.split(" ")

    equations.forEach(EQ =>{
        isVisible = check_visible(value, EQ)
        EQ.element.classList.toggle("hide", !isVisible)
        document.getElementById("math-out").innerHTML = 0
        document.getElementById("math-out").style.color = "black"
    })
    if (value == "" || value == null || !(value.includes("+") || value.includes("-") || value.includes("*") || value.includes("/") || value.includes("^") || parseFloat(value) != NaN)){
        calculations.forEach(calc =>{
            calc.element.classList.toggle("hide", true)
        })
    } 
    else if (value.includes("+") || value.includes("-") || value.includes("*") || value.includes("/") || value.includes("^")|| parseFloat(value) != NaN){
        calculations.forEach(calc =>{
            calc.element.classList.toggle("hide", false)
            
        })
        var result;
        valid = true;
        result = calc_phys_val(value)
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