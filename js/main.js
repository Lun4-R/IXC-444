addLayer("main", {
    name: "Layer - 1", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L-1", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		units: new Decimal(0),
		computer: new Decimal(0),
		
		n1: new Decimal(0),
		n2: new Decimal(0),
		n3: new Decimal(0),
		n4: new Decimal(0),
    }},
    color: "#ffffff",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
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
      return Base
    },
    computerCost() {
      let id = player.main.computer
      let table = ["1e4", "1e8", "1e14", "1e20", "1e30"]
      return table[id]
    },
    computerReset() {
      player.main.buyables["TickspeedI"] = new Decimal(0)
      player.main.buyables["N4"] = new Decimal(0)
      player.main.n4 = new Decimal(0)
      player.main.buyables["N3"] = new Decimal(0)
      player.main.n3 = new Decimal(0)
      player.main.buyables["N2"] = new Decimal(0)
      player.main.n2 = new Decimal(0)
      player.main.buyables["N1"] = new Decimal(0)
      player.main.n1 = new Decimal(0)
      
      player.main.units = new Decimal(0)
    },
    update(delta) {
      player.main.units = player.main.units.add((tmp.main.gainUnits).times(delta))
      
      player.main.n1 = player.main.n1.add((buyableEffect("main", "N2")).times(delta))
      player.main.n2 = player.main.n2.add((buyableEffect("main", "N3")).times(delta))
      player.main.n3 = player.main.n3.add((buyableEffect("main", "N4")).times(delta))
      
    },
    clickables: {
        "Computer Reset": {
          title() {
            return `<b style="font-size:35px">Buy a new Computer</b><br>
            However you reset EVERYTHING in this layer but you also unlock new things<br>
            To buy a new computer you need ${format(tmp.main.computerCost)} Units`
          },
          canClick() {
            return (player.main.units.gte(tmp.main.computerCost))
          },
          onClick() {
            tmp.main.computerReset()
            player.main.computer = player.main.computer.add(1)
          },
          style() {
            if (tmp[this.layer].clickables[this.id].canClick) return {
              "background": "radial-gradient(circle, rgba(251,255,252,1) 0%, rgba(127,131,131,1) 100%)",
              "width": "460px",
              "height": "130px",
              "border-radius": "10px",
              "border": "0px",
              "margin": "5px",
              "text-shadow": "0px 0px 15px #000000",
              "color": "#000000"
            }
            return {
              "width": "460px",
              "height": " 130px",
              "border-radius": "10px",
              "border": "0px",
              "margin": "5px",
              "text-shadow": "0px 0px 10px #000000",
              "color": "#ffffff"
            }
          },
          unlocked() {
            return true
          }
        },
    },
    buyables: {
      "TickspeedI": {
        cost(x) {
          let PowerI = new Decimal(10)
          let Calculation = new Decimal(1000).mul(Decimal.pow(PowerI, x.pow(1)))
          return Calculation;
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
        buy() {
          player[this.layer].units = player[this.layer].units.sub(this.cost())
          setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
          let PowerI = new Decimal(1.1)
          PowerI = PowerI.add(hasMilestone("main", "ComputerIII") ? 0.02 : 0)
          let Calculation = new Decimal(1).mul(Decimal.pow(PowerI, x.pow(1)))
          return Calculation
        },
        unlocked() {
          return hasMilestone("main", "ComputerII")
        }
      },
    "N1": {
      cost(x) {
        let PowerI = new Decimal(1)
        let Amount = player.main.buyables["N1"]
        let Magnitude = new Decimal.pow(1000, Amount.div(10).floor())
        let Calculation = new Decimal(10).mul(Decimal.pow(PowerI, x.pow(1)))
        Calculation = Calculation.mul(Magnitude)
        return Calculation;
      },
      display() {
        return `<b style="font-size:22px; text-shadow: 0px 0px 4px #000000">Node Mark I</b><br>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">${format(player.main.n1)} (${format(player[this.layer].buyables[this.id], 0)})</b>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">x${format(tmp[this.layer].buyables[this.id].bonusEffect)}</b>
        <b style="font-size:18px; text-shadow: 0px 0px 4px #000000">+${format(tmp[this.layer].buyables[this.id].effect)} Units / sec</b><br>
    <h1>${format(tmp[this.layer].buyables[this.id].cost)} Units</h1>`
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
          "height": " 130px",
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
        player.main.n1 = player.main.n1.add(1)
      },
      bonusEffect() {
        let Base = new Decimal(1)
        let BasePower = new Decimal(2)
        BasePower = BasePower.add(hasMilestone("main", "ComputerIII") ? 0.2 : 0)
        let Amount = player.main.buyables["N1"]
        let Magnitude = new Decimal.pow(BasePower, Amount.div(10).floor())
        Base = Base.mul(Magnitude)
        Base = Base.mul(hasMilestone("main", "ComputerI") ? 2 : 1)
        Base = Base.mul(hasMilestone("main", "ComputerII") ? 2 : 1)
        Base = Base.mul(hasMilestone("main", "ComputerIII") ? 2 : 1)
        return Base
      },
      effect(x) {
        let PowerI = player.main.n1
        
        
        let Effect = new Decimal(0).add(Decimal.add(PowerI))
        Effect = Effect.add(1)
        Effect = Effect.mul(tmp[this.layer].buyables[this.id].bonusEffect)
        Effect = Effect.mul(buyableEffect("main", "TickspeedI"))
        return Effect;
      },
      unlocked() {
        return true
      }
    },
    "N2": {
      cost(x) {
        let PowerI = new Decimal(1)
        let Amount = player.main.buyables["N2"]
        let Magnitude = new Decimal.pow(1000, Amount.div(10).floor())
        let Calculation = new Decimal(1000).mul(Decimal.pow(PowerI, x.pow(1)))
        Calculation = Calculation.mul(Magnitude)
        return Calculation;
      },
      display() {
        return `<b style="font-size:22px; text-shadow: 0px 0px 4px #000000">Node Mark II</b><br>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">${format(player.main.n2)} (${format(player[this.layer].buyables[this.id], 0)})</b>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">x${format(tmp[this.layer].buyables[this.id].bonusEffect)}</b>
        <b style="font-size:18px; text-shadow: 0px 0px 4px #000000">+${format(tmp[this.layer].buyables[this.id].effect)} Node MK.I / sec</b><br>
    <h1>${format(tmp[this.layer].buyables[this.id].cost)} Units</h1>`
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
          "height": " 130px",
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
        player.main.n2 = player.main.n2.add(1)
      },
      bonusEffect() {
        let Base = new Decimal(1)
        let Amount = player.main.buyables["N2"]
        let Magnitude = new Decimal.pow(2, Amount.div(10).floor())
        Base = Base.mul(Magnitude)
        Base = Base.mul(hasMilestone("main", "ComputerII") ? 2 : 1)
        Base = Base.mul(hasMilestone("main", "ComputerIII") ? 2 : 1)
        return Base
      },
      effect(x) {
        let PowerI = player.main.n2
        
        let Effect = new Decimal(0).add(Decimal.add(PowerI))
        Effect = Effect.mul(tmp[this.layer].buyables[this.id].bonusEffect)
        Effect = Effect.mul(buyableEffect("main", "TickspeedI"))
        return Effect;
      },
      unlocked() {
        return true
      }
    },
    "N3": {
      cost(x) {
        let PowerI = new Decimal(1)
        let Amount = player.main.buyables["N3"]
        let Magnitude = new Decimal.pow(1e6, Amount.div(10).floor())
        let Calculation = new Decimal(1e6).mul(Decimal.pow(PowerI, x.pow(1)))
        Calculation = Calculation.mul(Magnitude)
        return Calculation;
      },
      display() {
        return `<b style="font-size:22px; text-shadow: 0px 0px 4px #000000">Node Mark III</b><br>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">${format(player.main.n3)} (${format(player[this.layer].buyables[this.id], 0)})</b>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">x${format(tmp[this.layer].buyables[this.id].bonusEffect)}</b>
        <b style="font-size:18px; text-shadow: 0px 0px 4px #000000">+${format(tmp[this.layer].buyables[this.id].effect)} Node MK.II / sec</b><br>
    <h1>${format(tmp[this.layer].buyables[this.id].cost)} Units</h1>`
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
          "height": " 130px",
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
        player.main.n3 = player.main.n3.add(1)
      },
      bonusEffect() {
        let Base = new Decimal(1)
        let Amount = player.main.buyables["N3"]
        let Magnitude = new Decimal.pow(2, Amount.div(10).floor())
        Base = Base.mul(Magnitude)
        Base = Base.mul(hasMilestone("main", "ComputerIII") ? 2 : 1)
        return Base
      },
      effect(x) {
        let PowerI = player.main.n3
        
        let Effect = new Decimal(0).add(Decimal.add(PowerI))
        Effect = Effect.mul(tmp[this.layer].buyables[this.id].bonusEffect)
        Effect = Effect.mul(buyableEffect("main", "TickspeedI"))
        return Effect;
      },
      unlocked() {
        return hasMilestone("main", "ComputerI")
      }
    },
    "N4": {
      cost(x) {
        let PowerI = new Decimal(1)
        let Amount = player.main.buyables["N4"]
        let Magnitude = new Decimal.pow(1e12, Amount.div(10).floor())
        let Calculation = new Decimal(1e12).mul(Decimal.pow(PowerI, x.pow(1)))
        Calculation = Calculation.mul(Magnitude)
        return Calculation;
      },
      display() {
        return `<b style="font-size:22px; text-shadow: 0px 0px 4px #000000">Node Mark IV</b><br>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">${format(player.main.n4)} (${format(player[this.layer].buyables[this.id], 0)})</b>
        <b style="font-size:14px; text-shadow: 0px 0px 4px #000000">x${format(tmp[this.layer].buyables[this.id].bonusEffect)}</b>
        <b style="font-size:18px; text-shadow: 0px 0px 4px #000000">+${format(tmp[this.layer].buyables[this.id].effect)} Node MK.III / sec</b><br>
    <h1>${format(tmp[this.layer].buyables[this.id].cost)} Units</h1>`
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
          "height": " 130px",
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
        player.main.n4 = player.main.n4.add(1)
      },
      bonusEffect() {
        let Base = new Decimal(1)
        let Amount = player.main.buyables["N4"]
        let Magnitude = new Decimal.pow(2, Amount.div(10).floor())
        Base = Base.mul(Magnitude)
        return Base
      },
      effect(x) {
        let PowerI = player.main.n4
        
        let Effect = new Decimal(0).add(Decimal.add(PowerI))
        Effect = Effect.mul(tmp[this.layer].buyables[this.id].bonusEffect)
        Effect = Effect.mul(buyableEffect("main", "TickspeedI"))
        return Effect;
      },
      unlocked() {
        return hasMilestone("main", "ComputerII")
      }
    },

    },
    
    milestones: {
        "ComputerI": {
          requirementDescription() {
            return `<b style="font-size:32px; text-shadow: 0px 0px 10px #000000">1 Computer</b>`
          },
          done() { return player.main.computer.gte(1) },
          effectDescription: `<b style="font-size:22px">
          + Unlock Node Mark III<br>
          + 2.00x as starting boost to Node Mark I`,
          style() {
            return {
              "width": "600px",
              "height": "auto",
              "padding": "5px",
              "border": "0px solid",
              "border-radius": "10px",
            }
          },
          unlocked() {
            return player.main.computer.gte(1)
          }
        },
        "ComputerII": {
          requirementDescription() {
            return `<b style="font-size:32px; text-shadow: 0px 0px 10px #000000">2 Computers</b>`
          },
          done() { return player.main.computer.gte(2) },
          effectDescription: `<b style="font-size:22px">
                  + Unlock Node Mark IV<br>
                  + 2.00x as starting boost to Node Mark I , Node Mark II<br>
                  + Unlock Tickspeed`,
          style() {
            return {
              "width": "600px",
              "height": "auto",
              "padding": "5px",
              "border": "0px solid",
              "border-radius": "10px",
            }
          },
          unlocked() {
            return player.main.computer.gte(1)
          }
        },
        "ComputerIII": {
          requirementDescription() {
            return `<b style="font-size:32px; text-shadow: 0px 0px 10px #000000">3 Computers</b>`
          },
          done() { return player.main.computer.gte(3) },
          effectDescription: `<b style="font-size:22px">
                  + Node Mark I boost per 10 is increased from 2x > 2.2x<br>
                  + 2.00x as starting boost to Node Mark I , Node Mark II , Node Mark III<br>
                  + Tickspeed base is increased from 1.1x > 1.12x`,
          style() {
            return {
              "width": "600px",
              "height": "auto",
              "padding": "5px",
              "border": "0px solid",
              "border-radius": "10px",
            }
          },
          unlocked() {
            return player.main.computer.gte(2)
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
      ["row", [["buyable", "TickspeedI"]]],
      ["row", [["buyable", "N1"]]],
      ["row", [["buyable", "N2"]]],
      ["row", [["buyable", "N3"]]],
      ["row", [["buyable", "N4"]]]
      ]
    },
    "Computer": {
      unlocked() { return player.main.units.gte(10000) || player.main.computer.gte(1) },
      content: [
      "blank",
      ['raw-html', () => {
          return `<MA style='font-size: 24px'>You have <HI style='font-size: 30px; text-shadow: 0px 0px 20px'>${format(player.main.computer)}</HI> Computers</MA>`
                }],
      "blank",
      "blank",
      ["row", [["clickable", "Computer Reset"]]],
      "blank",
      "blank",
      "milestones"
      ]
    }
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true}
})
