addLayer("c", {
    name: "Computers", // This is optional, only used in a few places, If absent it just uses the layer id.
    rawText() {
      return `
              <p>L-2
              <p class='cBreak' style='font-size:14px'>${format(tmp.c.calculatePercentageFromLog10)}%<sup></sup></p>
              <p class='cBreak' style='font-size:8px'>${format(player.c.points)} Computers</p>
              </p>`
    },
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#cdcdcd",
    requires: new Decimal(10000), // Can be a function that takes requirement increases into account
    resource: "Computers", // Name of prestige currency
    baseResource: "Units", // Name of resource prestige is based on
    baseAmount() {return player.main.units}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    canBuyMax() {
      return hasMilestone("b", "BoosterII")
    },
    branches: ["main"],
    calculatePercentageFromLog10() {
      const maxLog10 = Math.log10(25); // Replace 'maxValue' with the maximum possible value
    
      const log10Value = Math.log10(player.c.points);
      const normalizedValue = log10Value / maxLog10;
      const percentage = normalizedValue * 100;
    
      return percentage;
    },
    computerBoost() {
     let Base = player.c.points
     let Power = new Decimal(2.15)
     
     return Decimal.pow(Power, Base)
    },
    milestones: {
        "ComputerI": {
          requirementDescription() {
            return `<b style="font-size:32px; text-shadow: 0px 0px 10px #000000">1 Computer</b>`
          },
          done() { return player.c.points.gte(1) },
          effectDescription: `<b style="font-size:22px">
              + Unlock Node Mark II`,
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
            return player.c.points.gte(1)
          }
        },
        "ComputerII": {
          requirementDescription() {
            return `<b style="font-size:32px; text-shadow: 0px 0px 10px #000000">4 Computers</b>`
          },
          done() { return player.c.points.gte(4) },
          effectDescription: `<b style="font-size:22px">
                      + Unlock Node Mark III<br>
                      + Buymax Node I automatically`,
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
            return hasMilestone("c", "ComputerI")
          }
        },
        "ComputerIII": {
          requirementDescription() {
            return `<b style="font-size:32px; text-shadow: 0px 0px 10px #000000">7 Computers</b>`
          },
          done() { return player.c.points.gte(7) },
          effectDescription: `<b style="font-size:22px">
          + 10x Units<br>
          + Unlock Node Mark IV<br>
          + Buymax Node II automatically`,
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
            return hasMilestone("c", "ComputerII")
          }
        },
        "ComputerIV": {
          requirementDescription() {
           return `<b style="font-size:32px; text-shadow: 0px 0px 10px #000000">11 Computers</b>`
          },
          done() { return player.c.points.gte(11) },
          effectDescription: `<b style="font-size:22px">
                  + 1,000x Units<br>
                  + Buymax Node III automatically`,
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
           return hasMilestone("c", "ComputerIII")
          }
         },
         "ComputerV": {
          requirementDescription() {
           return `<b style="font-size:32px; text-shadow: 0px 0px 10px #000000">15 Computers</b>`
          },
          done() { return player.c.points.gte(15) },
          effectDescription: `<b style="font-size:22px">
                           + Unlock Node Mark V<br>
                           + Buymax Node IV automatically`,
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
           return hasMilestone("c", "ComputerIV")
          }
         },
         "ComputerVI": {
          requirementDescription() {
           return `<b style="font-size:32px; text-shadow: 0px 0px 10px #000000">18 Computers</b>`
          },
          done() { return player.c.points.gte(18) },
          effectDescription: `<b style="font-size:22px">
                                    + Unlock Boosters`,
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
           return hasMilestone("c", "ComputerV")
          }
         },
         "ComputerVII": {
          requirementDescription() {
           return `<b style="font-size:32px; text-shadow: 0px 0px 10px #000000">32 Computers</b>`
          },
          done() { return player.c.points.gte(32) },
          effectDescription: `<b style="font-size:22px">
          + Unlock Node Mark VI<br>
          + Buymax Node Mark V automatically`,
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
           return hasMilestone("b", "BoosterI") && hasMilestone("c", "ComputerVI")
          }
         },
         "ComputerVII": {
          requirementDescription() {
           return `<b style="font-size:32px; text-shadow: 0px 0px 10px #000000">58 Computers</b>`
          },
          done() { return player.c.points.gte(58) },
          effectDescription: `<b style="font-size:22px">
                   + Gain 2.15x more Units per Computer you have right now`,
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
           return hasMilestone("b", "BoosterI") && hasMilestone("c", "ComputerVI")
          }
         },
         "ComputerVIII": {
          requirementDescription() {
           return `<b style="font-size:32px; text-shadow: 0px 0px 10px #000000">70 Computers</b>`
          },
          done() { return player.c.points.gte(70) },
          effectDescription: `<b style="font-size:22px">
          + Unlock Generators ( soon and if reached consider it as endgame of v3 )`,
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
           return hasMilestone("b", "BoosterI") && hasMilestone("c", "ComputerVI")
          }
         },
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})