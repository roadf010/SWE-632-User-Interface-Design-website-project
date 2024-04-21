const eqCardTemplate = document.querySelector("[data-EQ-template]")
const eqCardData = document.querySelector("[data-EQ-cards]")
const searchInput = document.querySelector("[data-search]")

let equations = []
let calculations = []
let valid = true

function test_for_target(input, target){
    input_parts = input.split(" ")
    console.log(target)
    input_parts.forEach(part=>{
        console.log(part)

        if (part.includes(target) || target.includes(part)){
            return true
        }
    })
    return false
}
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
            to_solve.forEach(part=>{
                if(parseFloat(part) != NaN && part != "" && part != null){
                    sum = sum + parseFloat(part)
                }
            })
            return sum
        }
        else if (to_solve.includes("-")){
            isfirst = true
            to_solve = to_solve.split("-")
            to_solve.forEach(part=>{
                if(parseFloat(part) != NaN && part != "" && part != null){
                    if (isfirst){
                        sum = parseFloat(part)
                        isfirst = false
                    }
                    else{
                    sum = sum - parseFloat(part)
                    }
                }
            })
            return sum
        }
        else if (to_solve.includes("*")){
            to_solve = to_solve.split("*")
            to_solve.forEach(part=>{
                if(parseFloat(part) != NaN && part != "" && part != null){
                    sum = sum * parseFloat(part)
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
            return parseFloat(to_solve[0])/parseFloat(to_solve[1])
        }
        else if (to_solve.includes("^")){
            to_solve = to_solve.split("^")
            return parseFloat(to_solve[0])**parseFloat(to_solve[1])
        }
        else if (parseFloat(input_parts) != NaN){
            return parseFloat(input_parts)
        }

    }
    else if ("mass energy".includes(input.toLowerCase()) || "joules".includes(input.toLowerCase()) || input.toLowerCase().includes("mass energy") || input.toLowerCase().includes("joules")){
        if (input_parts.length == 2 || input_parts.length == 3){
            eqparts = [input_parts[input_parts.length-1]]
            if(parseFloat(eqparts[0]) == NaN){
                valid = false
                return null
            }
            return ((parseFloat(eqparts[0])*(299793458)**2).toString() + " J")
        }
    }
    else if ("motion".includes(input.toLowerCase()) || input.toLowerCase().includes("motion")  || "equation of motion".includes(input.toLowerCase()) || "force".includes(input.toLowerCase()) || input.toLowerCase().includes("equation of motion") || input.toLowerCase().includes("force")){
        if (input_parts.length == 3 || input_parts.length == 4){
            eqparts = [input_parts[input_parts.length-2],input_parts[input_parts.length-1]]
            if (eqparts.includes(NaN) || eqparts.includes(null) || eqparts.includes("")){
                valid = false
                return null
            }
            return((parseFloat(eqparts[0])*parseFloat(eqparts[1])).toString() + " N")
        }
    }
    else if ("mass density".includes(input.toLowerCase()) || input.toLowerCase().includes("mass density") || "density".includes(input.toLowerCase()) || input.toLowerCase().includes("density")){
        if (input_parts.length == 3 || input_parts.length == 4){
            eqparts = [input_parts[input_parts.length-2],input_parts[input_parts.length-1]]
            if (parseFloat(eqparts[1]) == 0 || parseFloat(eqparts[1]) == NaN){
                valid = false
                return null
            }
            return ((parseFloat(eqparts[0])/parseFloat(eqparts[1])).toString() + " KgM^(-3)")
        }
    }
    else if ("frequency".includes(input.toLowerCase()) || "Hertz".includes(input.toLowerCase()) || input.toLowerCase().includes("frequency") || input.toLowerCase().includes("Hertz")){
        if (input_parts.length == 2){
            eqparts = [input_parts[input_parts.length-1]]
            if (parseFloat(eqparts[0]) == 0 || eqparts[0] == NaN){
                valid = false
                return null
            }
            return ((1/parseFloat(eqparts[0])).toString() + " Hz")
        }
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
    if (test_for_target(input.toLowerCase(), "type")){
        searched = true
        console.log("scanning type")
        visible = test_for_target(input.toLowerCase(), card.type.toLowerCase())
    }
    if (test_for_target(input.toLowerCase(), "field")){
        searched = true
        visible = test_for_target(input.toLowerCase(), card.field.toLowerCase())
    }
    if (test_for_target(input.toLowerCase(), "units")){
        searched = true
        console.log("scanning units")
        visible = test_for_target(input.toLowerCase(), card.units.toLowerCase())
    }
    if (test_for_target(input.toLowerCase(), "result")){
        searched = true
        console.log("scanning result")
        visible = test_for_target(input.toLowerCase(), card.results.toLowerCase())
    }
    if (!searched){
        console.log("scanning all")
        visible = (input.toLowerCase().includes(card.results.toLowerCase()) || card.results.toLowerCase().includes(input.toLowerCase())) || (input.toLowerCase().includes(card.name.toLowerCase()) || card.name.toLowerCase().includes(input.toLowerCase())) || (input.toLowerCase().includes(card.units.toLowerCase()) || card.units.toLowerCase().includes(input.toLowerCase())) || (input.toLowerCase().includes(card.field.toLowerCase()) || card.field.toLowerCase().includes(input.toLowerCase())) || (input.toLowerCase().includes(card.type.toLowerCase()) || card.type.toLowerCase().includes(input.toLowerCase()))
    }
    return visible
}

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase()
    var isVisible = true
    var matches = value.match(/\d+/g)
    equations.forEach(EQ =>{
        isVisible = check_visible(value, EQ)
        EQ.element.classList.toggle("hide", !isVisible)
        document.getElementById("math-out").innerHTML = 0
        document.getElementById("math-out").style.color = "black"
    })
    var allCards = document.querySelectorAll(".card")
    var allCardunits = document.querySelectorAll(".units")
    var allCardimgs = document.querySelectorAll(".image")
    var allCardheads = document.querySelectorAll(".card.header")
    if (value == "" || value == null || !(value.includes("+") || value.includes("-") || value.includes("*") || value.includes("/") || value.includes("^") || matches != null)){
        calculations.forEach(calc =>{
            calc.element.classList.toggle("hide", true)
        })
        allCards.forEach(card =>{
            card.style.backgroundColor = "rgb(63, 252, 46)"
        })
        allCardunits.forEach(unit =>{
            unit.style.backgroundColor = "rgb(63, 252, 46)"
        })
        allCardimgs.forEach(img =>{
            img.style.backgroundColor = "rgb(63, 252, 46)"
        })
        allCardheads.forEach(head =>{
            head.style.backgroundColor = "rgb(63, 252, 46)"
        })
    } 
    else if (value.includes("+") || value.includes("-") || value.includes("*") || value.includes("/") || value.includes("^") || matches != null){
        console.log("performing calculation")
        calculations.forEach(calc =>{
            calc.element.classList.toggle("hide", false)
        })
        allCards.forEach(card =>{
            card.style.backgroundColor = "rgb(46, 252, 218)"
        })
        allCardunits.forEach(unit =>{
            unit.style.backgroundColor = "rgb(46, 252, 218)"
        })
        allCardimgs.forEach(img =>{
            img.style.backgroundColor = "rgb(46, 252, 218)"
        })
        allCardheads.forEach(head =>{
            head.style.backgroundColor = "rgb(46, 252, 218)"
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
            document.getElementById("math-out").style.color = "rgb(94, 252, 46)"
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
        return{ name : element.name, units: element.units, field: element.field, results: element.result, type: element.type, element: card}
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