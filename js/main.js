addLayer("main", {
  name: "Layer - 1", // This is optional, only used in a few places, If absent it just uses the layer id.
  rawText() {
    let state = []
    let per = tmp.main.calculatePercentageFromLog10
    if (per > 100) {
      state = `+`
    }
    return `
      <p>L-1
      <p class='cBreak' style='font-size:14px'>${format(tmp.main.calculatePercentageFromLog10)}%<sup>${state}</sup></p>
      <p class='cBreak' style='font-size:8px'>${format(player.main.units)} Units</p>
      <p class='cBreak' style='font-size:6px'>^1.000 Units</p>
      </p>`
  },
  position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
  startData() {
    return {
      unlocked: true,
      points: new Decimal(0),
      units: new Decimal(0),

      n1: new Decimal(0),
      n2: new Decimal(0),
      n3: new Decimal(0),
      n4: new Decimal(0),
      n5: new Decimal(0),
      n6: new Decimal(0),
      n7: new Decimal(0),
      n8: new Decimal(0),
      n9: new Decimal(0),
      n10: new Decimal(0),
      n11: new Decimal(0),
    }
  },
  color: "#ffffff",
  requires: new Decimal(10), // Can be a function that takes requirement increases into account
  resource: "prestige points", // Name of prestige currency
  baseResource: "points", // Name of resource prestige is based on
  baseAmount() { return player.points }, // Get the current amount of baseResource
  type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
  exponent: 0.5, // Prestige currency exponent
  gainMult() { // Calculate the multiplier for main currency from bonuses
    mult = new Decimal(1)
    return mult
  },
  gainExp() { // Calculate the exponent on main currency from bonuses
    return new Decimal(1)
  },
  gainUnits() {
    let Base = buyableEffect("main", "N1")
    Base = Base.mul(tmp.b.boosterCalc)
    Base = Base.mul(upgradeEffect("b", 11))
    Base = Base.mul(upgradeEffect("b", 21))
    
    Base = Base.mul(hasMilestone("c", "ComputerIII") ? 10 : 1)
    Base = Base.mul(hasMilestone("c", "ComputerIV") ? 1000 : 1)
    
    Base = Base.mul(hasMilestone("c", "ComputerVIII") ? tmp.c.computerBoost : 1)
    return Base
  },
  
  calculatePercentageFromLog10() {
    var Currency = player.main.units
    Currency = Currency.add(1)

    const MaxiumValue = Decimal.log("1.78e308", 10);

    var Counter = Decimal.log(Currency, 10);
    var NValue = Decimal.div(Counter, MaxiumValue);
    var Percentage = Decimal.mul(NValue, 100);

    if (Percentage.gte(100)) {
      Counter = Decimal.log(Decimal.log(Currency, 10).add(1), 10).add(1);
      NValue = Decimal.div(Counter, MaxiumValue).add(1);
      Percentage = Decimal.mul(NValue, 100);
    }
    return Percentage;
  },

  update(delta) {
    player.main.units = player.main.units.add((tmp.main.gainUnits).times(delta))
    player.main.n1 = player.main.n1.add(buyableEffect("main", "N2").times(delta))
    player.main.n2 = player.main.n2.add(buyableEffect("main", "N3").times(delta))
    player.main.n3 = player.main.n3.add(buyableEffect("main", "N4").times(delta))
    player.main.n4 = player.main.n4.add(buyableEffect("main", "N5").times(delta))
    player.main.n5 = player.main.n5.add(buyableEffect("main", "N6").times(delta))
    
    
    if (hasMilestone("c", "ComputerII")) buyBuyable(this.layer, "N1")
    if (hasMilestone("c", "ComputerIII")) buyBuyable(this.layer, "N2")
    if (hasMilestone("c", "ComputerIV")) buyBuyable(this.layer, "N3")
    if (hasMilestone("c", "ComputerV")) buyBuyable(this.layer, "N4")
    if (hasMilestone("c", "ComputerVII")) buyBuyable(this.layer, "N5")
   
  },
    buyables: {
    "TickspeedI": {
      cost(x) {
          let PowerI = new Decimal(10)
          let Calculation = new Decimal(1000).mul(Decimal.pow(PowerI, x.pow(1)))
          return Calculation;
        },
        buy() {
          let Base = new Decimal(1000)
          let Growth = 10
          let Currency = player.main.units
          let Max = Decimal.affordGeometricSeries(Currency, Base, Growth, getBuyableAmount(this.layer, this.id))
          let Cost = Decimal.sumGeometricSeries(Max, Base, Growth, getBuyableAmount(this.layer, this.id))
          setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(Max))
        },
      display() {
        return `<b style="font-size:16px; text-shadow: 0px 0px 4px #000000">Tickspeed Mark I</b><br>
              <b style="font-size:11px; text-shadow: 0px 0px 4px #000000">Amount: ${format(player[this.layer].buyables[this.id], 0)}</b>
              <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">x${format(tmp[this.layer].buyables[this.id].effect)} Game Tick Rate</b>
          <h1>${format(tmp[this.layer].buyables[this.id].cost)} Units</h1>`
      },
      canAfford() {
        return player[this.layer].units.gte(this.cost())
      },
      style() {
        if (tmp[this.layer].buyables[this.id].canAfford)
          return {
            "background": "linear-gradient(0deg, rgba(229,232,230,1) 0%, rgba(128,131,131,1) 100%)",
            "width": "auto",
            "height": "auto",
            "border-radius": "10px",
            "border": "0px",
            "margin": "5px",
            "text-shadow": "0px 0px 5px #000000",
            "color": "#ffffff"
          }
        return {
          "background-image": "url('images/STECT.png')",
          "background-size": "110% !important",
          "width": "auto",
          "height": " auto",
          "border-radius": "10px",
          "border": "0px",
          "margin": "5px",
          "text-shadow": "0px 0px 10px #000000",
          "color": "#ffffff"
        }
      },
      effect(x) {
        let PowerI = new Decimal(1.1)
        PowerI = PowerI.add(hasMilestone("main", "ComputerIII") ? 0.02 : 0)
        PowerI = PowerI.add(hasMilestone("main", "ComputerIV") ? 0.02 : 0)
        PowerI = PowerI.add(hasMilestone("main", "ComputerVI") ? 0.02 : 0)
        PowerI = PowerI.add(hasMilestone("main", "ComputerVII") ? 0.03 : 0)
        let Calculation = new Decimal(1).mul(Decimal.pow(PowerI, x.pow(1)))
        Calculation = Calculation.pow(buyableEffect("main", "TickspeedII"))
        return Calculation
      },
      unlocked() {
        return hasMilestone("main", "ComputerII")
      }
    },
    "TickspeedII": {
      cost(x) {
        let PowerI = new Decimal(1000)
        let Calculation = new Decimal(1e15).mul(Decimal.pow(PowerI, x.pow(1)))
        return Calculation;
      },
      display() {
        return `<b style="font-size:16px; text-shadow: 0px 0px 4px #000000">Tickspeed Mark II</b><br>
              <b style="font-size:11px; text-shadow: 0px 0px 4px #000000">Amount: ${format(player[this.layer].buyables[this.id], 0)}</b>
              <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">^${format(tmp[this.layer].buyables[this.id].effect)} Tickspeed I effect</b>
          <h1>${format(tmp[this.layer].buyables[this.id].cost)} Units</h1>`
      },
      canAfford() {
        return player[this.layer].units.gte(this.cost())
      },
      style() {
        if (tmp[this.layer].buyables[this.id].canAfford)
          return {
            "background": "linear-gradient(0deg, rgba(66,135,245,1) 0%, rgba(0,255,255,1) 100%)",
            "width": "auto",
            "height": "auto",
            "border-radius": "10px",
            "border": "0px",
            "margin": "5px",
            "text-shadow": "0px 0px 5px #000000",
            "color": "#ffffff"
          }
        return {
          "background-image": "url('images/STECT.png')",
          "background-size": "110% !important",
          "width": "auto",
          "height": " auto",
          "border-radius": "10px",
          "border": "0px",
          "margin": "5px",
          "text-shadow": "0px 0px 10px #000000",
          "color": "#ffffff"
        }
      },
      buy() {
        player[this.layer].units = player[this.layer].units.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
      },
      effect(x) {
        let PowerI = new Decimal(1.0025)
        let Calculation = new Decimal(1).mul(Decimal.pow(PowerI, x.pow(1)))
        return Calculation
      },
      unlocked() {
        return hasMilestone("main", "ComputerII") && hasMilestone("b", "BoosterI")
      }
    },

    "N1": {
      cost(x) {
        let PowerI = new Decimal(1.25).add(Decimal.pow(getBuyableAmount(this.layer, this.id).add(1)), 0.5).sub(1)
        let Calculation = new Decimal(10).mul(Decimal.pow(PowerI, x.pow(1)))
        return Calculation;
      },
      buy() {
        let Base = new Decimal(10)
        let Growth = new Decimal(1.25).add(Decimal.pow(getBuyableAmount(this.layer, this.id).add(1)), 0.5).sub(1)
        let Currency = player.main.units
        let Max = Decimal.affordGeometricSeries(Currency, Base, Growth, getBuyableAmount(this.layer, this.id))
        let Cost = Decimal.sumGeometricSeries(Max, Base, Growth, getBuyableAmount(this.layer, this.id))
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(Max))
        player.main.n1 = player.main.n1.add(Max)
      },
      display() {
       var S = tmp[this.layer].buyables[this.id]
       var SV = player[this.layer].buyables[this.id]
        return `
        <div class="MainText">
        <div class="StarRank">${starFormat(SV, 25, 5, 25)}</div>
        <p class="TitleText">Node Mark I</p>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">${format(player.main.n1)} (${format(SV, 0)})</b>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">x${format(S.bonusEffect)} :  ${format(S.starEffect)}x </b>
        <b style="font-size:18px; text-shadow: 0px 0px 4px #000000">+${format(S.effect)} Units / sec</b><br>
    ${format(S.cost)} Units
    </div>`
      },
      canAfford() {
        return player[this.layer].units.gte(this.cost())
      },
      style() {
        if (tmp[this.layer].buyables[this.id].canAfford)
          return {
            "background": "linear-gradient(0deg, rgba(229,232,230,1) 0%, rgba(128,131,131,1) 100%)",
            "width": "430px",
            "height": "130px",
            "border-radius": "10px",
            "border": "0px",
            "margin": "5px",
            "text-shadow": "0px 0px 5px #000000",
            "color": "#ffffff"
          }
        return {
          "background-image": "url('images/STECT.png')",
          "background-size": "110% !important",
          "width": "430px",
          "height": "130px",
          "border-radius": "10px",
          "border": "0px",
          "margin": "5px",
          "text-shadow": "0px 0px 10px #000000",
          "color": "#ffffff"
        }
      },
      starEffect() {
       let Base = new Decimal(1)
       let Amount = player.main.buyables[this.id]
  
        Base = Base.add(hasUpgrade("b", "13") ? Amount.div(100) : 1)
        Base = Base.div(100).add(1)
       
       return Base
      },
      bonusEffect() {
        let Base = new Decimal(1)
        let BasePower = new Decimal(2)
        BasePower = BasePower.mul(tmp[this.layer].buyables[this.id].starEffect)
        let Amount = player.main.buyables[this.id]
        
        let Magnitude = new Decimal.pow(BasePower, Amount.div(10).floor())
        Base = Base.mul(Magnitude)
        return Base
      },
      effect(x) {
        let PowerI = player.main.n1


        let Effect = new Decimal(0).add(Decimal.add(PowerI))
        Effect = Effect.add(1)
        Effect = Effect.mul(tmp[this.layer].buyables[this.id].bonusEffect)
        return Effect;
      },
      unlocked() {
        return true
      }
    },
    "N2": {
      cost(x) {
        let PowerI = new Decimal(1.5).add(Decimal.pow(getBuyableAmount(this.layer, this.id).add(1)), 0.5).sub(1)
        let Calculation = new Decimal(1000).mul(Decimal.pow(PowerI, x.pow(1)))
        return Calculation;
      },
      buy() {
        let Base = new Decimal(1000)
        let Growth = new Decimal(1.5).add(Decimal.pow(getBuyableAmount(this.layer, this.id).add(1)), 0.5).sub(1)
        let Currency = player.main.units
        let Max = Decimal.affordGeometricSeries(Currency, Base, Growth, getBuyableAmount(this.layer, this.id))
        let Cost = Decimal.sumGeometricSeries(Max, Base, Growth, getBuyableAmount(this.layer, this.id))
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(Max))
        player.main.n2 = player.main.n2.add(Max)
      },
      display() {
       var S = tmp[this.layer].buyables[this.id]
       var SV = player[this.layer].buyables[this.id]
        return `
        <div class="MainText">
        <div class="StarRank">${starFormat(SV, 25, 5, 25)}</div>
        <p class="TitleText">Node Mark II</p>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">${format(player.main.n2)} (${format(SV, 0)})</b>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">x${format(S.bonusEffect)} :  ${format(S.starEffect)}x </b>
        <b style="font-size:18px; text-shadow: 0px 0px 4px #000000">+${format(S.effect)} Node Mark I / sec</b><br>
    ${format(S.cost)} Units
    </div>`
      },
      canAfford() {
        return player[this.layer].units.gte(this.cost())
      },
      style() {
        if (tmp[this.layer].buyables[this.id].canAfford)
          return {
            "background": "linear-gradient(0deg, rgba(229,232,230,1) 0%, rgba(128,131,131,1) 100%)",
            "width": "430px",
            "height": "130px",
            "border-radius": "10px",
            "border": "0px",
            "margin": "5px",
            "text-shadow": "0px 0px 5px #000000",
            "color": "#ffffff"
          }
        return {
          "background-image": "url('images/STECT.png')",
          "background-size": "110% !important",
          "width": "430px",
          "height": "130px",
          "border-radius": "10px",
          "border": "0px",
          "margin": "5px",
          "text-shadow": "0px 0px 10px #000000",
          "color": "#ffffff"
        }
      },
      starEffect() {
       let Base = new Decimal(1)
       let Amount = player.main.buyables[this.id]
  
        Base = Base.add(hasUpgrade("b", "13") ? Amount.div(100) : 1)
        Base = Base.div(100).add(1)
       
       return Base
      },
      bonusEffect() {
        let Base = new Decimal(1)
        let BasePower = new Decimal(2)
        BasePower = BasePower.mul(tmp[this.layer].buyables[this.id].starEffect)
        let Amount = player.main.buyables[this.id]
        
        let Magnitude = new Decimal.pow(BasePower, Amount.div(10).floor())
        Base = Base.mul(Magnitude)
        return Base
      },
      effect(x) {
        let PowerI = player.main.n2


        let Effect = new Decimal(0).add(Decimal.add(PowerI))
        Effect = Effect.mul(tmp[this.layer].buyables[this.id].bonusEffect)
        return Effect;
      },
      unlocked() {
        return hasMilestone("c", "ComputerI")
      }
    },
    "N3": {
      cost(x) {
        let PowerI = new Decimal(2).add(Decimal.pow(getBuyableAmount(this.layer, this.id).add(1)), 0.5).sub(1)
        let Calculation = new Decimal(1e6).mul(Decimal.pow(PowerI, x.pow(1)))
        return Calculation;
      },
      buy() {
        let Base = new Decimal(1e6)
        let Growth = new Decimal(2).add(Decimal.pow(getBuyableAmount(this.layer, this.id).add(1)), 0.5).sub(1)
        let Currency = player.main.units
        let Max = Decimal.affordGeometricSeries(Currency, Base, Growth, getBuyableAmount(this.layer, this.id))
        let Cost = Decimal.sumGeometricSeries(Max, Base, Growth, getBuyableAmount(this.layer, this.id))
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(Max))
        player.main.n3 = player.main.n3.add(Max)
      },
      display() {
       var S = tmp[this.layer].buyables[this.id]
       var SV = player[this.layer].buyables[this.id]
        return `
        <div class="MainText">
        <div class="StarRank">${starFormat(SV, 25, 5, 25)}</div>
        <p class="TitleText">Node Mark III</p>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">${format(player.main.n3)} (${format(SV, 0)})</b>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">x${format(S.bonusEffect)} :  ${format(S.starEffect)}x </b>
        <b style="font-size:18px; text-shadow: 0px 0px 4px #000000">+${format(S.effect)} Node Mark II / sec</b><br>
    ${format(S.cost)} Units
    </div>`
      },
      canAfford() {
        return player[this.layer].units.gte(this.cost())
      },
      style() {
        if (tmp[this.layer].buyables[this.id].canAfford)
          return {
            "background": "linear-gradient(0deg, rgba(229,232,230,1) 0%, rgba(128,131,131,1) 100%)",
            "width": "430px",
            "height": "130px",
            "border-radius": "10px",
            "border": "0px",
            "margin": "5px",
            "text-shadow": "0px 0px 5px #000000",
            "color": "#ffffff"
          }
        return {
          "background-image": "url('images/STECT.png')",
          "background-size": "110% !important",
          "width": "430px",
          "height": "130px",
          "border-radius": "10px",
          "border": "0px",
          "margin": "5px",
          "text-shadow": "0px 0px 10px #000000",
          "color": "#ffffff"
        }
      },
      starEffect() {
       let Base = new Decimal(1)
       let Amount = player.main.buyables[this.id]
  
        Base = Base.add(hasUpgrade("b", "13") ? Amount.div(100) : 1)
        Base = Base.div(100).add(1)
       
       return Base
      },
      bonusEffect() {
        let Base = new Decimal(1)
        let BasePower = new Decimal(2)
        BasePower = BasePower.mul(tmp[this.layer].buyables[this.id].starEffect)
        let Amount = player.main.buyables[this.id]
        
        let Magnitude = new Decimal.pow(BasePower, Amount.div(10).floor())
        Base = Base.mul(Magnitude)
        return Base
      },
      effect(x) {
        let PowerI = player.main.n3


        let Effect = new Decimal(0).add(Decimal.add(PowerI))
        Effect = Effect.mul(tmp[this.layer].buyables[this.id].bonusEffect)
        return Effect;
      },
      unlocked() {
        return hasMilestone("c", "ComputerII")
      }
    },
    "N4": {
      cost(x) {
        let PowerI = new Decimal(4).add(Decimal.pow(getBuyableAmount(this.layer, this.id).add(1)), 0.5).sub(1)
        let Calculation = new Decimal(1e12).mul(Decimal.pow(PowerI, x.pow(1)))
        return Calculation;
      },
      buy() {
        let Base = new Decimal(1e12)
        let Growth = new Decimal(4).add(Decimal.pow(getBuyableAmount(this.layer, this.id).add(1)), 0.5).sub(1)
        let Currency = player.main.units
        let Max = Decimal.affordGeometricSeries(Currency, Base, Growth, getBuyableAmount(this.layer, this.id))
        let Cost = Decimal.sumGeometricSeries(Max, Base, Growth, getBuyableAmount(this.layer, this.id))
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(Max))
        player.main.n4 = player.main.n4.add(Max)
      },
      display() {
       var S = tmp[this.layer].buyables[this.id]
       var SV = player[this.layer].buyables[this.id]
        return `
        <div class="MainText">
        <div class="StarRank">${starFormat(SV, 25, 5, 25)}</div>
        <p class="TitleText">Node Mark IV</p>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">${format(player.main.n4)} (${format(SV, 0)})</b>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">x${format(S.bonusEffect)} :  ${format(S.starEffect)}x </b>
        <b style="font-size:18px; text-shadow: 0px 0px 4px #000000">+${format(S.effect)} Node Mark III / sec</b><br>
    ${format(S.cost)} Units
    </div>`
      },
      canAfford() {
        return player[this.layer].units.gte(this.cost())
      },
      style() {
        if (tmp[this.layer].buyables[this.id].canAfford)
          return {
            "background": "linear-gradient(0deg, rgba(229,232,230,1) 0%, rgba(128,131,131,1) 100%)",
            "width": "430px",
            "height": "130px",
            "border-radius": "10px",
            "border": "0px",
            "margin": "5px",
            "text-shadow": "0px 0px 5px #000000",
            "color": "#ffffff"
          }
        return {
          "background-image": "url('images/STECT.png')",
          "background-size": "110% !important",
          "width": "430px",
          "height": "130px",
          "border-radius": "10px",
          "border": "0px",
          "margin": "5px",
          "text-shadow": "0px 0px 10px #000000",
          "color": "#ffffff"
        }
      },
      starEffect() {
       let Base = new Decimal(1)
       let Amount = player.main.buyables[this.id]
  
        Base = Base.add(hasUpgrade("b", "13") ? Amount.div(100) : 1)
        Base = Base.div(100).add(1)
       
       return Base
      },
      bonusEffect() {
        let Base = new Decimal(1)
        let BasePower = new Decimal(2)
        BasePower = BasePower.mul(tmp[this.layer].buyables[this.id].starEffect)
        let Amount = player.main.buyables[this.id]
        
        let Magnitude = new Decimal.pow(BasePower, Amount.div(10).floor())
        Base = Base.mul(Magnitude)
        return Base
      },
      effect(x) {
        let PowerI = player.main.n4


        let Effect = new Decimal(0).add(Decimal.add(PowerI))
        Effect = Effect.mul(tmp[this.layer].buyables[this.id].bonusEffect)
        return Effect;
      },
      unlocked() {
        return hasMilestone("c", "ComputerIII")
      }
    },
    "N5": {
      cost(x) {
        let PowerI = new Decimal(8).add(Decimal.pow(getBuyableAmount(this.layer, this.id).add(1)), 0.5).sub(1)
        let Calculation = new Decimal(1e24).mul(Decimal.pow(PowerI, x.pow(1)))
        return Calculation;
      },
      buy() {
        let Base = new Decimal(1e24)
        let Growth = new Decimal(8).add(Decimal.pow(getBuyableAmount(this.layer, this.id).add(1)), 0.5).sub(1)
        let Currency = player.main.units
        let Max = Decimal.affordGeometricSeries(Currency, Base, Growth, getBuyableAmount(this.layer, this.id))
        let Cost = Decimal.sumGeometricSeries(Max, Base, Growth, getBuyableAmount(this.layer, this.id))
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(Max))
        player.main.n5 = player.main.n5.add(Max)
      },
      display() {
       var S = tmp[this.layer].buyables[this.id]
       var SV = player[this.layer].buyables[this.id]
        return `
        <div class="MainText">
        <div class="StarRank">${starFormat(SV, 25, 5, 25)}</div>
        <p class="TitleText">Node Mark V</p>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">${format(player.main.n5)} (${format(SV, 0)})</b>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">x${format(S.bonusEffect)} :  ${format(S.starEffect)}x </b>
        <b style="font-size:18px; text-shadow: 0px 0px 4px #000000">+${format(S.effect)} Node Mark IV / sec</b><br>
    ${format(S.cost)} Units
    </div>`
      },
      canAfford() {
        return player[this.layer].units.gte(this.cost())
      },
      style() {
        if (tmp[this.layer].buyables[this.id].canAfford)
          return {
            "background": "linear-gradient(0deg, rgba(229,232,230,1) 0%, rgba(128,131,131,1) 100%)",
            "width": "430px",
            "height": "130px",
            "border-radius": "10px",
            "border": "0px",
            "margin": "5px",
            "text-shadow": "0px 0px 5px #000000",
            "color": "#ffffff"
          }
        return {
          "background-image": "url('images/STECT.png')",
          "background-size": "110% !important",
          "width": "430px",
          "height": "130px",
          "border-radius": "10px",
          "border": "0px",
          "margin": "5px",
          "text-shadow": "0px 0px 10px #000000",
          "color": "#ffffff"
        }
      },
      starEffect() {
       let Base = new Decimal(1)
       let Amount = player.main.buyables[this.id]
  
        Base = Base.add(hasUpgrade("b", "13") ? Amount.div(100) : 1)
        Base = Base.div(100).add(1)
       
       return Base
      },
      bonusEffect() {
        let Base = new Decimal(1)
        let BasePower = new Decimal(2)
        BasePower = BasePower.mul(tmp[this.layer].buyables[this.id].starEffect)
        let Amount = player.main.buyables[this.id]
        
        let Magnitude = new Decimal.pow(BasePower, Amount.div(10).floor())
        Base = Base.mul(Magnitude)
        return Base
      },
      effect(x) {
        let PowerI = player.main.n5


        let Effect = new Decimal(0).add(Decimal.add(PowerI))
        Effect = Effect.mul(tmp[this.layer].buyables[this.id].bonusEffect)
        return Effect;
      },
      unlocked() {
        return hasMilestone("c", "ComputerV")
      }
    },
    "N6": {
      cost(x) {
        let PowerI = new Decimal(16).add(Decimal.pow(getBuyableAmount(this.layer, this.id).add(1)), 0.5).sub(1)
        let Calculation = new Decimal(1e48).mul(Decimal.pow(PowerI, x.pow(1)))
        return Calculation;
      },
      buy() {
        let Base = new Decimal(1e48)
        let Growth = new Decimal(16).add(Decimal.pow(getBuyableAmount(this.layer, this.id).add(1)), 0.5).sub(1)
        let Currency = player.main.units
        let Max = Decimal.affordGeometricSeries(Currency, Base, Growth, getBuyableAmount(this.layer, this.id))
        let Cost = Decimal.sumGeometricSeries(Max, Base, Growth, getBuyableAmount(this.layer, this.id))
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(Max))
        player.main.n6 = player.main.n6.add(Max)
      },
      display() {
       var S = tmp[this.layer].buyables[this.id]
       var SV = player[this.layer].buyables[this.id]
        return `
        <div class="MainText">
        <div class="StarRank">${starFormat(SV, 25, 5, 25)}</div>
        <p class="TitleText">Node Mark VI</p>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">${format(player.main.n6)} (${format(SV, 0)})</b>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">x${format(S.bonusEffect)} :  ${format(S.starEffect)}x </b>
        <b style="font-size:18px; text-shadow: 0px 0px 4px #000000">+${format(S.effect)} Node Mark V / sec</b><br>
    ${format(S.cost)} Units
    </div>`
      },
      canAfford() {
        return player[this.layer].units.gte(this.cost())
      },
      style() {
        if (tmp[this.layer].buyables[this.id].canAfford)
          return {
            "background": "linear-gradient(0deg, rgba(229,232,230,1) 0%, rgba(128,131,131,1) 100%)",
            "width": "430px",
            "height": "130px",
            "border-radius": "10px",
            "border": "0px",
            "margin": "5px",
            "text-shadow": "0px 0px 5px #000000",
            "color": "#ffffff"
          }
        return {
          "background-image": "url('images/STECT.png')",
          "background-size": "110% !important",
          "width": "430px",
          "height": "130px",
          "border-radius": "10px",
          "border": "0px",
          "margin": "5px",
          "text-shadow": "0px 0px 10px #000000",
          "color": "#ffffff"
        }
      },
      starEffect() {
       let Base = new Decimal(1)
       let Amount = player.main.buyables[this.id]
  
        Base = Base.add(hasUpgrade("b", "13") ? Amount.div(100) : 1)
        Base = Base.div(100).add(1)
       
       return Base
      },
      bonusEffect() {
        let Base = new Decimal(1)
        let BasePower = new Decimal(2)
        BasePower = BasePower.mul(tmp[this.layer].buyables[this.id].starEffect)
        let Amount = player.main.buyables[this.id]
        
        let Magnitude = new Decimal.pow(BasePower, Amount.div(10).floor())
        Base = Base.mul(Magnitude)
        return Base
      },
      effect(x) {
        let PowerI = player.main.n6


        let Effect = new Decimal(0).add(Decimal.add(PowerI))
        Effect = Effect.mul(tmp[this.layer].buyables[this.id].bonusEffect)
        return Effect;
      },
      unlocked() {
        return hasMilestone("c", "ComputerVII")
      }
    },




  },
  tabFormat: {
    "Nodes": {
      content: [
      "blank",
      ['raw-html', () => {
          return `<MA style='font-size: 24px'>You have <HI style='font-size: 30px; text-shadow: 0px 0px 20px'>${format(player.main.units)}</HI> Units</MA>`
                }],
      "blank",
      "blank",
      ["row", [["buyable", "N1"]]],
      ["row", [["buyable", "N2"]]],
      ["row", [["buyable", "N3"]]],
      ["row", [["buyable", "N4"]]],
      ["row", [["buyable", "N5"]]],
      ["row", [["buyable", "N6"]]],
      ]
    },
  },
  row: 0, // Row the layer is in on the tree (0 is the first row)
  layerShown() { return true }
})