
//This function will show the content was select by user
function showContent(id) {
    document.querySelectorAll(".content-section").forEach(div => {
        div.style.display = "none";
    });
    
    let selectedElement = document.getElementById(id);
    selectedElement.style.display = "flex";
    
    // Reinicia a animação sem remover a classe
    selectedElement.style.animation = "none";
    void selectedElement.offsetWidth; // força o reflow
    selectedElement.style.animation = "";
}

//This Function will make the calculation of materials used to make a wall
function calcWall (){
    
    let wallHeight = document.getElementById("wallHeight").value.trim()
    let wallWidth = document.getElementById("wallWidth").value.trim()
    let wallWindows = document.getElementById("wallWindows").value.trim()
    let wallDoors = document.getElementById("wallDoors").value.trim()
    let brickModel = document.getElementById("brickModel").value.trim()
    let brickAmount = 0
    let totalBricks = 0
    let cementBag = 0
    let slakedLimeBag = 0
    let sand = 0
    
    //Parameters for Wall Plaster
    const cementPerSquareMeterOfWallPlaster = 7 //kg
    const sandPerSquareMeterOfWallPlaster = 0.03 //m3
    const slakedLimePerSquareMeterOfWallPlaster = 2.8 //kg
    const cementBagWeight = 50 //kg
    const slakedLimeBagWeight = 20 //kg

    //Parameters for cement mortar
    const cementMortarPerSquareMeter = 17 //kg
    const cementPerKgOfCementMortar = 0.1 //kg
    const slakedLimeKgOfCementMortar = 0.2 //kg
    const sandPerkgOfCementMortar = 0.000467 //m3

     //Allow to appear the results

    //Validation of all fields
    if(!validFields(["wallHeight", "wallWidth", "wallWindows", "wallDoors"])){
        return false
    }

    for(let i = 0; i < bricks.length; i++){
        let brick = bricks[i]
        if(brickModel === brick.model){
            brickAmount = brick.amount_mt
        }
    }
    
    let area = (parseFloat(wallHeight) * parseFloat(wallWidth)) - (parseFloat(wallWindows) + parseFloat(wallDoors))
    if(area >= 0){
        totalBricks = Math.ceil(area * brickAmount) //Calc for brick amount
        //Calc for Cement
        let kgCementForWallPlaster = cementPerSquareMeterOfWallPlaster * area
        let kgCementForCementMortar = cementPerKgOfCementMortar * (cementMortarPerSquareMeter * area)
        cementBag = Math.ceil((kgCementForCementMortar + kgCementForWallPlaster)/cementBagWeight)

        //Calc for Slaked Lime
        let kgSlakedLimeForWallPlaster = slakedLimePerSquareMeterOfWallPlaster * area
        let kgSlakedLimeForCementMortar = slakedLimeKgOfCementMortar * (cementMortarPerSquareMeter * area)
        slakedLimeBag = Math.ceil((kgSlakedLimeForWallPlaster + kgSlakedLimeForCementMortar)/slakedLimeBagWeight)
        
        //Calc for sant
        let sandRaw = (sandPerSquareMeterOfWallPlaster * area) + ((cementMortarPerSquareMeter * area) * sandPerkgOfCementMortar) //Calc for sand 
        sand = Math.ceil(sandRaw * 100) / 100
    }else{
        showError("A área precisa ser maior que zero")
        return false
    }
    

    document.getElementById("results-container").style.display = "flex"
    let table = document.getElementById("results-table")
    table.innerHTML = ""
//Here the function will create a Tbody with all results of calcs
    let line = document.createElement("tbody")
    line.innerHTML = `
            <tr>
                <td class="result-description"> A área total da parede ou muro:</td>
                <td class="result-number"> ${area.toFixed(2)} m²</td>
            </tr>
            <tr>
                <td class="result-description">O total de lajotas:</td>
                <td class="result-number">${totalBricks}</td>
            </tr>
            <tr>
                <td class="result-description">Sacos de Cimento:</td>
                <td class="result-number">${cementBag}</td>
            </tr>
            <tr>
                <td class="result-description">Sacos de Cal:</td>
                <td class="result-number">${slakedLimeBag}</td>
            </tr>
            <tr>
                <td class="result-description">M³ de areia:</td>
                <td class="result-number">${sand.toFixed(2)} m³</td>
            </tr>
    `
    table.appendChild(line)

}
function calcWires(frameHeight,frameStirrupDistance, totalColumns){
    const wireMetersPerKilo = 104 
    let stirrups = Math.ceil(frameHeight / frameStirrupDistance)
    let wireNodes = stirrups * 4     
    let wireLength = wireNodes * 0.15 //each node has 15 centimeters
    let wireWeight = Math.ceil(wireLength / wireMetersPerKilo) * totalColumns

    return wireWeight
}

function calcStirrupBars(totalColumns,frameWidth,frameLength,frameHeight,frameStirrupDistance){
    //calc for stirrup length
    let frameColumnStirrupLength = 2*(frameWidth + frameLength) + 10
    let frameStirrup = Math.ceil(frameHeight / frameStirrupDistance) * frameColumnStirrupLength * totalColumns
    let frameColumnStirrupBars = Math.ceil(frameStirrup / 1200) //any iron bar has 12 meters

    return frameColumnStirrupBars
}
function calcOfIronBars(frameHeight,totalFrames){
    //calc of iron bars
    let ironBarsTotalLength = frameHeight * 4 //all frames has 4 iron bars
    let totalIronBars = Math.ceil(ironBarsTotalLength/1200)*totalFrames //any iron bar has 12 meters

    return totalIronBars
}

function calcConcrete(volume){
    //parameters of 1m3 of concrete
    let sandConcrete = 0.56 //m3
    let stoneConcrete = 0.84 //m3
    let cementBag = 7
    
    volume = Math.ceil((volume*100))/100
    
    let sand = sandConcrete * volume
    console.log("🔍 Areia calculada:", sand)
    let stone = stoneConcrete * volume
    console.log("🔍 Pedra calculada:", stone)
    let cement = Math.ceil(cementBag * volume)
    
    sand = Math.ceil(sand * 100) / 100
    stone = Math.ceil(stone * 100) / 100
      
    let concrete = {
        concreteVolume: volume.toFixed(2),
        sand: sand.toFixed(2),
        stone: stone.toFixed(2),
        cement: cement
    }
    return concrete
}
function calcFoundation (){
     let frameWidthCm = parseFloat(document.getElementById("frameWidth").value);
    let frameLengthCm = parseFloat(document.getElementById("frameLength").value);
    let frameHeightM = parseFloat(document.getElementById("frameHeight").value);
    let frameStirrupDistanceCm = parseFloat(document.getElementById("frameStirrupDistance").value); // Assumindo CM
    let holeDiameterCm = parseFloat(document.getElementById("holeDiameter").value);
    let holeHeightM = parseFloat(document.getElementById("holeHeight").value);
    let totalHoles = parseFloat(document.getElementById("totalHoles").value);
    
    //Validation of all fields
    if(!validFields(["frameWidth", "frameLength", "frameHeight", "frameStirrupDistance", "holeDiameter","holeHeight","totalHoles"])){
        return false
    }

    let frameHeightCm = frameHeightM * 100
    let holeDiameterM = holeDiameterCm / 100
    
    let frameStirrupBars = calcStirrupBars(totalHoles, frameWidthCm, frameLengthCm, frameHeightCm, frameStirrupDistanceCm);
    let totalIronBars = calcOfIronBars(frameHeightCm, totalHoles);
    let wireWeight = calcWires(frameHeightCm,frameStirrupDistanceCm,totalHoles)
    //calc of concrete
     let volume = Math.PI * Math.pow((holeDiameterM / 2), 2) * holeHeightM * totalHoles;
    let concrete = calcConcrete(volume);
    
    

//Here the function will create a Tbody with all results of calcs
    document.getElementById("results-container").style.display = "flex"
    let table = document.getElementById("results-table")
    table.innerHTML = ""

    let line = document.createElement("tbody")
    line.innerHTML = `
            <tr>
                <td> Barras de ferro necessárias </td>
                <td> ${totalIronBars} un</td>
            </tr>        
            <tr>
                <td> A quantidade de barras de ferro 5.0mm, para os estribos é </td>
                <td> ${frameStirrupBars} un</td>
            </tr>
            <tr>
                <td> Kgs de arame recozido </td>
                <td> ${wireWeight} kg</td>
            </tr>
            <tr>
                <td> Metros cúbicos de concreto </td>
                <td> ${concrete.concreteVolume} m³</td>
            </tr>
            <tr>
                <td colspan="2">
                    Materiais para o concreto
                </td>
            </tr>
            <tr>
                <td> Areia </td>
                <td> ${concrete.sand} m³</td>
            </tr>
            <tr>
                <td> Pedra </td>
                <td> ${concrete.stone} m³</td>
            </tr>
            <tr>
                <td> Sacos de Cimento </td>
                <td> ${concrete.cement} un</td>
            </tr>
            
    `
    table.appendChild(line)
}

function calcColumns() {
    // --- INPUTS ---
    let frameColumnWidth = parseFloat(document.getElementById("frameColumnWidth").value); // CM
    let frameColumnLength = parseFloat(document.getElementById("frameColumnLength").value); // CM
    let frameColumnHeightM = parseFloat(document.getElementById("frameColumnHeight").value); // Metros
    let frameColumnStirrupDistance = parseFloat(document.getElementById("frameColumnStirrupDistance").value); // CM
    let totalColumns = parseFloat(document.getElementById("totalColumns").value);
    
    // Validação
    if (!validFields(["frameColumnWidth", "frameColumnLength", "frameColumnHeight", "frameColumnStirrupDistance", "totalColumns"])) {
        return false;
    }

    let frameColumnHeightCm = frameColumnHeightM * 100; 
    
    let space = 5; //cm
    // to meters
    let widthM = (frameColumnWidth + (space * 2)) / 100;
    let lengthM = (frameColumnLength + (space * 2)) / 100;
    let heightM = frameColumnHeightM; // já está em metros
    
    // --- calcs
    let totalIronBars = calcOfIronBars(frameColumnHeightCm, totalColumns);
    let frameColumnStirrupBars = calcStirrupBars(totalColumns, frameColumnWidth, frameColumnLength, frameColumnHeightCm, frameColumnStirrupDistance);

    let wireWeight = 0;
    if (typeof calcWires === 'function') {
        wireWeight = calcWires(frameColumnHeightCm, frameColumnStirrupDistance, totalColumns);
    }

    // Volume M3
    let volume = widthM * lengthM * heightM * totalColumns;
    let concrete = calcConcrete(volume);

    document.getElementById("results-container").style.display = "flex";
    let table = document.getElementById("results-table");
    table.innerHTML = "";

    let line = document.createElement("tbody");
    line.innerHTML = `
        <tr>
            <td> Barras de ferro necessárias </td>
            <td> ${totalIronBars} un</td>
        </tr> 
        <tr>
            <td> A quantidade de barras de ferro 5.0mm, para os estribos é </td>
            <td> ${frameColumnStirrupBars} un</td>
        </tr> 
        <tr>
            <td> Kgs de arame recozido </td>
            <td> ${wireWeight} kg</td>
        </tr> 
        <tr>
            <td colspan="2">
                    Materiais para o concreto
            </td>
        </tr>
        <tr>
            <td> Areia </td>
            <td> ${concrete.sand} m³</td>
        </tr>
        <tr>
            <td> Pedra </td>
            <td> ${concrete.stone} m³</td>
        </tr>
        <tr>
            <td> Sacos de Cimento </td>
            <td> ${concrete.cement} un</td>
        </tr>
    `;
    table.appendChild(line);
}

//Validation of inserterd fields
function validFields(field){
    let fields = field
    let validation = true
    for(let i = 0; i < fields.length; i++){
        let toValid = document.getElementById(fields[i]).value.trim()
        if(!toValid || toValid === ""){
            showError("Por favor preencha todos os campos")
            validation = false
            clearFields(fields)
            break
        }else if(isNaN(toValid)){
            showError("Por favor digite apenas números")
            validation = false
            clearFields(fields)
            break
        }else if(parseFloat(toValid) < 0){
            showError("Por favor digite apenas números maiores ou iguais a zero")
            validation = false
            clearFields(fields)
            break
        }
    }
   return(validation)
}

//Function for clear all fields
function clearFields(field){
    let fields = field
    for(let i = 0; i < fields.length; i++){
        let toClear = fields[i]
        document.getElementById(toClear).value = ""
    }
}

//Error message functions
function closeErrorContainer(error){
    document.getElementById("error-container").style.display = "none"
}

function showError(error){
    let text = document.getElementById("error-container-text")
    document.getElementById("error-container").style.display = "block"
    
    text.innerHTML = error

    document.getElementById("error-container-button").focus();
}

function hideResults(){
        document.getElementById("results-container").style.display = "none"
}

//Function for calculation of hole infos
function holeCalc(){
    let frameWidth = parseFloat(document.getElementById("frameWidth").value)
    let frameLength = parseFloat(document.getElementById("frameLength").value)
    let frameHeight = parseFloat(document.getElementById("frameHeight").value)

    if(frameWidth >= frameLength){
        let holeDiameter = frameWidth  + 10
        document.getElementById("holeDiameter").value = holeDiameter
    }else{
        let holeDiameter = frameLength + 10
        document.getElementById("holeDiameter").value = holeDiameter
    }

    if(!isNaN(frameHeight)){
        document.getElementById("holeHeight").value = frameHeight
    }
    
}
function menuClassRemover(){
    document.querySelectorAll(".top-menu-links-selected").forEach(a => {
        a.classList.remove("top-menu-links-selected");
    });
}
function selectMenu(id){
    menuClassRemover()
    document.getElementById(id).classList.add("top-menu-links-selected")
}

